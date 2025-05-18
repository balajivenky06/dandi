'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import useApiKeys from '../../hooks/useApiKeys';
import Sidebar from '../../components/Sidebar';

export default function Playground() {
  const router = useRouter();
  const { validateApiKey } = useApiKeys();
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const validateApiKeyFormat = (key) => {
    // Check if key is exactly 32 characters
    if (key.length !== 32) {
      return 'API key must be exactly 32 characters long';
    }

    // Check if key contains only allowed characters
    const validFormat = /^[a-zA-Z0-9-_]+$/.test(key);
    if (!validFormat) {
      return 'API key can only contain letters, numbers, hyphens, and underscores';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setShowSuccess(false);

    try {
      // First validate the format
      const formatError = validateApiKeyFormat(apiKey);
      if (formatError) {
        setError(formatError);
        return;
      }

      console.log('Validating API key...', { keyLength: apiKey.length, keyPrefix: apiKey.substring(0, 4) + '...' });
      const result = await validateApiKey(apiKey);
      console.log('Validation result:', { success: result.isValid, error: result.error });

      if (result.isValid) {
        // Store the API key and validation flag in cookies
        Cookies.set('apiKey', apiKey, { expires: 7 }); // Expires in 7 days
        Cookies.set('keyValidated', 'true', { expires: 7 }); // Flag to indicate validation through playground
        setShowSuccess(true);
        
        // Wait for 1.5 seconds to show the success message
        setTimeout(() => {
          router.push('/protected');
        }, 1500);
      } else {
        setError(result.error || 'Invalid API key');
      }
    } catch (err) {
      console.error('Error during API key validation:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setError(err.message || 'An error occurred while validating the API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setApiKey(value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">API Key Validation</h1>
            
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

            {showSuccess && (
              <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      API key validated successfully! Redirecting...
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your API Key
                </label>
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    error ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your 32-character API key"
                  required
                  maxLength={32}
                />
                <p className="mt-1 text-sm text-gray-500">
                  API key must be 32 characters long and contain only letters, numbers, hyphens, and underscores
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !apiKey.trim()}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting || !apiKey.trim()
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Validating...
                  </>
                ) : (
                  'Validate API Key'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 