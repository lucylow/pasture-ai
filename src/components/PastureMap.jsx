import { Map, Marker } from 'react-map-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibregl from 'maplibre-gl'

export default function PastureMap({ analyses }) {
  return (
    <Map
      mapLib={maplibregl}
      initialViewState={{
        longitude: -74.006,
        latitude: 40.7128,
        zoom: 12
      }}
      style={{ width: '100%', height: '400px' }}
      mapStyle="https://demotiles.maplibre.org/style.json"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
    >
      {analyses?.map(analysis => (
        <Marker
          key={analysis.id}
          longitude={analysis.gps_lon}
          latitude={analysis.gps_lat}
          color={getHealthColor(analysis.pasture_health)}
        />
      ))}
    </Map>
  )
}

function getHealthColor(health) {
  const colors = {
    poor: '#ef4444', fair: '#f59e0b', good: '#10b981', excellent: '#059669'
  }
  return colors[health] || '#6b7280'
}
