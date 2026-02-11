import { NextResponse } from 'next/server';
import { mockFarmData } from '@/data/mock/farm1';

export async function GET() {
  return NextResponse.json({ ok: true, farm: mockFarmData });
}
