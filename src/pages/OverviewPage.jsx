import React from 'react';


const SummaryCard = ({ title, value, color, icon, onClick }) => (
  <button
    type="button"
    onClick={(e) => {
      console.log(`Card clicked: ${title}`);
      if (onClick) onClick(e);
    }}
    className={`w-full text-left rounded-xl p-6 shadow-lg transition-all border border-white/70 ${color} cursor-pointer hover:scale-105 active:scale-95 flex flex-col`}
  >
    <div className="text-3xl mb-3">{icon}</div>
    <p className="text-sm font-medium text-white/80">{title}</p>
    <h2 className="text-4xl font-extrabold text-white mt-1">{value}</h2>
  </button>
);

const OverviewPage = ({ products = [], sales = [], activity = [], setCurrentPage }) => {
  const totalProducts = products.length;
  // FIXED: Syntax error: 'total Revenue' -> 'totalRevenue'
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  // Count items with low stock (between 1 and 10)
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);



  return (
    <div className="space-y-8 p-4 md:p-0">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Welcome to BizStock</h1>
      <p className="text-slate-600 dark:text-slate-400">Your high-level inventory overview.</p>

      {/* Project Description */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 border border-indigo-100 dark:border-indigo-800/50">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">About BizStock</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          BizStock is a modern inventory management system designed to streamline your business operations and enhance productivity.
          It helps you track products, monitor stock levels, record sales, and generate real-time analytics - all in one intuitive platform.
          With automated low-stock alerts and comprehensive sales tracking, BizStock empowers businesses to make data-driven decisions,
          reduce operational costs, and optimize inventory turnover for better profitability.
        </p>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Products"
          value={totalProducts}
          icon="📦"
          color="bg-indigo-500 hover:bg-indigo-600"
          onClick={() => setCurrentPage('Products')}
        />
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon="💸"
          color="bg-emerald-500 hover:bg-emerald-600"
          onClick={() => setCurrentPage('Sales')}
        />
        <SummaryCard
          title="Low Stock Alerts"
          value={lowStockCount}
          icon="⚠️"
          color="bg-amber-500 hover:bg-amber-600"
          onClick={() => setCurrentPage('Products')}
        />
      </div>

      {/* Activity Feed and Quick Links */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">Recent Activity ({activity.length})</h2>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {activity.slice(0, 5).map((item, index) => (
              <li key={index} className="text-sm text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">
                <span className="font-semibold">{item.title}</span> - {item.description}
              </li>
            ))}
            {activity.length === 0 && <li className="text-sm text-slate-500">No recent activity.</li>}
          </ul>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">Quick Links</h2>
          <div className="space-y-3">
            <button
              onClick={() => setCurrentPage('Products')}
              className="w-full text-left p-3 rounded-lg bg-indigo-50 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-slate-600 transition text-indigo-700 dark:text-indigo-400"
            >
              Go to Products List
            </button>
            <button
              onClick={() => setCurrentPage('Sales')}
              className="w-full text-left p-3 rounded-lg bg-emerald-50 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-600 transition text-emerald-700 dark:text-emerald-400"
            >
              View Sales Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

