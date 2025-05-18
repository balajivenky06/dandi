import { supabase } from '../../../utils/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the connection by getting the tables
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error,
        env: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
        }
      }, { status: 500 });
    }

    // Check if the table exists
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      tableExists: true,
      rowCount: data?.length || 0,
      sample: data || []
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