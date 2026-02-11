import { NextRequest, NextResponse } from 'next/server';

/**
 * Mock biomass prediction API for Lovable/preview when no Python backend is available.
 * Returns deterministic demo values based on file size.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Deterministic mock: use file size to vary output
    const sizeFactor = Math.min(1, file.size / (1024 * 1024));
    const base = Math.round(600 + sizeFactor * 300);
    const dryTotal = Math.min(400, Math.max(50, base));

    return NextResponse.json({
      predictions: {
        Dry_Total_g: dryTotal,
        GDM_g: dryTotal * 0.8,
        Dry_Green_g: dryTotal * 0.6,
        Dry_Dead_g: dryTotal * 0.2,
        Dry_Clover_g: dryTotal * 0.05,
      },
      metrics: {
        pasture_health: dryTotal > 650 ? 'good' : dryTotal > 400 ? 'fair' : 'poor',
      },
      confidence_score: 0.7 + sizeFactor * 0.2,
    });
  } catch {
    return NextResponse.json(
      { error: 'Prediction failed' },
      { status: 500 }
    );
  }
}
