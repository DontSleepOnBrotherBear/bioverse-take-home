
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return NextResponse.json({ supabaseUrl: supabaseUrl, supabaseAnonKey: supabaseAnonKey  }, { status: 200 });
}

