
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRef } from 'react';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  id: string;
  customer_name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationMapProps {
  locations: Location[];
}

export default function LocationMap({ locations }: LocationMapProps) {
  const mapRef = useRef<LeafletMap>(null);

  // Find center point from all locations or default to a world view
  const validLocations = locations.filter(loc => loc.latitude && loc.longitude);
  const defaultCenter: LatLngExpression = [0, 0];
  const center: LatLngExpression = validLocations.length > 0
    ? [
        validLocations.reduce((sum, loc) => sum + (loc.latitude || 0), 0) / validLocations.length,
        validLocations.reduce((sum, loc) => sum + (loc.longitude || 0), 0) / validLocations.length
      ]
    : defaultCenter;

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden border">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={2}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          location.latitude && location.longitude ? (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude] as LatLngExpression}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{location.customer_name}</h3>
                  <p>{location.address}</p>
                  <p>{location.city}, {location.country}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}
