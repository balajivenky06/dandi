"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiKeyService } from "../../services/apiKeyService";
import ApiKeyModal from '../../components/ApiKeyModal';
import Toast from '../../components/Toast';
import ApiKeyRow from '../../components/ApiKeyRow';
import ApiKeyCard from '../../components/ApiKeyCard';
import useApiKeys from '../../hooks/useApiKeys';

export default function Dashboard() {
  const {
    apiKeys,
    setApiKeys,
    loading,
    error,
    visibleKeys,
    setVisibleKeys,
    copySuccess,
    setCopySuccess,
    editingKey,
    setEditingKey,
    editKeyName,
    setEditKeyName,
    pendingDeleteKey,
    setPendingDeleteKey,
    showToast,
    setShowToast,
    toastMessage,
    setToastMessage,
    toastType,
    setToastType,
    undoEdit,
    setUndoEdit,
    createApiKey,
    deleteApiKey,
    startEditKey,
    saveEditKey,
    handleUndoEdit,
    toggleKeyVisibility,
    copyToClipboard,
    maskApiKey,
    showToastWithMessage,
  } = useApiKeys();
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState("dev");
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const keysPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Filtered API keys
  const filteredKeys = apiKeys.filter(key => {
    const matchesName = key.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || key.type === filterType;
    return matchesName && matchesType;
  });
  const totalPages = Math.ceil(filteredKeys.length / keysPerPage);
  const paginatedKeys = filteredKeys.slice((currentPage - 1) * keysPerPage, currentPage * keysPerPage);

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterType]);

  // Calculate the usage percentage
  const usagePercentage = apiKeys.length > 0 ? (apiKeys.length / 1000) * 100 : 0;

  const confirmDeleteApiKey = (id) => {
    setPendingDeleteKey(id);
  };

  const handleDeleteConfirmed = async () => {
    if (pendingDeleteKey) {
      await deleteApiKey(pendingDeleteKey);
      setPendingDeleteKey(null);
    }
  };

  const handleDeleteCancelled = () => {
    setPendingDeleteKey(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#101624]">
      {/* Overview Header */}
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-0">Overview</h1>
        <div className="flex items-center gap-4">
          {/* Operational status */}
          <div className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm">Operational</span>
          </div>
        </div>
      </div>
      
      {/* Current Plan Card - Enhanced with more vibrant colors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative overflow-hidden mb-10 rounded-xl shadow-lg">
          {/* Background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 animate-gradient-x dark:from-purple-900 dark:via-pink-800 dark:to-blue-900"></div>
          
          {/* Background image */}
          <div className="absolute inset-0 opacity-15">
            <Image 
              src="/api-pattern.svg" 
              alt="API Pattern" 
              fill
              sizes="100vw"
              className="mix-blend-overlay object-cover"
              priority
            />
          </div>
          
          {/* Glass effect overlay */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10 dark:bg-[#232b3e]/30"></div>
          
          {/* Content */}
          <div className="relative px-4 py-4 sm:p-6 md:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="text-sm font-medium text-white/90 mb-2 sm:mb-0 bg-white/20 dark:bg-white/10 rounded-md px-3 py-1 backdrop-blur-sm">CURRENT PLAN</span>
              <button className="bg-white/25 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/20 py-2 px-4 rounded-md flex items-center text-sm font-medium text-white transition-colors w-max">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Manage Plan
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 mb-4 md:mb-0 drop-shadow-md">Researcher</h2>
              
              <div className="hidden md:block relative w-40 h-40 lg:w-48 lg:h-48">
                <Image 
                  src="/api-key-icon.svg" 
                  alt="API Key Illustration" 
                  width={192}
                  height={192}
                  className="drop-shadow-lg"
                  priority
                />
              </div>
            </div>
            
            <div className="mb-4 bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-xl p-4"
            >
              <div className="flex items-center mb-4">
                <h3 className="text-lg font-medium text-white">API Keys Usage</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-white/70" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 text-white">
                <span className="mb-1 sm:mb-0">Maximum API Keys</span>
                <span className="font-semibold">{apiKeys.length} / 1,000 Keys Created</span>
              </div>
              
              <div className="w-full bg-white/20 dark:bg-white/10 rounded-full h-3">
                <div 
                  className="bg-blue-400 dark:bg-blue-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${usagePercentage}%` }}
                ></div>
              </div>
              
              {apiKeys.length >= 950 && (
                <div className="mt-3 text-yellow-200 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>You are approaching your API key limit</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search API keys by name..."
            className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search API keys by name"
          />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            aria-label="Filter by key type"
          >
            <option value="all">All Types</option>
            <option value="dev">Development</option>
            <option value="prod">Production</option>
          </select>
        </div>
        
        {/* API Keys Section */}
        <div className="mb-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">API Keys</h2>
            <button 
              onClick={() => apiKeys.length < 1000 ? setShowNewKeyModal(true) : alert("You have reached the maximum limit of 1000 API keys.")}
              className={`flex items-center justify-center h-8 w-8 rounded-md border ${apiKeys.length >= 1000 ? 'border-gray-400 bg-gray-200 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'}`}
              disabled={apiKeys.length >= 1000}
              title={apiKeys.length >= 1000 ? "Maximum API keys limit reached" : "Create new API key"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            The key is used to authenticate your requests to the Research API. 
            You can create up to 1,000 API keys.
            To learn more, see the <a href="#" className="text-blue-600 underline">documentation</a> page.
          </p>
          
          {/* Responsive API Keys Section */}
          <div className="mb-10">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <table className="min-w-full divide-y divide-gray-200" role="table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={idx}>
                        <td colSpan="5" className="px-6 py-4">
                          <div className="animate-pulse flex space-x-4">
                            <div className="rounded bg-gray-200 h-6 w-1/4"></div>
                            <div className="rounded bg-gray-200 h-6 w-1/6"></div>
                            <div className="rounded bg-gray-200 h-6 w-1/6"></div>
                            <div className="rounded bg-gray-200 h-6 w-1/4"></div>
                            <div className="rounded bg-gray-200 h-6 w-1/6"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredKeys.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <img src="/empty-state-keys.svg" alt="No API Keys" className="w-32 h-32 mb-2" />
                          <div className="text-lg font-semibold text-gray-700">No API keys found</div>
                          <div className="text-gray-500 mb-2">You haven&apos;t created any API keys yet. Get started by creating your first key.</div>
                          <button
                            onClick={() => setShowNewKeyModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create API Key
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedKeys.map((apiKey) => (
                      <ApiKeyRow
                        key={apiKey.id}
                        apiKey={apiKey}
                        editingKey={editingKey}
                        editKeyName={editKeyName}
                        setEditKeyName={setEditKeyName}
                        onSaveEdit={saveEditKey}
                        onStartEdit={startEditKey}
                        onCancelEdit={() => setEditingKey(null)}
                        onToggleVisibility={toggleKeyVisibility}
                        onCopy={copyToClipboard}
                        onDelete={confirmDeleteApiKey}
                        visibleKeys={visibleKeys}
                        copySuccess={copySuccess}
                        maskApiKey={maskApiKey}
                      />
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      aria-label={`Page ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>
            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <section key={idx} className="bg-white rounded-lg shadow p-4 border border-gray-200 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="flex gap-2 justify-end mt-2">
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                    </div>
                  </section>
                ))
              ) : filteredKeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <img src="/empty-state-keys.svg" alt="No API Keys" className="w-32 h-32 mb-2" />
                  <div className="text-lg font-semibold text-gray-700">No API keys found</div>
                  <div className="text-gray-500 mb-2">You haven&apos;t created any API keys yet. Get started by creating your first key.</div>
                  <button
                    onClick={() => setShowNewKeyModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create API Key
                  </button>
                </div>
              ) : (
                paginatedKeys.map((apiKey) => (
                  <ApiKeyCard
                    key={apiKey.id}
                    apiKey={apiKey}
                    editingKey={editingKey}
                    editKeyName={editKeyName}
                    setEditKeyName={setEditKeyName}
                    onSaveEdit={saveEditKey}
                    onStartEdit={startEditKey}
                    onCancelEdit={() => setEditingKey(null)}
                    onToggleVisibility={toggleKeyVisibility}
                    onCopy={copyToClipboard}
                    onDelete={confirmDeleteApiKey}
                    visibleKeys={visibleKeys}
                    copySuccess={copySuccess}
                    maskApiKey={maskApiKey}
                  />
                ))
              )}
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      aria-label={`Page ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      <ApiKeyModal
        open={showNewKeyModal}
        onClose={() => { setShowNewKeyModal(false); setNewKeyType('dev'); setNewKeyName(''); }}
        onSubmit={async () => {
          try {
            await createApiKey({ name: newKeyName, type: newKeyType });
            setShowNewKeyModal(false);
            setNewKeyType('dev');
            setNewKeyName('');
          } catch (error) {
            // Error is already handled in createApiKey
            console.error('Error in onSubmit:', error);
          }
        }}
        loading={loading}
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        newKeyType={newKeyType}
        setNewKeyType={setNewKeyType}
      />

      {/* Delete Confirmation Popup */}
      {pendingDeleteKey && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="flex items-center bg-red-700 text-white px-6 py-5 rounded-xl shadow-lg font-semibold text-lg gap-4 min-w-[340px] max-w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" fill="#991B1B" />
              <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
            </svg>
            <div className="flex-1">
              <div className="font-bold text-white mb-1">Delete API Key?</div>
              <div className="text-white text-base font-normal">Are you sure you want to delete this API key? This action cannot be undone.</div>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={handleDeleteCancelled}
                className="px-3 py-1 rounded-md bg-white text-gray-800 font-semibold hover:bg-gray-100 border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-3 py-1 rounded-md bg-red-600 text-white font-semibold hover:bg-red-800 border border-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        open={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
        onUndo={handleUndoEdit}
        showUndo={!!undoEdit}
      />
    </div>
  );
} 