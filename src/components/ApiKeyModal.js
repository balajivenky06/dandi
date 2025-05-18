import React from 'react';

export default function ApiKeyModal({
  open,
  onClose,
  onSubmit,
  loading,
  newKeyName,
  setNewKeyName,
  newKeyType,
  setNewKeyType,
  isEdit = false,
  title = 'Create New API Key',
  submitLabel = 'Create',
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="api-key-modal-title">
      <div className="bg-white dark:bg-[#181C2A] rounded-lg p-6 w-full max-w-md mx-2 sm:mx-0">
        <div className="flex justify-between items-center mb-4">
          <h3 id="api-key-modal-title" className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
            aria-label="Close API key modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="api-key-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            API Key Name
          </label>
          <input
            type="text"
            id="api-key-name"
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            placeholder="e.g. Production API Key"
            className="w-full px-3 py-2 border border-gray-300 dark:border-[#232b3e] rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#232b3e] text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            API Key Type
          </label>
          <div className="flex">
            <button 
              onClick={() => setNewKeyType('dev')}
              className={`flex-1 py-2 px-4 font-medium rounded-l-md border ${newKeyType === 'dev' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-400' : 'bg-white dark:bg-[#232b3e] text-gray-500 dark:text-gray-300 border-gray-300 dark:border-[#232b3e]'}`}
              type="button"
            >
              Development
            </button>
            <button 
              onClick={() => setNewKeyType('prod')}
              className={`flex-1 py-2 px-4 font-medium rounded-r-md border border-l-0 ${newKeyType === 'prod' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-400' : 'bg-white dark:bg-[#232b3e] text-gray-500 dark:text-gray-300 border-gray-300 dark:border-[#232b3e]'}`}
              type="button"
            >
              Production
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-[#232b3e] rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#232b3e]/60"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!newKeyName.trim() || loading}
            className={`px-4 py-2 rounded-md text-white ${newKeyName.trim() && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'} flex items-center justify-center`}
            type="button"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>{isEdit ? 'Saving...' : 'Creating...'}</span>
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 