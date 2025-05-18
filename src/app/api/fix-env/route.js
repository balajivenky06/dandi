import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return NextResponse.json({
    url: supabaseUrl,
    key: supabaseKey ? {
      length: supabaseKey.length,
      containsLineBreaks: supabaseKey.includes('\n'),
      first10: supabaseKey.substring(0, 10),
      last10: supabaseKey.substring(supabaseKey.length - 10)
    } : null
  });
} 