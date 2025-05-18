"use client";

import { useState, useEffect } from "react";

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [schemaStatus, setSchemaStatus] = useState(null);
  const [createStatus, setCreateStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-supabase');
      const data = await response.json();
      setConnectionStatus(data);
    } catch (error) {
      setConnectionStatus({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testSchema = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-schema');
      const data = await response.json();
      setSchemaStatus(data);
    } catch (error) {
      setSchemaStatus({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCreate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-create');
      const data = await response.json();
      setCreateStatus(data);
    } catch (error) {
      setCreateStatus({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="mb-8">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Test Connection
        </button>
        
        <button 
          onClick={testSchema}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
        >
          Test Schema
        </button>
        
        <button 
          onClick={testCreate}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Test Create
        </button>
        
        {loading && <div className="mt-2">Loading...</div>}
      </div>
      
      {connectionStatus && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Connection Test Result:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(connectionStatus, null, 2)}
          </pre>
        </div>
      )}
      
      {schemaStatus && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Schema Test Result:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(schemaStatus, null, 2)}
          </pre>
        </div>
      )}
      
      {createStatus && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Create Test Result:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-60">
            {JSON.stringify(createStatus, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded">
        <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Check if your Supabase URL and ANON_KEY are correct in .env.local</li>
          <li>Make sure the api_keys table exists in your Supabase database</li>
          <li>If you're getting RLS errors, you need to either:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Disable RLS for testing (not recommended for production)</li>
              <li>Implement authentication and ensure user_id is set properly</li>
              <li>Create a policy that allows public access for testing</li>
            </ul>
          </li>
          <li>Check browser console for any JavaScript errors</li>
          <li>Check server logs for any backend errors</li>
        </ol>
      </div>
    </div>
  );
} 