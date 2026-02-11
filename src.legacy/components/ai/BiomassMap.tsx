/**
 * Pasture biomass map: MapLibre + AI layer + legend + hover details.
 * Client-only via dynamic imports to avoid SSR issues and reduce initial bundle.
 */
import { useState, useCallback, lazy, Suspense } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { env } from '@/lib/env';
import { BiomassLegend } from './BiomassLegend';
import { fetchBiomassMap } from '@/lib/biomassApi';
import { useQuery } from '@tanstack/react-query';

const Map = lazy(() =>
  import('react-map-gl').then((m) => ({ default: m.Map }))
);
const Source = lazy(() =>
  import('react-map-gl').then((m) => ({ default: m.Source }))
);
const Layer = lazy(() =>
  import('react-map-gl').then((m) => ({ default: m.Layer }))
);
const NavigationControl = lazy(() =>
  import('react-map-gl').then((m) => ({ default: m.NavigationControl }))
);

export type TileInfo = {
  biomass_mean_t_ha: number;
  biomass_std_t_ha: number;
  pastureId: string;
  tile: { z: number; x: number; y: number };
  model_version?: string;
};

type BiomassMapProps = {
  pastureId: string;
  onTileClick?: (info: TileInfo) => void;
};

const DEFAULT_VIEW = {
  longitude: 150.88,
  latitude: -34.41,
  zoom: 12,
};

function toViewState(center?: {
  latitude?: number;
  longitude?: number;
  zoom?: number;
}) {
  if (!center) return DEFAULT_VIEW;
  return {
    longitude: center.longitude ?? DEFAULT_VIEW.longitude,
    latitude: center.latitude ?? DEFAULT_VIEW.latitude,
    zoom: center.zoom ?? DEFAULT_VIEW.zoom,
  };
}

export function BiomassMap({ pastureId, onTileClick }: BiomassMapProps) {
  const [popup, setPopup] = useState<TileInfo | null>(null);
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['biomassMap', pastureId],
    queryFn: () => fetchBiomassMap(pastureId),
    enabled: !!pastureId,
    staleTime: 5 * 60 * 1000,
  });

  const viewState = toViewState(data?.center);
  const geojson =
    data?.geojson ?? { type: 'FeatureCollection' as const, features: [] };

  const handleClick = useCallback(
    (e: {
      point: [number, number];
      target: {
        queryRenderedFeatures(
          p: [number, number],
          o?: { layers?: string[] }
        ): { properties?: Record<string, unknown> }[];
      };
    }) => {
      const features = e.target.queryRenderedFeatures(e.point, {
        layers: ['biomass-fill'],
      });
      if (features.length > 0 && features[0].properties) {
        const p = features[0].properties as Record<string, unknown>;
        const info: TileInfo = {
          biomass_mean_t_ha: Number(p.biomass ?? 0) / 1000,
          biomass_std_t_ha: Number(p.uncertainty ?? 0.3) * 0.5,
          pastureId,
          tile: { z: 0, x: 0, y: 0 },
        };
        setPopup(info);
        onTileClick?.(info);
      }
    },
    [pastureId, onTileClick]
  );

  if (isLoading) {
    return (
      <div className="h-[600px] rounded-xl border border-slate-200 flex items-center justify-center text-sm text-slate-500">
        Loading map…
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="h-[600px] rounded-xl border border-slate-200 flex items-center justify-center text-sm text-red-500">
        Failed to load map.
      </div>
    );
  }

  return (
    <div className="relative h-[600px] rounded-xl overflow-hidden shadow border border-slate-200">
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Loading map…
          </div>
        }
      >
        <Map
          mapLib={maplibregl}
          initialViewState={viewState}
          mapStyle="https://demotiles.maplibre.org/style.json"
          mapboxAccessToken={env.mapboxToken || undefined}
          onClick={handleClick}
          cursor={popup ? 'pointer' : 'grab'}
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-left" />
          {geojson.features.length > 0 && (
            <Source id="biomass-geojson" type="geojson" data={geojson}>
              <Layer
                id="biomass-fill"
                type="fill"
                paint={{
                  'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'biomass'],
                    0,
                    '#8A6B4A',
                    1500,
                    '#90A583',
                    3000,
                    '#3F6B3F',
                  ],
                  'fill-opacity': 0.7,
                  'fill-outline-color': '#ffffff',
                }}
              />
            </Source>
          )}
        </Map>
      </Suspense>

      <div className="absolute right-4 top-4 z-20">
        <BiomassLegend />
      </div>

      {popup && (
        <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 z-20 max-w-[200px]">
          <div className="text-sm font-semibold text-slate-800">Tile info</div>
          <div className="text-xs mt-1 text-slate-600">
            Mean: {popup.biomass_mean_t_ha.toFixed(2)} t/ha
          </div>
          <div className="text-xs text-slate-500">
            Std: {popup.biomass_std_t_ha.toFixed(2)} t/ha
          </div>
          {popup.model_version && (
            <div className="text-[10px] text-slate-400 mt-1">
              Model: {popup.model_version}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
