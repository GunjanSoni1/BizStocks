import React from 'react';

const TopBar = ({ setCurrentPage, theme, toggleTheme, businessName, currentPage }) => {
  // Define page-specific titles
  const getPageTitle = () => {
    switch (currentPage) {
      case 'Overview':
        return 'Inventory Overview';
      case 'Dashboard':
        return 'Monitor your inventory performance and analytics';
      case 'Products':
        return 'Manage your product catalog and stock levels';
      case 'Sales':
        return 'Track sales records and revenue';
      case 'Add Product':
        return 'Add a new product to your inventory';
      case 'Edit Product':
        return 'Update product information';
      case 'Settings':
        return 'Manage your account and preferences';
      default:
        return 'Inventory Overview';
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 px-6 py-4 shadow-lg shadow-indigo-100 dark:bg-slate-900/70 dark:border-slate-700">
      <div>
        {currentPage !== 'Overview' && (
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            {businessName || 'Welcome Back'}
          </p>
        )}
        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {getPageTitle()}
        </p>
      </div>
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => setCurrentPage('Add Product')}
        className="inline-flex items-center justify-center rounded-2xl bg-slate-900 text-white w-10 h-10 font-semibold shadow-lg shadow-slate-900/30 hover:-translate-y-0.5 transition dark:bg-indigo-600 dark:shadow-indigo-500/40"
        title="Add Product"
      >
        <span className="text-lg">➕</span>
      </button>
      <button
        onClick={() => setCurrentPage('Sales')}
        className="inline-flex items-center justify-center rounded-2xl bg-white text-slate-900 w-10 h-10 font-semibold border border-slate-200 hover:-translate-y-0.5 transition dark:bg-slate-700 dark:text-slate-50 dark:border-slate-600"
        title="View Sales"
      >
        <span className="text-lg">💸</span>
      </button>
      <button
        onClick={() => setCurrentPage('Settings')}
        className="inline-flex items-center justify-center rounded-2xl w-10 h-10 font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition dark:bg-slate-700 dark:text-slate-50 dark:border-slate-600"
        title="Settings"
      >
        <span className="text-lg">⚙️</span>
      </button>
      <button
        onClick={toggleTheme}
        className="inline-flex items-center justify-center rounded-2xl w-10 h-10 font-semibold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 transition"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
      </button>
    </div>
    </div>
  );
};

export default TopBar;

