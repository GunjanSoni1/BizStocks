import React from 'react';

const ProductsList = ({ products, setCurrentPage, setEditingProduct, confirmDeleteProduct, showMessage }) => (
  <div className="space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="uppercase text-xs tracking-[0.4em] text-slate-500">Inventory</p>
        <h1 className="text-4xl font-bold text-slate-900">Product Catalog</h1>
      </div>
      <button
        onClick={() => setCurrentPage('Add Product')}
        className="inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 font-semibold shadow-lg shadow-emerald-500/40 hover:-translate-y-0.5 transition"
      >
        <span>➕</span> Add New Product
      </button>
    </div>
    
    <div className="overflow-hidden rounded-4xl border border-slate-100 shadow-xl bg-white">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Category</th>
            <th className="px-6 py-4 text-left">Price</th>
            <th className="px-6 py-4 text-left">Stock</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
          {products.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No products found. Add your first product to begin!</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/80 transition">
                <td className="px-6 py-5 font-semibold text-slate-900">{product.name}</td>
                <td className="px-6 py-5">{product.category}</td>
                <td className="px-6 py-5 font-semibold text-slate-900">₹{product.price.toFixed(2)}</td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    product.stock <= 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-5 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setCurrentPage('Edit Product');
                    }}
                    className="text-indigo-600 font-semibold hover:text-indigo-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDeleteProduct(product.id, product.name)}
                    className="text-rose-500 font-semibold hover:text-rose-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProductsList;

