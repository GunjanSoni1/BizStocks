import React, { useMemo } from 'react';
// Note: Assuming QuickSaleForm exists in the components directory at the correct path.
import QuickSaleForm from '../components/QuickSaleForm'; 

// Helper function to check if a date string represents today (handles timezones)
const isToday = (dateStr) => {
  if (!dateStr) return false;
  try {
    const saleDate = new Date(dateStr);
    if (isNaN(saleDate.getTime())) return false;
    
    const today = new Date();
    // Normalize both dates to local date (ignore time)
    const saleDateLocal = new Date(saleDate.getFullYear(), saleDate.getMonth(), saleDate.getDate());
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return saleDateLocal.getTime() === todayLocal.getTime();
  } catch (e) {
    console.warn('Error checking if date is today:', dateStr, e);
    return false;
  }
};

const StatCard = ({ title, value, icon, color }) => (
  <div className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 bg-gradient-to-br ${color}`}>
    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
    <div className="relative z-10 flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-white/20 grid place-items-center text-2xl">{icon}</div>
      <div>
        <p className="text-sm uppercase tracking-widest text-white/70">{title}</p>
        <h3 className="text-3xl font-semibold">{value}</h3>
      </div>
    </div>
  </div>
);

const Dashboard = ({ products, sales, activity, handleRecordSale }) => {
  const totalProducts = products?.length || 0;
  const totalStockValue = (products || []).reduce((acc, p) => acc + (parseFloat(p.stock) || 0) * (parseFloat(p.price) || 0), 0);
  const totalRevenue = (sales || []).reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0);

  // Currency formatting utility
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  
  const totalSalesToday = useMemo(() => {
    if (!sales || sales.length === 0) return 0;
    
    return sales
      .filter(s => s.timestamp && isToday(s.timestamp))
      .reduce((acc, s) => acc + (parseFloat(s.total) || 0), 0);
  }, [sales]);

  const lowStockItems = useMemo(() => products.filter(p => p.stock < 10 && p.stock > 0).slice(0, 5), [products]);
  const outOfStockItems = useMemo(() => products.filter(p => p.stock === 0).slice(0, 5), [products]);
  
  const salesByDay = useMemo(() => {
    const map = {};
    sales.forEach(s => {
      if (!s.timestamp) return;
      // Handle ISO strings, Date objects, or locale strings
      let saleDate;
      if (s.timestamp instanceof Date) {
        saleDate = s.timestamp;
      } else if (typeof s.timestamp === 'string') {
        saleDate = new Date(s.timestamp);
        if (isNaN(saleDate.getTime())) return; // Skip invalid dates
      } else {
        return;
      }
      const day = saleDate.toLocaleDateString(); 
      map[day] = (map[day] || 0) + (parseFloat(s.total) || 0);
    });
    return Object.entries(map).sort((a, b) => new Date(a[0]) - new Date(b[0])).slice(-7);
  }, [sales]);
  
  const maxSalesForChart = salesByDay.reduce((max, [, total]) => Math.max(max, total), 0) || 1;

  const ActivityFeed = () => (
    <div className="rounded-4xl bg-white/90 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Recent Activity</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em]">LAST {Math.min(activity.length, 6) || 0} EVENTS</span>
      </div>
      {activity.length === 0 ? (
        <p className="text-sm text-slate-500">Activity will appear here as you add products and record sales.</p>
      ) : (
        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {activity.slice(0, 8).map((item, index) => (
            <li key={item.id || index} className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{item.timestamp}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Dashboard Header Card */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white p-10 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_60%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.6em] text-white/60">Live Performance</p>
            <h1 className="text-4xl font-bold leading-tight">Inventory Dashboard</h1>
            <p className="text-white/70 max-w-2xl">Keep an eye on stock levels, sales velocity, and revenue in one beautifully designed place.</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-white/15 text-sm font-semibold">⚡ Real-time Sync</span>
              <span className="px-4 py-2 rounded-full bg-white/15 text-sm font-semibold">🔔 Smart Alerts</span>
              <span className="px-4 py-2 rounded-full bg-white/15 text-sm font-semibold">🛡️ Secure Access</span>
            </div>
          </div>
          <div className="relative max-w-xs mx-auto">
            <div className="h-48 w-48 rounded-full bg-white/10 blur-3xl absolute -top-10 -right-6" />
            <div className="relative rounded-3xl bg-white/10 border border-white/30 px-6 py-6 backdrop-blur-xl text-center">
              <p className="text-sm uppercase tracking-[0.5em] text-white/70">Today</p>
              <p className="text-5xl font-bold mt-4">{formatCurrency(totalSalesToday)}</p>
              <p className="text-white/60 mt-2">Total Sales</p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={totalProducts} icon="📦" color="from-indigo-500 via-indigo-400 to-indigo-600" />
        <StatCard title="Inventory Value" value={formatCurrency(totalStockValue)} icon="💰" color="from-emerald-500 via-emerald-400 to-emerald-600" />
        <StatCard title="Revenue (All Time)" value={formatCurrency(totalRevenue)} icon="💸" color="from-amber-500 via-orange-400 to-amber-600" />
        <StatCard title="Sales Today" value={formatCurrency(totalSalesToday)} icon="📈" color="from-fuchsia-500 via-purple-400 to-purple-600" />
      </div>

      {/* Quick Sale, Stock Alerts, and Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Stock Alerts */}
        <div className="col-span-1 rounded-4xl bg-white/80 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 p-6 shadow-lg space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              ⚠️ Low Stock Alerts <span className="text-sm text-slate-500 dark:text-slate-400">({lowStockItems.length})</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Re-stock before inventory runs dry.</p>
          </div>
          {lowStockItems.length > 0 ? (
            <ul className="space-y-3">
              {lowStockItems.map(p => (
                <li key={p.id} className="flex items-center justify-between rounded-2xl border border-amber-100 dark:border-amber-900 p-3 bg-amber-50/60 dark:bg-amber-950/60">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-50">{p.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.category}</p>
                  </div>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{p.stock} left</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 p-4 text-slate-500 dark:text-slate-400 text-sm">All stocked products look healthy right now 🎉</div>
          )}
          {outOfStockItems.length > 0 && (
            <div className="rounded-2xl border border-rose-100 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/60 p-4">
              <h3 className="font-semibold text-rose-600 dark:text-rose-400 mb-2">Out of Stock ({outOfStockItems.length})</h3>
              <ul className="text-sm text-rose-700 dark:text-rose-300 space-y-1">
                {outOfStockItems.map(p => <li key={p.id}>{p.name}</li>)}
              </ul>
            </div>
          )}
          
        </div>
        
        {/* Sales Trend and Quick Sale Form */}
        <div className="col-span-1 xl:col-span-2 space-y-6">
          <div className="rounded-4xl bg-white/90 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Sales Trend (Last 7 Days)</h2>
            </div>
            {salesByDay.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Once you start recording sales, a mini trend chart will appear here.</p>
            ) : (
              <div className="space-y-2">
                {salesByDay.map(([day, total]) => (
                  <div key={day} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-slate-500 dark:text-slate-400">{day}</div>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" style={{ width: `${(total / maxSalesForChart) * 100}%` }} />
                    </div>
                    <div className="w-16 text-xs font-semibold text-slate-700 dark:text-slate-300 text-right">{formatCurrency(total)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <QuickSaleForm products={products} handleRecordSale={handleRecordSale} />
        </div>
        
        {/* Activity Feed */}
        <div className="xl:col-span-1">
          <ActivityFeed />
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;