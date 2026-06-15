import React, { useState } from 'react';

const QuickSaleForm = ({ products = [], handleRecordSale }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const product = products.find(p => p.id === selectedProductId);

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!product) {
      setError('Please select a valid product.');
      return;
    }
    if (quantity <= 0) {
      setError('Quantity must be positive.');
      return;
    }
    if (product.stock < quantity) {
      setError(`Insufficient stock. Only ${product.stock} available.`);
      return;
    }
    
    handleRecordSale({ productId: selectedProductId, quantity });
    setSelectedProductId('');
    setQuantity(1);
  };

  // Filter products to only show those currently in stock
  const availableProducts = products.filter(p => p.stock > 0);

  return (
    <div className="h-full rounded-4xl bg-white/90 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Quick Sale Entry</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Log a sale and auto-adjust inventory instantly.</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-sm font-semibold">Live Stock Sync</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 pt-5">
        <div>
          <label htmlFor="productSelect" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Product</label>
          <select
            id="productSelect"
            value={selectedProductId}
            onChange={(e) => {
                setSelectedProductId(e.target.value);
                setError(''); // Clear error on product change
            }}
            className="mt-2 block w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            required
          >
            <option value="">-- Select Product --</option>
            {availableProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
            ))}
          </select>
          {availableProducts.length === 0 && (
            <p className="mt-2 text-xs text-rose-500">No products are currently in stock to sell.</p>
          )}
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-slate-600 dark:text-slate-300">Quantity Sold</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max={product?.stock || 1000}
            className="mt-2 block w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            required
          />
        </div>
        {product && (
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 flex flex-col gap-1">
            <span>Price/Unit: <strong>{formatCurrency(product.price)}</strong></span>
            <span>Estimated Total: <strong>{formatCurrency(product.price * quantity)}</strong></span>
          </div>
        )}
        {error && <p className="text-sm text-rose-500 font-semibold">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 text-lg font-semibold shadow-lg shadow-indigo-500/40 hover:-translate-y-0.5 transition"
        >
          Record Sale
        </button>
      </form>
    </div>
  );
};

export default QuickSaleForm;