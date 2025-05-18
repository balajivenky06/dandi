'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import useApiKeys from '../../hooks/useApiKeys';
import Sidebar from '../../components/Sidebar';

export default function Protected() {
  const router = useRouter();
  const { validateApiKey } = useApiKeys();
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [keyData, setKeyData] = useState(null);

  useEffect(() => {
    const validateStoredKey = async () => {
      try {
        // Check if the key was validated through playground
        const keyValidated = Cookies.get('keyValidated');
        if (!keyValidated) {
          console.log('Direct access detected - redirecting to playground');
          router.push('/playground');
          return;
        }

        const storedKey = Cookies.get('apiKey');
        if (!storedKey) {
          console.log('No API key found - redirecting to playground');
          router.push('/playground');
          return;
        }

        const result = await validateApiKey(storedKey);
        if (result.isValid) {
          setShowSuccess(true);
          setKeyData(result.keyData);
        } else {
          // If API key is invalid, clear cookies and redirect
          console.log('Invalid API key - clearing cookies and redirecting');
          Cookies.remove('apiKey');
          Cookies.remove('keyValidated');
          router.push('/playground');
        }
      } catch (err) {
        console.error('Error validating API key:', err);
        setError(err.message || 'Failed to validate API key');
        // Clear all cookies and redirect
        Cookies.remove('apiKey');
        Cookies.remove('keyValidated');
        router.push('/playground');
      } finally {
        setIsValidating(false);
      }
    };

    validateStoredKey();
  }, [router, validateApiKey]);

  // If we're still validating, show loading state
  if (isValidating) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Validating API key...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there's an error, redirect to playground
  if (error) {
    router.push('/playground');
    return null;
  }

  // Only show protected content if we have valid key data
  if (showSuccess && keyData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Protected Content</h1>
                  <div className="flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">API Key Valid</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">API Key Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Key Name</p>
                        <p className="text-gray-900">{keyData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="text-gray-900 capitalize">{keyData.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created At</p>
                        <p className="text-gray-900">{new Date(keyData.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="text-gray-900">{keyData.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Protected Content</h2>
                    <p className="text-gray-600">
                      This is the protected content that can only be accessed with a valid API key.
                      You can now use this page to access protected resources and features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we don't have valid key data, redirect to playground
  router.push('/playground');
  return null;
} 