import React from 'react';

export default function ApiKeyCard({
  apiKey,
  editingKey,
  editKeyName,
  setEditKeyName,
  onSaveEdit,
  onStartEdit,
  onCancelEdit,
  onToggleVisibility,
  onCopy,
  onDelete,
  visibleKeys,
  copySuccess,
  maskApiKey,
}) {
  return (
    <section className="bg-white dark:bg-[#181C2A] rounded-lg shadow p-4 border border-gray-200 dark:border-[#232b3e]" aria-label={`API Key ${apiKey.name}`}> 
      <div className="flex justify-between items-center mb-2">
        {editingKey === apiKey.id ? (
          <input
            type="text"
            value={editKeyName}
            onChange={(e) => setEditKeyName(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-[#232b3e] rounded text-sm w-full mr-2 bg-white dark:bg-[#232b3e] text-gray-900 dark:text-gray-100"
          />
        ) : (
          <span className="font-bold text-gray-900 dark:text-gray-100">{apiKey.name}</span>
        )}
        <span className="text-xs bg-gray-100 dark:bg-[#232b3e] text-gray-600 dark:text-gray-300 rounded px-2 py-1">{apiKey.type}</span>
      </div>
      <div className="mb-2 text-xs text-gray-500 dark:text-gray-300">Usage: {apiKey.usage}</div>
      <div className="mb-2 font-mono text-gray-500 dark:text-gray-300">{maskApiKey(apiKey.key, visibleKeys[apiKey.id])}</div>
      <div className="flex gap-2 justify-end">
        {editingKey === apiKey.id ? (
          <>
            <button 
              onClick={() => onSaveEdit(apiKey.id)} 
              className="p-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              title="Save"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={onCancelEdit} 
              className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              title="Cancel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onToggleVisibility(apiKey.id)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              title={visibleKeys[apiKey.id] ? "Hide API key" : "Show API key"}
            >
              {visibleKeys[apiKey.id] ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={() => onCopy(apiKey.key, apiKey.id)}
              className={`${copySuccess === apiKey.id ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300'}`}
              title="Copy API key"
            >
              {copySuccess === apiKey.id ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => onStartEdit(apiKey)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
              title="Edit API key"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(apiKey.id)}
              className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
              title="Delete API key"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  );
} 