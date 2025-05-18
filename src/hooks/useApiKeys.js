import { useState, useEffect, useCallback } from 'react';
import { apiKeyService } from '../services/apiKeyService';
import { supabase } from '@/lib/supabase';

export default function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [copySuccess, setCopySuccess] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [editKeyName, setEditKeyName] = useState("");
  const [pendingDeleteKey, setPendingDeleteKey] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [undoEdit, setUndoEdit] = useState(null);

  // Fetch API keys from Supabase
  const fetchApiKeys = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching API keys:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const showToastWithMessage = useCallback((message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage("");
      setToastType("success");
    }, 2000);
  }, []);

  const createApiKey = useCallback(async ({ name, type }) => {
    try {
      // Validate input parameters
      if (!name || typeof name !== 'string') {
        throw new Error('Name is required and must be a string');
      }

      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error('Name cannot be empty');
      }

      if (apiKeys.length >= 1000) {
        throw new Error('You have reached the maximum limit of 1000 API keys');
      }

      // Generate a secure API key
      const key = generateSecureApiKey();

      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            name: trimmedName,
            key,
            type,
            usage: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to create API key');
      }

      if (!data) {
        throw new Error('No data returned from API key creation');
      }

      setApiKeys(prev => [data, ...prev]);
      showToastWithMessage("API Key created successfully");
      return data;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred while creating the API key';
      setError(errorMessage);
      console.error('Error creating API key:', {
        message: errorMessage,
        error: err,
        details: err.details || err.hint || err.code
      });
      throw new Error(errorMessage);
    }
  }, [apiKeys, showToastWithMessage]);

  const deleteApiKey = useCallback(async (id) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApiKeys(prev => prev.filter(key => key.id !== id));
      showToastWithMessage("API Key deleted", "delete");
    } catch (err) {
      setError(err.message);
      console.error('Error deleting API key:', err);
      throw err;
    }
  }, [apiKeys, showToastWithMessage]);

  const startEditKey = useCallback((apiKey) => {
    setEditingKey(apiKey.id);
    setEditKeyName(apiKey.name);
  }, []);

  const saveEditKey = useCallback(async (id) => {
    try {
      setLoading(true);
      const keyToEdit = apiKeys.find((key) => key.id === id);
      const oldName = keyToEdit ? keyToEdit.name : '';
      const { data, error } = await supabase
        .from('api_keys')
        .update({
          name: editKeyName,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setApiKeys(prev => prev.map(key => key.id === id ? data : key));
      setEditingKey(null);
      setError(null);
      setShowToast(true);
      setToastMessage('API Key updated');
      setToastType('success');
      if (undoEdit && undoEdit.timeoutId) clearTimeout(undoEdit.timeoutId);
      const timeoutId = setTimeout(() => setUndoEdit(null), 5000);
      setUndoEdit({ id, oldName, timeoutId });
    } catch (err) {
      setError('Failed to update API key. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [apiKeys, editKeyName, undoEdit]);

  const handleUndoEdit = useCallback(async () => {
    if (undoEdit) {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .update({
            name: undoEdit.oldName,
            updated_at: new Date().toISOString()
          })
          .eq('id', undoEdit.id)
          .select()
          .single();

        if (error) throw error;

        setApiKeys(prev => prev.map(key => key.id === undoEdit.id ? data : key));
        setShowToast(true);
        setToastMessage('Edit undone');
        setToastType('success');
      } catch (err) {
        setError('Failed to undo edit. Please try again later.');
      } finally {
        setLoading(false);
        setUndoEdit(null);
      }
    }
  }, [apiKeys, undoEdit]);

  const toggleKeyVisibility = useCallback((id) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const copyToClipboard = useCallback(async (text, id) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          textArea.remove();
        } catch (err) {
          textArea.remove();
          throw err;
        }
      }
      setCopySuccess(id);
      showToastWithMessage("Copied API Key to clipboard");
    } catch (err) {
      setError('Failed to copy to clipboard. Please try selecting and copying manually.');
      setTimeout(() => setError(null), 3000);
    }
  }, [showToastWithMessage]);

  const maskApiKey = useCallback((key, isVisible) => {
    if (isVisible) return key;
    return key.slice(0, 10) + '••••••••••••••••';
  }, []);

  // Generate a secure API key
  const generateSecureApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const keyLength = 32;
    let key = '';
    
    // Use crypto.getRandomValues for better security
    const randomValues = new Uint8Array(keyLength);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < keyLength; i++) {
      key += chars[randomValues[i] % chars.length];
    }
    
    return key;
  };

  const validateApiKey = useCallback(async (apiKey) => {
    try {
      // Basic format validation
      if (!apiKey || typeof apiKey !== 'string') {
        throw new Error('API key is required and must be a string');
      }

      const trimmedKey = apiKey.trim();
      if (!trimmedKey) {
        throw new Error('API key cannot be empty');
      }

      // Validate API key format
      // API key should be 32 characters long and contain only alphanumeric characters, hyphens, and underscores
      const apiKeyRegex = /^[A-Za-z0-9-_]{32}$/;
      if (!apiKeyRegex.test(trimmedKey)) {
        throw new Error('API key must be 32 characters long and contain only letters, numbers, hyphens, and underscores');
      }

      // Log the API key being validated (first 10 chars only for security)
      console.log('Validating API key format:', {
        length: trimmedKey.length,
        matchesFormat: apiKeyRegex.test(trimmedKey),
        firstChars: trimmedKey.substring(0, 10) + '...'
      });

      // Log Supabase client state
      console.log('Supabase client state:', {
        url: supabase.supabaseUrl,
        hasClient: !!supabase,
        isConnected: !!supabase?.from
      });

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', trimmedKey)
        .single();

      // Log the raw response for debugging
      console.log('Supabase raw response:', { 
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : null,
        hasError: !!error,
        errorType: error ? typeof error : null
      });

      if (error) {
        // Log the full error object with all possible properties
        console.error('Supabase validation error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
          errorObject: error
        });
        
        // Handle specific Supabase error cases
        if (error.code === 'PGRST116') {
          throw new Error('Invalid API key format');
        } else if (error.code === '42P01') {
          throw new Error('API keys table not found');
        } else if (error.code === 'PGRST301') {
          throw new Error('No API key found with the provided value');
        } else {
          throw new Error(error.message || 'Failed to validate API key');
        }
      }

      if (!data) {
        throw new Error('Invalid API key');
      }

      return {
        isValid: true,
        keyData: data
      };
    } catch (err) {
      // Log the full error object with all possible properties
      console.error('API key validation error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        error: JSON.stringify(err, Object.getOwnPropertyNames(err)),
        errorObject: err
      });

      return {
        isValid: false,
        error: err.message || 'An unexpected error occurred while validating the API key'
      };
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  return {
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
    validateApiKey,
    refreshApiKeys: fetchApiKeys
  };
} 