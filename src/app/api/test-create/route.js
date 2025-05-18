import { supabase } from '../../../utils/supabase';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    // Create a test API key
    const keyPrefix = "dandi-test-";
    const keyValue = `${keyPrefix}${uuidv4()}`;
    
    const newKey = {
      name: "Test Key " + new Date().toISOString(),
      type: "dev",
      key: keyValue,
      usage: 0
    };
    
    // Try to insert without user_id first (check if RLS is blocking)
    const { data, error } = await supabase
      .from('api_keys')
      .insert(newKey)
      .select();
    
    if (error) {
      console.error('Error creating API key:', error);
      
      // If the error is related to RLS, let's try a workaround for testing
      if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
        return NextResponse.json({ 
          success: false, 
          error: "RLS policy is blocking the insert. You need to disable RLS for testing or authenticate users.",
          details: error
        }, { status: 403 });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'API key created successfully',
      key: data[0]
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
} 