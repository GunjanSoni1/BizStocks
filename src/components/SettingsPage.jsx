import React, { useState } from 'react';
import { authAPI } from '../utils/api';

// Icons used in the design (using Lucide-React equivalent for a clean look)
const UserIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const LockIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const BuildingIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v4" /></svg>;
const SunIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>;
const MoonIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>;
const LogOutIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>;

const SettingsPage = ({
  theme,
  toggleTheme,
  appUser,
  userId,
  businessName,
  onBusinessNameChange,
  showMessage,
  closeModal,
  auth,
  setAppUser,
  setCurrentPage,
  onChangePassword,
  isMockMode,
  onLogout,
  onSaveProfile
}) => {
  // State for Change Password Modal
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // State for other edits
  const [isEditingBusinessName, setIsEditingBusinessName] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(appUser?.displayName || '');
  const [profileEmail, setProfileEmail] = useState(appUser?.email || 'N/A');

  // Handlers (kept mostly the same but integrated with new profile state)
  const handleProfileNameChange = (e) => setProfileName(e.target.value);
  const handleProfileEmailChange = (e) => setProfileEmail(e.target.value);

  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      showMessage('Profile name cannot be empty.', 'error');
      return;
    }

    if (onSaveProfile) {
      await onSaveProfile(profileName);
      setIsEditingProfile(false);
    } else {
      // Fallback for mock mode or no handler
      if (isMockMode) {
        setAppUser({ ...appUser, displayName: profileName });
        showMessage(`Profile for ${profileName} saved.`, 'success');
        setIsEditingProfile(false);
        return;
      }

      showMessage(`Profile updated successfully!`, 'success');
      setAppUser({ ...appUser, displayName: profileName });
      setIsEditingProfile(false);
    }
  };


  const [tempBusinessName, setTempBusinessName] = useState(businessName || '');

  const handleBusinessNameChange = (e) => {
    setTempBusinessName(e.target.value);
  };

  const handleSaveBusinessName = async () => {
    if (!businessName.trim()) {
      showMessage('Business name cannot be empty.', 'error');
      return;
    }

    if (onBusinessNameChange) {
      await onBusinessNameChange(businessName);
      showMessage('Business name saved successfully!', 'success');
      setIsEditingBusinessName(false);
    } else {
      showMessage('Business name saved successfully!', 'success');
      setIsEditingBusinessName(false);
    }
  };

  const handleEditBusinessName = () => {
    setIsEditingBusinessName(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showMessage('Please fill in all password fields.', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showMessage('New password must be at least 8 characters long.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage('New password and confirm password do not match.', 'error');
      return;
    }

    if (isMockMode) {
      showMessage('Password change is not available in offline mode.', 'info');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      return;
    }

    if (onChangePassword) {
      try {
        await onChangePassword(currentPassword, newPassword);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsChangingPassword(false);
      } catch (error) {
        // Error handling is done in the parent component
      }
    } else {
      showMessage('Password change functionality not available.', 'error');
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      // Use the logout handler from App.jsx
      showMessage(
        'Are you sure you want to logout?',
        'confirm',
        onLogout,
        closeModal
      );
    } else {
      // Fallback if onLogout not provided
      showMessage(
        'Are you sure you want to logout?',
        'confirm',
        async () => {
          try {
            if (!isMockMode) {
              await authAPI.logout().catch(() => {
                // Ignore errors if API is not available
              });
            }
          } catch (e) {
            console.warn('Error during logout', e);
          } finally {
            setAppUser(null);
            localStorage.removeItem('bizstock-user-session');
            localStorage.removeItem('authToken');
            setCurrentPage('Overview');
            closeModal();
            showMessage('You have been logged out.', 'info');
          }
        },
        closeModal
      );
    }
  };

  // Utility component for a clean settings row
  const SettingsRow = ({ title, description, actionButton, icon, children }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 gap-4">
      <div className="flex items-start gap-4">
        {icon && React.cloneElement(icon, { className: 'h-6 w-6 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0' })}
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="flex-shrink-0 min-w-[120px]">
        {children || actionButton}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-900' : 'bg-slate-50'} transition-colors duration-300 p-4 sm:p-8`}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER: Title and Theme Toggle */}
        <header className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">⚙️</span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">Settings</h1>
          </div>

          {/* Theme Toggle (Moved to Top Right) */}
          <div className="flex items-center gap-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner">
            <SunIcon className={`h-5 w-5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-500'}`} />
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out ${theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900`}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Toggle theme"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
            <MoonIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-300' : 'text-slate-500'}`} />
          </div>
        </header>

        {/* ACCOUNT AND BUSINESS SECTIONS */}
        <div className="space-y-6">

          {/* Account Management Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-indigo-500" /> Account Management
            </h2>

            {/* User Profile Row */}
            <SettingsRow
              title="User Profile"
              description={`Logged in as: ${appUser?.displayName || 'Anonymous User'} (${appUser?.email || 'N/A'})`}
              icon={<UserIcon />}
            >
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-1.5 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition text-sm font-semibold shadow-md"
              >
                Edit Profile
              </button>
            </SettingsRow>

            {/* Change Password Row */}
            <SettingsRow
              title="Change Password"
              description="Update your password to keep your account secure."
              icon={<LockIcon />}
            >
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm font-medium"
              >
                Change Password
              </button>
            </SettingsRow>

            {/* Business Name Row */}
            <SettingsRow
              title="Business Name"
              description={`Name used on reports and invoices: ${businessName || 'Not Set'}`}
              icon={<BuildingIcon />}
            >
              {!isEditingBusinessName ? (
                <button
                  onClick={() => {
                    setTempBusinessName(businessName || '');
                    setIsEditingBusinessName(true);
                  }}
                  className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm font-medium"
                >
                  Edit Name
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
                  <input
                    type="text"
                    value={tempBusinessName}
                    onChange={handleBusinessNameChange}
                    className="flex-grow rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-slate-900 dark:text-slate-50 text-sm focus:border-indigo-400 transition"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (onBusinessNameChange) {
                        onBusinessNameChange(tempBusinessName);
                      }
                      handleSaveBusinessName();
                    }}
                    className="px-4 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setTempBusinessName(businessName || '');
                      setIsEditingBusinessName(false);
                    }}
                    className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </SettingsRow>
          </div>

          {/* Session Control Card (Logout) */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <SettingsRow
              title="Session Control"
              description="Securely sign out of your current account session."
              icon={<LogOutIcon />}
            >
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                <LogOutIcon className="h-4 w-4" /> Logout
              </button>
            </SettingsRow>
          </div>
        </div>

        {/* Change Password Modal/Form */}
        {isChangingPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700 transition-all transform scale-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Change Password</h3>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2 text-slate-900 dark:text-slate-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm"
                    required
                  />
                </div>
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2 text-slate-900 dark:text-slate-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm"
                    required
                    minLength={8}
                  />
                </div>
                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2 text-slate-900 dark:text-slate-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm"
                    required
                    minLength={8}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="flex-1 rounded-full border border-slate-300 dark:border-slate-600 py-2 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 font-bold transition shadow-lg shadow-indigo-500/30"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Profile Modal/Form */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Edit Profile</h3>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4">
                <div>
                  <label htmlFor="profileName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    id="profileName"
                    value={profileName}
                    onChange={handleProfileNameChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2 text-slate-900 dark:text-slate-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="profileEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email (Read Only)</label>
                  <input
                    type="email"
                    id="profileEmail"
                    value={profileEmail}
                    readOnly
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-200 dark:bg-slate-700 px-4 py-2 text-slate-500 dark:text-slate-400 cursor-not-allowed text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 rounded-full border border-slate-300 dark:border-slate-600 py-2 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 font-bold transition shadow-lg shadow-indigo-500/30"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;