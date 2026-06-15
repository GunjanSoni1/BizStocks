import React, { useState } from 'react';

const ProductForm = ({ initialData, onSubmit, title, setCurrentPage, showMessage }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    price: initialData?.price?.toString() || '',
    stock: initialData?.stock?.toString() || '',
    description: initialData?.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Client-side validation
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      showMessage("Please fill in the Name, Category, Price, and Stock fields.", 'error');
      return;
    }
    if (parseFloat(formData.price) <= 0 || parseInt(formData.stock) < 0) {
        showMessage("Price must be greater than zero, and stock cannot be negative.", 'error');
        return;
    }
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-4xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 shadow-2xl">
        <p className="uppercase text-xs tracking-[0.6em] text-white/70">Inventory Form</p>
        <h1 className="text-4xl font-bold mt-4">{title}</h1>
        <p className="text-white/80 mt-2">Capture product details with a sleek, modern interface.</p>
      </div>
      <div className="bg-white/90 border border-slate-100 rounded-4xl shadow-xl p-8 dark:bg-slate-800/80 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="text-sm font-semibold text-slate-600 dark:text-slate-300">Product Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="text-sm font-semibold text-slate-600 dark:text-slate-300">Category</label>
              <input
                type="text"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="price" className="text-sm font-semibold text-slate-600 dark:text-slate-300">Unit Price (₹)</label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="stock" className="text-sm font-semibold text-slate-600 dark:text-slate-300">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                id="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                step="1"
                className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="text-sm font-semibold text-slate-600 dark:text-slate-300">Description (Optional)</label>
            <textarea
              name="description"
              id="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage('Products')}
              className="px-5 py-3 rounded-3xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition"
            >
              {initialData ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

