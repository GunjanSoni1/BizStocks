import React from 'react';

const MessageModal = ({ message, type = 'info', onConfirm, onCancel, onClose }) => {
  if (!message) return null;

  const isConfirmation = typeof onConfirm === 'function';

  // Use onClose if provided, otherwise fall back to onConfirm or onCancel
  const handleClose = onClose || onConfirm || onCancel;

  const baseClasses = "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300";
  const overlayClasses = "absolute inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm";

  let title, colorClass, icon;
  let buttonColor = 'bg-indigo-600 hover:bg-indigo-700';

  switch (type) {
    case 'success':
      title = 'Success!';
      colorClass = 'text-green-600 dark:text-green-400';
      buttonColor = 'bg-emerald-600 hover:bg-emerald-700';
      icon = '✅';
      break;
    case 'error':
      title = 'Error!';
      colorClass = 'text-red-600 dark:text-red-400';
      buttonColor = 'bg-red-600 hover:bg-red-700';
      icon = '❌';
      break;
    case 'confirm':
      title = 'Confirm Action';
      colorClass = 'text-yellow-600 dark:text-yellow-400';
      buttonColor = 'bg-red-600 hover:bg-red-700';
      icon = '❓';
      break;
    case 'info':
    default:
      title = 'Notification';
      colorClass = 'text-indigo-600 dark:text-indigo-400';
      buttonColor = 'bg-indigo-600 hover:bg-indigo-700';
  }

  // Handle custom JSX message passed for confirmation (like Logout)
  if (type === 'custom' && typeof message === 'object') {
    return (
      <div className={baseClasses}>
        <div className={overlayClasses} onClick={handleClose} />
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md z-10 transform scale-100 transition-transform duration-300">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      <div className={overlayClasses} onClick={isConfirmation ? onCancel : handleClose} />
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-sm z-10 transform scale-100 transition-transform duration-300 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">
          <span className={`text-2xl ${colorClass}`}>{icon}</span>
          <h3 className={`text-lg font-bold text-slate-900 dark:text-slate-50`}>{title}</h3>
        </div>
        <p className="text-gray-700 dark:text-slate-300 mb-6">{message}</p>

        <div className={`flex ${isConfirmation ? 'justify-between space-x-3' : 'justify-end'}`}>
          {isConfirmation && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-150 flex-1 font-semibold"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              if (isConfirmation && onConfirm) {
                onConfirm();
              } else if (onClose) {
                onClose();
              }
            }}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition duration-150 flex-1 ${buttonColor}`}
          >
            {isConfirmation ? 'Yes, proceed' : 'Close'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default MessageModal;

