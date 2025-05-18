import { supabase } from '../../../utils/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if the table exists by querying its structure
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'api_keys' });
    
    if (tableError) {
      // If the RPC function doesn't exist, try a direct query
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'api_keys');
      
      if (columnsError) {
        return NextResponse.json({ 
          success: false, 
          error: "Could not verify table structure",
          details: { tableError, columnsError }
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Table exists',
        columns: columns
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Table exists',
      tableInfo
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