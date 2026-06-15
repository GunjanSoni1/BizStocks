import React from 'react';
import BrandLogo from './BrandLogo';
import { NAV_LINKS } from '../config/constants';
import { authAPI } from '../utils/api';

const Sidebar = ({ currentPage, setCurrentPage, setEditingProduct, appUser, auth, showMessage, setAppUser, onLogout }) => {
  const handleLogout = async () => {
    if (onLogout) {
      // Use the logout handler from App.jsx
      onLogout();
    } else {
      // Fallback if onLogout not provided
      try {
        await authAPI.logout().catch(() => {
          // Ignore errors if API is not available (mock mode)
        });
      } catch (e) {
        console.warn('Error during logout', e);
      } finally {
        setAppUser(null);
        localStorage.removeItem('bizstock-user-session');
        localStorage.removeItem('authToken');
        setCurrentPage('Overview');
        showMessage('You have been logged out.', 'info');
      }
    }
  };

  return (
    <aside className="w-64 bg-slate-950/70 backdrop-blur-lg text-slate-50 flex flex-col p-6 border-r border-white/5 shadow-2xl relative z-10">
      <BrandLogo setCurrentPage={setCurrentPage} />
      <div className="mt-8 space-y-2">
        {NAV_LINKS.map(({ label, icon }) => {
          const isActive = currentPage === label;
          return (
            <button
              key={label}
              onClick={() => {
                setCurrentPage(label);
                setEditingProduct(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/40'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto space-y-4 pt-6 border-t border-white/5 text-sm text-white/70">
        <div>
          <p className="uppercase text-xs tracking-[0.3em] text-white/50 mb-2">Current User</p>
          {appUser ? (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs break-all text-white">
              {appUser.email}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs break-all text-white/60">
              Not logged in
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full rounded-2xl border border-white/20 py-3 text-white/80 hover:bg-white/10 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
