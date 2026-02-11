import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    source: 'blank-page-feb9-2026',
    timestamp: new Date().toISOString(),
  });
}
