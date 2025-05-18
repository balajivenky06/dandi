import { supabase } from '../utils/supabase';
import { v4 as uuidv4 } from 'uuid';

class ApiKeyService {
  /**
   * Get all API keys for the current user
   */
  async getApiKeys() {
    try {
      console.log('Fetching API keys...');
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching API keys:', error);
        throw error;
      }

      console.log('Successfully fetched API keys:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      throw error;
    }
  }
  
  /**
   * Create a new API key
   * @param {Object} keyData - The key data (name, type)
   */
  async createApiKey({ name, type }) {
    try {
      console.log('Creating new API key:', { name, type });
      
      // Generate a random API key
      const key = `dandi_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            name,
            type,
            key,
            usage: 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating API key:', error);
        throw error;
      }

      console.log('Successfully created API key:', data?.id);
      return data;
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error;
    }
  }
  
  /**
   * Update an API key
   * @param {string} id - The key ID
   * @param {Object} keyData - The updated key data
   */
  async updateApiKey(id, { name }) {
    try {
      console.log('Updating API key:', { id, name });
      
      const { data, error } = await supabase
        .from('api_keys')
        .update({ name })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating API key:', error);
        throw error;
      }

      console.log('Successfully updated API key:', data?.id);
      return data;
    } catch (error) {
      console.error('Failed to update API key:', error);
      throw error;
    }
  }
  
  /**
   * Delete an API key
   * @param {string} id - The key ID to delete
   */
  async deleteApiKey(id) {
    try {
      console.log('Deleting API key:', id);
      
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting API key:', error);
        throw error;
      }

      console.log('Successfully deleted API key:', id);
      return true;
    } catch (error) {
      console.error('Failed to delete API key:', error);
      throw error;
    }
  }
  
  /**
   * Increment the usage count for an API key
   * @param {string} key - The API key value
   */
  async incrementUsage(key) {
    console.log(`Incrementing usage for key ${key}`);
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('usage')
      .eq('key', key)
      .single();
    
    if (error) {
      console.error('Error fetching API key usage:', error);
      throw error;
    }
    
    const currentUsage = data?.usage || 0;
    
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ usage: currentUsage + 1 })
      .eq('key', key);
    
    if (updateError) {
      console.error('Error updating API key usage:', updateError);
      throw updateError;
    }
    
    console.log(`Usage incremented to ${currentUsage + 1}`);
    return true;
  }
}

export const apiKeyService = new ApiKeyService(); 