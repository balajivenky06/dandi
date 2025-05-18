import { useState, useEffect, useCallback } from 'react';
import { apiKeyService } from '../services/apiKeyService';

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
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000;
    const abortController = new AbortController();

    const fetchApiKeys = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        const data = await apiKeyService.getApiKeys();
        if (isMounted) {
          if (Array.isArray(data)) {
            setApiKeys(data);
            setError(null);
          } else {
            throw new Error('Invalid response format from API');
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchApiKeys, retryDelay * retryCount);
        } else if (isMounted) {
          setError(err.message || 'Failed to load API keys. Please try again later.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchApiKeys();
    return () => {
      isMounted = false;
      abortController.abort();
    };
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
    if (!name.trim()) return;
    if (apiKeys.length >= 1000) {
      alert("You have reached the maximum limit of 1000 API keys.");
      return;
    }
    try {
      setLoading(true);
      const newKey = await apiKeyService.createApiKey({ name, type });
      setApiKeys([newKey, ...apiKeys]);
      setError(null);
      showToastWithMessage("API Key created");
    } catch (err) {
      setError('Failed to create API key. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [apiKeys, showToastWithMessage]);

  const deleteApiKey = useCallback(async (id) => {
    try {
      setLoading(true);
      await apiKeyService.deleteApiKey(id);
      setApiKeys(apiKeys.filter((key) => key.id !== id));
      setError(null);
      showToastWithMessage("API Key deleted", "delete");
    } catch (err) {
      setError('Failed to delete API key. Please try again later.');
    } finally {
      setLoading(false);
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
      await apiKeyService.updateApiKey(id, { name: editKeyName });
      setApiKeys(
        apiKeys.map((key) => 
          key.id === id ? { ...key, name: editKeyName } : key
        )
      );
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
        await apiKeyService.updateApiKey(undoEdit.id, { name: undoEdit.oldName });
        setApiKeys(
          apiKeys.map((key) => 
            key.id === undoEdit.id ? { ...key, name: undoEdit.oldName } : key
          )
        );
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
  };
} 