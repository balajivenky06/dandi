"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiKeyService } from "../../services/apiKeyService";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState("dev");
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editKeyName, setEditKeyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [copySuccess, setCopySuccess] = useState(null);
  const [error, setError] = useState(null);

  // Fetch API keys from Supabase
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoading(true);
        const data = await apiKeyService.getApiKeys();
        setApiKeys(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch API keys:', err);
        setError('Failed to load API keys. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const createApiKey = async () => {
    if (!newKeyName.trim()) return;
    
    // Check if we've reached the maximum number of keys
    if (apiKeys.length >= 1000) {
      alert("You have reached the maximum limit of 1000 API keys.");
      return;
    }
    
    try {
      setLoading(true);
      const newKey = await apiKeyService.createApiKey({
        name: newKeyName,
        type: newKeyType
      });
      
      setApiKeys([newKey, ...apiKeys]);
      setNewKeyName("");
      setNewKeyType("dev");
      setShowNewKeyModal(false);
      setError(null);
    } catch (err) {
      console.error('Failed to create API key:', err);
      setError('Failed to create API key. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id) => {
    try {
      setLoading(true);
      await apiKeyService.deleteApiKey(id);
      setApiKeys(apiKeys.filter((key) => key.id !== id));
      setError(null);
    } catch (err) {
      console.error('Failed to delete API key:', err);
      setError('Failed to delete API key. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const startEditKey = (apiKey) => {
    setEditingKey(apiKey.id);
    setEditKeyName(apiKey.name);
  };

  const saveEditKey = async (id) => {
    try {
      setLoading(true);
      const updatedKey = await apiKeyService.updateApiKey(id, { name: editKeyName });
      
      setApiKeys(
        apiKeys.map((key) => 
          key.id === id ? { ...key, name: editKeyName } : key
        )
      );
      setEditingKey(null);
      setError(null);
    } catch (err) {
      console.error('Failed to update API key:', err);
      setError('Failed to update API key. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const maskApiKey = (key, isVisible) => {
    if (isVisible) return key;
    return key.slice(0, 10) + '••••••••••••••••';
  };

  // Calculate the usage percentage
  const usagePercentage = apiKeys.length > 0 ? (apiKeys.length / 1000) * 100 : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Pages
              </Link>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <span className="font-medium text-gray-900 dark:text-white">Overview</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Operational</span>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                    <path d="M10 4a1 1 0 100 2 1 1 0 000-2zm0 7a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                    <path d="M10 4a1 1 0 100 2 1 1 0 000-2zm0 7a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Overview</h1>
        
        {/* Current Plan Card - Enhanced with more vibrant colors */}
        <div className="relative overflow-hidden mb-10 rounded-xl shadow-lg">
          {/* Background with animated gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 dark:from-purple-900 dark:via-pink-800 dark:to-blue-800 animate-gradient-x"></div>
          
          {/* Background image */}
          <div className="absolute inset-0 opacity-15 dark:opacity-10">
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
          <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10 dark:bg-black/20"></div>
          
          {/* Content */}
          <div className="relative px-6 py-8 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="text-sm font-medium text-white/90 dark:text-white/80 mb-2 sm:mb-0 bg-white/20 dark:bg-black/30 rounded-md px-3 py-1 backdrop-blur-sm">CURRENT PLAN</span>
              <button className="bg-white/25 hover:bg-white/40 dark:bg-white/20 dark:hover:bg-white/30 backdrop-blur-md py-2 px-4 rounded-md flex items-center text-sm font-medium text-white transition-colors w-max">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Manage Plan
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-6 mb-10 md:mb-0 drop-shadow-md">Researcher</h2>
              
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
            
            <div className="mb-8 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl p-6"
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
              
              <div className="w-full bg-white/20 dark:bg-black/30 rounded-full h-3">
                <div 
                  className="bg-blue-400 dark:bg-blue-500 h-3 rounded-full transition-all duration-1000" 
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
        
        {/* API Keys Section */}
        <div className="mb-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h2>
            <button 
              onClick={() => apiKeys.length < 1000 ? setShowNewKeyModal(true) : alert("You have reached the maximum limit of 1000 API keys.")}
              className={`flex items-center justify-center h-8 w-8 rounded-md border ${apiKeys.length >= 1000 ? 'border-gray-400 bg-gray-200 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              disabled={apiKeys.length >= 1000}
              title={apiKeys.length >= 1000 ? "Maximum API keys limit reached" : "Create new API key"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The key is used to authenticate your requests to the Research API. 
            You can create up to 1,000 API keys.
            To learn more, see the <a href="#" className="text-blue-600 dark:text-blue-400 underline">documentation</a> page.
          </p>
          
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Key
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Options
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                        <span>Loading API keys...</span>
                      </div>
                    </td>
                  </tr>
                ) : apiKeys.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No API keys found. Create one using the + button above.
                    </td>
                  </tr>
                ) : (
                  apiKeys.map((apiKey) => (
                    <tr key={apiKey.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {editingKey === apiKey.id ? (
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={editKeyName}
                              onChange={(e) => setEditKeyName(e.target.value)}
                              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm w-full dark:bg-gray-700 dark:text-white"
                            />
                            <button 
                              onClick={() => saveEditKey(apiKey.id)} 
                              className="p-1 text-green-600 hover:text-green-700 dark:hover:text-green-500"
                              title="Save"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => setEditingKey(null)} 
                              className="p-1 text-red-600 hover:text-red-700 dark:hover:text-red-500"
                              title="Cancel"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          apiKey.name
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {apiKey.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {apiKey.usage}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400 relative">
                        <div className="flex items-center gap-2">
                          {maskApiKey(apiKey.key, visibleKeys[apiKey.id])}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                            onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                            className={`${copySuccess === apiKey.id ? 'text-green-500' : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'}`}
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
                          {editingKey !== apiKey.id && (
                            <button
                              onClick={() => startEditKey(apiKey)}
                              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                              title="Edit API key"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => deleteApiKey(apiKey.id)}
                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                            title="Delete API key"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create New API Key</h3>
              <button 
                onClick={() => {
                  setShowNewKeyModal(false);
                  setNewKeyType("dev");
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="api-key-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Key Name
              </label>
              <input
                type="text"
                id="api-key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Production API Key"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Key Type
              </label>
              <div className="flex">
                <button 
                  onClick={() => setNewKeyType("dev")}
                  className={`flex-1 py-2 px-4 font-medium rounded-l-md border ${
                    newKeyType === "dev" 
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" 
                      : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  Development
                </button>
                <button 
                  onClick={() => setNewKeyType("prod")}
                  className={`flex-1 py-2 px-4 font-medium rounded-r-md border border-l-0 ${
                    newKeyType === "prod" 
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" 
                      : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  Production
                </button>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNewKeyModal(false);
                  setNewKeyType("dev");
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={createApiKey}
                disabled={!newKeyName.trim() || loading}
                className={`px-4 py-2 rounded-md text-white ${
                  newKeyName.trim() && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
                } flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 