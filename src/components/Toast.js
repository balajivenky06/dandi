import React from 'react';

export default function Toast({
  open,
  message,
  type = 'success',
  onClose,
  onUndo,
  showUndo = false,
}) {
  if (!open) return null;
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-500 ease-in-out opacity-100" style={{ transition: 'opacity 0.5s' }}>
      <div className={`flex items-center px-6 py-3 rounded-xl shadow-lg font-semibold text-lg gap-3 min-w-[320px] ${type === 'delete' ? 'bg-red-700' : 'bg-green-700'} text-white`}>
        {type === 'delete' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" fill="#991B1B" />
            <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" fill="#166534" />
            <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
        )}
        <span>{message}</span>
        {showUndo && (
          <button onClick={onUndo} className="ml-4 px-3 py-1 rounded bg-white text-green-700 font-semibold hover:bg-gray-100 transition border border-green-200 text-base focus:outline-none">Undo</button>
        )}
        <button onClick={onClose} className="ml-auto text-white hover:text-gray-200 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 