import supabase from './supabase';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'api_keys';

/**
 * Get all API keys for the current user
 */
export async function getApiKeys() {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return { data: null, error };
  }
}

/**
 * Create a new API key
 */
export async function createApiKey({ name, type = 'dev' }) {
  try {
    // Generate a unique key with a prefix based on type
    const keyPrefix = type === 'prod' ? 'dandi-prod-' : 'dandi-dev-';
    const keyValue = keyPrefix + uuidv4().replace(/-/g, '');
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          name,
          type,
          key: keyValue,
          usage: 0,
        }
      ])
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error creating API key:', error);
    return { data: null, error };
  }
}

/**
 * Update an API key
 */
export async function updateApiKey(id, updates) {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    console.error('Error updating API key:', error);
    return { data: null, error };
  }
}

/**
 * Delete an API key
 */
export async function deleteApiKey(id) {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting API key:', error);
    return { error };
  }
}

/**
 * Count total API keys
 */
export async function countApiKeys() {
  try {
    const { count, error } = await supabase
      .from(TABLE_NAME)
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return { count, error: null };
  } catch (error) {
    console.error('Error counting API keys:', error);
    return { count: 0, error };
  }
} 