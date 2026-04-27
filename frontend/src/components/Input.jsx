import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-0.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
          error 
            ? 'border-red-500 ring-2 ring-red-500/10' 
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
