import React from 'react';
import QuickSaleForm from '../components/QuickSaleForm';

const SalesPage = ({ sales = [], products = [], handleRecordSale, setCurrentPage }) => {
  // Sort sales by timestamp descending - handle ISO strings, Date objects, or locale strings
  const sortedSales = [...sales].sort((a, b) => {
    const getDate = (sale) => {
      if (!sale.timestamp) return new Date(0);
      if (sale.timestamp instanceof Date) return sale.timestamp;
      if (typeof sale.timestamp === 'string') {
        const date = new Date(sale.timestamp);
        return isNaN(date.getTime()) ? new Date(0) : date;
      }
      return new Date(0);
    };
    return getDate(b) - getDate(a);
  });

  // Format timestamp for display
  const formatTimestamp = (sale) => {
    if (!sale.timestamp) return 'N/A';
    try {
      if (sale.timestamp instanceof Date) {
        return sale.timestamp.toLocaleString();
      }
      if (typeof sale.timestamp === 'string') {
        const date = new Date(sale.timestamp);
        if (!isNaN(date.getTime())) {
          return date.toLocaleString();
        }
        return sale.timestamp; // Return as-is if it's already a formatted string
      }
    } catch (e) {
      console.warn('Error formatting timestamp:', e);
    }
    return 'N/A';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="uppercase text-xs tracking-[0.4em] text-slate-500 dark:text-slate-400">Revenue</p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Sales Records</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage?.('Dashboard')}
            className="px-5 py-2 rounded-3xl bg-slate-900 dark:bg-indigo-600 text-white font-semibold hover:-translate-y-0.5 transition shadow-lg shadow-slate-900/30 dark:shadow-indigo-500/40"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => setCurrentPage?.('Add Product')}
            className="px-5 py-2 rounded-3xl bg-slate-900 dark:bg-indigo-600 text-white font-semibold hover:-translate-y-0.5 transition shadow-lg shadow-slate-900/30 dark:shadow-indigo-500/40"
          >
            + Add Product
          </button>
        </div>
      </div>

      <QuickSaleForm products={products} handleRecordSale={handleRecordSale} />

      <div className="overflow-hidden rounded-4xl border border-slate-100 shadow-xl bg-white">
        <table className="min-w-full">
          <thead className="bg-slate-900 text-white/80 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Quantity</th>
              <th className="px-6 py-4 text-left">Price/Unit</th>
              <th className="px-6 py-4 text-left">Total Revenue</th>
              <th className="px-6 py-4 text-left">Recorded By (UID)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-600 bg-white">
            {sortedSales.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              sortedSales.map((sale) => (
                <tr key={sale.id || Math.random()} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">{formatTimestamp(sale)}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{sale.productName || 'Unknown'}</td>
                  <td className="px-6 py-4">{sale.quantity || 0}</td>
                  <td className="px-6 py-4">₹{(sale.pricePerUnit || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">₹{((sale.total) || (sale.quantity * sale.pricePerUnit) || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-xs text-slate-400 break-all">{sale.recordedBy || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;
