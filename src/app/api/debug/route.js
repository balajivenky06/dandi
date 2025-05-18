import { supabase } from '../../../utils/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Test basic connection with a simple query
    const { data: healthCheck, error: healthError } = await supabase
      .from('api_keys')
      .select('id')
      .limit(1);

    // 2. Try to insert a test record
    const testKey = {
      name: 'Debug Test Key',
      type: 'dev',
      key: 'debug-test-' + Date.now(),
      usage: 0
    };

    const { data: insertData, error: insertError } = await supabase
      .from('api_keys')
      .insert(testKey)
      .select();

    // 3. Try to read the inserted record
    const { data: readData, error: readError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', insertData?.[0]?.id)
      .single();

    // 4. Try to delete the test record
    const { error: deleteError } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', insertData?.[0]?.id);

    // 5. Get total count after operations using a more reliable method
    const { data: allKeys, error: countError } = await supabase
      .from('api_keys')
      .select('id');

    return NextResponse.json({
      healthCheck: {
        success: !healthError,
        error: healthError?.message,
        details: healthError,
        data: healthCheck
      },
      insertTest: {
        success: !insertError,
        error: insertError?.message,
        details: insertError,
        data: insertData
      },
      readTest: {
        success: !readError,
        error: readError?.message,
        details: readError,
        data: readData
      },
      deleteTest: {
        success: !deleteError,
        error: deleteError?.message,
        details: deleteError
      },
      finalCount: {
        success: !countError,
        error: countError?.message,
        details: countError,
        count: allKeys?.length || 0
      },
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      }
    });
  } catch (err) {
    return NextResponse.json({
      error: err.message,
      stack: err.stack
    }, { status: 500 });
  }
} 