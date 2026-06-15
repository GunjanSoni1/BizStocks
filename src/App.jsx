import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Import components
import MessageModal from './components/MessageModal';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import SettingsPage from './components/SettingsPage';
import ProductForm from './components/ProductForm';

// Import pages
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/ProductsList';
import SalesPage from './pages/SalesPage';
import OverviewPage from './pages/OverviewPage';
import LoginPage from './pages/LoginPage';

// Import API utilities
import { authAPI, productsAPI, salesAPI, activityAPI, startPolling } from './utils/api';
import { SAMPLE_PRODUCTS, SAMPLE_SALES } from './config/constants';

// --- Main App Component ---

const App = () => {
  const [userId, setUserId] = useState(null);
  const [appUser, setAppUser] = useState(() => {
    try {
      const sessionKey = 'bizstock-user-session';
      const stored = localStorage.getItem(sessionKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed;
      }
    } catch (e) {
      console.warn('Unable to read user session from localStorage', e);
    }
    return null;
  });
  const [loading, setLoading] = useState(() => !appUser);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [activity, setActivity] = useState([]);
  const [currentPageState, setCurrentPageState] = useState('Overview');

  const setCurrentPage = (page) => {
    console.log(`Navigation Requested: ${page}`);
    setCurrentPageState(page);
  };
  const currentPage = currentPageState;
  const [editingProduct, setEditingProduct] = useState(null);
  const [isMockMode, setIsMockMode] = useState(false);

  // State for the custom modal
  const [message, setMessage] = useState(null);
  const [theme, setTheme] = useState('light');
  const [businessName, setBusinessName] = useState(() => {
    try {
      const storedKey = 'bizstock-business-name';
      return localStorage.getItem(storedKey) || '';
    } catch (e) {
      return '';
    }
  });

  const showMessage = useCallback((msg, type = 'info', onConfirm = null, onCancel = null) => {
    setMessage({ msg, type, onConfirm, onCancel });
  }, []);

  const closeModal = useCallback(() => setMessage(null), []);

  const bootstrapMockMode = useCallback(() => {
    setIsMockMode(true);
    setUserId('local-user');
    // Ensure products are loaded in mock mode
    if (products.length === 0) {
      setProducts(SAMPLE_PRODUCTS);
    }
    if (sales.length === 0) {
      setSales(SAMPLE_SALES);
    }
    setLoading(false);
  }, [products.length, sales.length]);

  const generateId = () => `${Math.random().toString(36).slice(2, 9)}-${Date.now()}`;

  const addActivity = useCallback((title, description, meta = {}) => {
    const entry = {
      id: generateId(),
      title,
      description,
      meta,
      createdAt: new Date().toISOString(),
    };
    setActivity(prev => [entry, ...prev].slice(0, 50)); // Keep last 50

    // Also save to backend if not in mock mode
    if (!isMockMode && userId) {
      activityAPI.create({ title, description, meta }).catch(err => {
        console.warn('Failed to save activity to backend:', err);
      });
    }
  }, [isMockMode, userId]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (!appUser) {
        setLoading(false);
        return;
      }

      // Check if we have a token
      const token = localStorage.getItem('authToken');
      if (!token) {
        // No token, but user session exists - might be mock mode
        setLoading(false);
        if (products.length === 0) {
          setProducts(SAMPLE_PRODUCTS);
        }
        return;
      }

      try {
        const user = await authAPI.getCurrentUser();
        setAppUser({ uid: user.uid, email: user.email, displayName: user.displayName, businessName: user.businessName });
        setUserId(user.uid);
        setBusinessName(user.businessName || '');
        setIsMockMode(false);
        setLoading(false);
      } catch (error) {
        console.warn('Session expired or invalid:', error);
        // Keep mock mode active if backend auth fails
        if (products.length === 0) {
          setProducts(SAMPLE_PRODUCTS);
        }
        setUserId('local-user');
        setIsMockMode(true);
        setLoading(false);
      }
    };
    checkSession();
  }, []); // Only run on mount to restore session

  // Persist user session to localStorage
  useEffect(() => {
    const sessionKey = 'bizstock-user-session';
    try {
      if (appUser) {
        localStorage.setItem(sessionKey, JSON.stringify(appUser));
      } else {
        localStorage.removeItem(sessionKey);
      }
    } catch (e) {
      console.warn('Unable to persist user session', e);
    }
  }, [appUser]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Check if we should use mock mode (no backend available)
  useEffect(() => {
    const checkBackend = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
          console.log('✅ Backend server detected');
          setIsMockMode(false);
          // If user is logged in, we'll fetch data in the next useEffect
        } else {
          throw new Error('Backend not responding');
        }
      } catch (error) {
        console.warn('⚠️ Backend not available, using mock mode');
        setIsMockMode(true);
        // Only bootstrap mock mode if we don't have a user session
        if (!appUser) {
          bootstrapMockMode();
        } else if (products.length === 0) {
          // If we have a user but no products, load sample data
          setProducts(SAMPLE_PRODUCTS);
          setUserId('local-user');
        }
      }
    };

    checkBackend();
    // Re-check every 5 seconds to detect when backend comes online
    const interval = setInterval(checkBackend, 5000);
    return () => clearInterval(interval);
  }, [bootstrapMockMode, appUser, products.length]);

  // Fetch data from API (products and sales)
  useEffect(() => {
    if (isMockMode) {
      // In mock mode, ensure products are loaded
      if (products.length === 0) {
        setProducts(SAMPLE_PRODUCTS);
      }
      return;
    }

    if (!userId) return;

    const fetchData = async () => {
      try {
        const [productsData, salesData, activityData] = await Promise.all([
          productsAPI.getAll(),
          salesAPI.getAll(),
          activityAPI.getAll(),
        ]);

        // Auto-seed if empty and online
        if (productsData.length === 0) {
          console.log('📦 No products found. Seeding default data...');
          const seededProducts = [];
          for (const p of SAMPLE_PRODUCTS) {
            try {
              const newP = await productsAPI.create({ ...p, stock: p.stock, price: p.price });
              seededProducts.push(newP);
            } catch (err) {
              console.warn('Failed to seed product:', p.name, err);
            }
          }
          if (seededProducts.length > 0) {
            setProducts(seededProducts);
            showMessage('Welcome! Default products have been added to your inventory.', 'success');
          } else {
            setProducts([]);
          }
        } else {
          setProducts(productsData);
        }

        setSales(salesData);
        setActivity(activityData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // If API fails, fall back to mock mode products
        if (products.length === 0) {
          setProducts(SAMPLE_PRODUCTS);
        }
        showMessage('Failed to load data from server. Using local data.', 'warning');
      }
    };

    fetchData();

    // Poll for updates every 2 seconds (replace Firebase real-time)
    const stopPolling = startPolling(({ products: newProducts, sales: newSales }) => {
      setProducts(newProducts);
      setSales(newSales);
    }, 2000);

    return () => stopPolling();
  }, [userId, isMockMode, showMessage, products.length]);

  // --- Data Handlers ---
  const toCurrencyNumber = (value) => parseFloat(value) || 0;
  const toInteger = (value) => parseInt(value, 10) || 0;

  const handleAddProduct = async (productData) => {
    if (isMockMode) {
      const newProduct = {
        id: generateId(),
        ...productData,
        stock: toInteger(productData.stock),
        price: toCurrencyNumber(productData.price),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: userId || 'local-user',
      };
      setProducts(prev => [...prev, newProduct]);
      setCurrentPage('Products');
      showMessage(`Product '${productData.name}' added successfully!`, 'success');
      addActivity('New product created', `Added '${productData.name}' to the catalog.`, {
        productName: productData.name,
      });
      return;
    }

    try {
      console.log('Attempting to create product:', productData);
      await productsAPI.create(productData);
      // Refresh products
      const updatedProducts = await productsAPI.getAll();
      setProducts(updatedProducts);
      setCurrentPage('Products');
      showMessage(`Product '${productData.name}' added successfully!`, 'success');
      addActivity('New product created', `Added '${productData.name}' to the catalog.`, {
        productName: productData.name,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      // If API fails due to auth, fall back to mock mode
      if (error.message.includes('Authentication') || error.message.includes('401')) {
        showMessage(`Authentication failed. Using offline mode.`, 'warning');
        setIsMockMode(true);
        // Add to local state
        const newProduct = {
          id: generateId(),
          ...productData,
          stock: toInteger(productData.stock),
          price: toCurrencyNumber(productData.price),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'local-user',
        };
        setProducts(prev => [...prev, newProduct]);
        setCurrentPage('Products');
        showMessage(`Product '${productData.name}' added (offline mode)!`, 'success');
      } else {
        showMessage(`Failed to add product: ${error.message}`, 'error');
      }
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    if (isMockMode) {
      setProducts(prev => prev.map(p => (
        p.id === productId
          ? {
            ...p,
            ...productData,
            stock: toInteger(productData.stock),
            price: toCurrencyNumber(productData.price),
            updatedAt: new Date().toISOString(),
          }
          : p
      )));
      setEditingProduct(null);
      setCurrentPage('Products');
      showMessage(`Product updated successfully!`, 'success');
      addActivity('Product updated', `Updated '${productData.name}' details.`, {
        productName: productData.name,
      });
      return;
    }

    try {
      await productsAPI.update(productId, productData);
      // Refresh products
      const updatedProducts = await productsAPI.getAll();
      setProducts(updatedProducts);
      setEditingProduct(null);
      setCurrentPage('Products');
      showMessage(`Product updated successfully!`, 'success');
      addActivity('Product updated', `Updated '${productData.name}' details.`, {
        productName: productData.name,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      showMessage(`Failed to update product: ${error.message}`, 'error');
    }
  };

  const confirmDeleteProduct = (productId, productName) => {
    showMessage(
      `Are you sure you want to permanently delete the product '${productName}'? This action cannot be undone.`,
      'confirm',
      () => handleDeleteProduct(productId),
      closeModal
    );
  };

  const handleDeleteProduct = async (productId) => {
    closeModal();

    if (isMockMode) {
      setProducts(prev => {
        const product = prev.find(p => p.id === productId);
        if (product) {
          addActivity('Product deleted', `Removed '${product.name}' from inventory.`, {
            productName: product.name,
          });
        }
        return prev.filter(p => p.id !== productId);
      });
      showMessage('Product deleted successfully.', 'success');
      return;
    }

    try {
      const product = products.find(p => p.id === productId);
      await productsAPI.delete(productId);
      // Refresh products
      const updatedProducts = await productsAPI.getAll();
      setProducts(updatedProducts);
      showMessage('Product deleted successfully.', 'success');
      if (product) {
        addActivity('Product deleted', `Removed '${product.name}' from inventory.`, {
          productName: product.name,
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showMessage(`Error deleting product: ${error.message}`, 'error');
    }
  };

  const handleRecordSale = async (saleData) => {
    if (isMockMode) {
      const { productId } = saleData;
      const saleQuantity = toInteger(saleData.quantity);
      const product = products.find(p => p.id === productId);
      if (!product) {
        showMessage('Product not found.', 'error');
        return;
      }
      if (product.stock < saleQuantity) {
        showMessage('Insufficient stock.', 'error');
        return;
      }

      const total = parseFloat(saleQuantity * product.price);
      const saleDate = new Date();
      const newSale = {
        id: generateId(),
        productId,
        productName: product.name,
        quantity: saleQuantity,
        pricePerUnit: parseFloat(product.price) || 0,
        total: total,
        timestamp: saleDate.toISOString(),
        recordedBy: userId || 'local-user',
      };
      setSales(prev => [newSale, ...prev]);
      setProducts(prev => prev.map(p => (
        p.id === productId ? { ...p, stock: p.stock - saleQuantity, updatedAt: new Date().toISOString() } : p
      )));
      showMessage(`Sale recorded successfully!`, 'success');
      addActivity('Sale recorded', `Sold ${saleQuantity} × ${product.name}.`, {
        productName: product.name,
        quantity: saleQuantity,
        total,
      });
      return;
    }

    try {
      await salesAPI.create(saleData);
      // Refresh both sales and products (stock updated)
      const [updatedSales, updatedProducts] = await Promise.all([
        salesAPI.getAll(),
        productsAPI.getAll(),
      ]);
      setSales(updatedSales);
      setProducts(updatedProducts);
      showMessage(`Sale recorded successfully!`, 'success');

      const product = products.find(p => p.id === saleData.productId);
      if (product) {
        addActivity('Sale recorded', `Sold ${saleData.quantity} × ${product.name}.`, {
          productName: product.name,
          quantity: saleData.quantity,
          total: parseFloat(saleData.quantity * product.price),
        });
      }
    } catch (error) {
      console.error("Error recording sale:", error);
      // If API fails due to auth, fall back to mock mode
      if (error.message.includes('Authentication') || error.message.includes('401')) {
        showMessage(`Authentication failed. Using offline mode.`, 'warning');
        setIsMockMode(true);
        // Record sale in mock mode
        const { productId } = saleData;
        const saleQuantity = toInteger(saleData.quantity);
        const product = products.find(p => p.id === productId);
        if (!product) {
          showMessage('Product not found.', 'error');
          return;
        }
        if (product.stock < saleQuantity) {
          showMessage('Insufficient stock.', 'error');
          return;
        }
        const total = parseFloat(saleQuantity * product.price);
        const saleDate = new Date();
        const newSale = {
          id: generateId(),
          productId,
          productName: product.name,
          quantity: saleQuantity,
          pricePerUnit: parseFloat(product.price) || 0,
          total: total,
          timestamp: saleDate.toISOString(),
          recordedBy: 'local-user',
        };
        setSales(prev => [newSale, ...prev]);
        setProducts(prev => prev.map(p => (
          p.id === productId ? { ...p, stock: p.stock - saleQuantity, updatedAt: new Date().toISOString() } : p
        )));
        showMessage(`Sale recorded successfully (offline mode)!`, 'success');
        addActivity('Sale recorded', `Sold ${saleQuantity} × ${product.name}.`, {
          productName: product.name,
          quantity: saleQuantity,
          total,
        });
      } else {
        showMessage(`Failed to record sale: ${error.message}`, 'error');
      }
    }
  };

  const handleUpdateBusinessName = async (newName) => {
    setBusinessName(newName);
    localStorage.setItem('bizstock-business-name', newName);

    if (!isMockMode && userId) {
      try {
        const updatedUser = await authAPI.updateBusinessName(newName);
        setAppUser(prev => ({ ...prev, businessName: updatedUser.businessName }));
      } catch (error) {
        console.error('Failed to update business name on server:', error);
      }
    }
  };

  const handleUpdateProfile = async (displayName) => {
    setAppUser(prev => ({ ...prev, displayName }));

    if (!isMockMode && userId) {
      try {
        await authAPI.updateProfile(displayName);
        showMessage('Profile updated successfully!', 'success');
      } catch (error) {
        console.error('Failed to update profile on server:', error);
        showMessage('Failed to update profile on server.', 'error');
      }
    } else {
      showMessage(`Profile for ${displayName} saved.`, 'success');
    }
  };

  const handleLogout = async () => {
    try {
      if (!isMockMode) {
        await authAPI.logout();
      }
    } catch (error) {
      console.warn('Error during logout:', error);
    } finally {
      setAppUser(null);
      setUserId(null);
      setProducts([]);
      setSales([]);
      setActivity([]);
      localStorage.removeItem('bizstock-user-session');
      localStorage.removeItem('authToken');
      setCurrentPage('Overview');
      showMessage('You have been logged out.', 'info');
    }
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    if (isMockMode) {
      showMessage('Password change is not available in mock mode.', 'info');
      return;
    }

    try {
      await authAPI.changePassword(oldPassword, newPassword);
      showMessage('Password changed successfully!', 'success');
    } catch (error) {
      showMessage(`Failed to change password: ${error.message}`, 'error');
    }
  };

  // --- Render Components ---

  // --- Router Logic ---

  const renderContent = () => {
    if (!appUser) {
      return <LoginPage setAppUser={setAppUser} setCurrentPage={setCurrentPage} showMessage={showMessage} closeModal={closeModal} setUserId={setUserId} setIsMockMode={setIsMockMode} />;
    }

    switch (currentPage) {
      case 'Overview':
        return <OverviewPage products={products} sales={sales} activity={activity} setCurrentPage={setCurrentPage} />;
      case 'Dashboard':
        return <Dashboard products={products} sales={sales} activity={activity} handleRecordSale={handleRecordSale} />;
      case 'Products':
        return (
          <ProductsList
            products={products}
            setEditingProduct={setEditingProduct}
            setCurrentPage={setCurrentPage}
            confirmDeleteProduct={confirmDeleteProduct}
            showMessage={showMessage}
          />
        );
      case 'Add Product':
        return (
          <ProductForm
            onSubmit={handleAddProduct}
            title="Add New Product"
            setCurrentPage={setCurrentPage}
            showMessage={showMessage}
          />
        );
      case 'Edit Product':
        if (!editingProduct) {
          return (
            <div className="p-6">
              <h1 className="text-3xl font-extrabold text-red-500">Error: No Product Selected for Editing.</h1>
              <button onClick={() => setCurrentPage('Products')} className="text-indigo-600 mt-4">
                Go back to Products
              </button>
            </div>
          );
        }
        return (
          <ProductForm
            initialData={editingProduct}
            onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
            title={`Edit Product: ${editingProduct.name}`}
            setCurrentPage={setCurrentPage}
            showMessage={showMessage}
          />
        );
      case 'Sales':
        return <SalesPage sales={sales} products={products} handleRecordSale={handleRecordSale} setCurrentPage={setCurrentPage} />;
      case 'Settings':
        return (
          <SettingsPage
            theme={theme}
            toggleTheme={toggleTheme}
            appUser={appUser}
            userId={userId}
            businessName={businessName}
            onBusinessNameChange={handleUpdateBusinessName}
            onSaveProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
            setAppUser={setAppUser}
            setCurrentPage={setCurrentPage}
            showMessage={showMessage}
            closeModal={closeModal}
            auth={null}
            isMockMode={isMockMode}
            onLogout={handleLogout}
          />
        );
      default:
        return <OverviewPage products={products} sales={sales} activity={activity} setCurrentPage={setCurrentPage} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const mainContentClass = appUser
    ? "flex-1 overflow-y-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6"
    : "";

  return (
    <div className={`min-h-screen flex ${appUser ? 'flex-row' : 'flex-col'}`}>
      {appUser && (
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setEditingProduct={setEditingProduct}
          appUser={appUser}
          auth={null}
          showMessage={showMessage}
          setAppUser={setAppUser}
          onLogout={handleLogout}
        />
      )}
      <div className={mainContentClass}>
        {appUser && (
          <TopBar
            setCurrentPage={setCurrentPage}
            theme={theme}
            toggleTheme={toggleTheme}
            businessName={businessName}
            currentPage={currentPage}
          />
        )}
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
      {message && (
        <MessageModal
          message={message.msg}
          type={message.type}
          onClose={closeModal}
          onConfirm={message.onConfirm}
          onCancel={message.onCancel}
        />
      )}
    </div>
  );
};

export default App;

