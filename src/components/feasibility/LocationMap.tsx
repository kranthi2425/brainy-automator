
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { Loader2 } from "lucide-react";

// Fix leaflet default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up the default icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationMapProps {
  locations: Array<{
    id: string;
    latitude: number;
    longitude: number;
    customer_name: string;
    location_type: string;
  }>;
}

// Component to handle map initialization
function MapInitializer() {
  const map = useMap();
  useEffect(() => {
    // Add zoom controls to the map
    map.zoomControl.setPosition('topright');
    // Fit bounds to show all markers if there are any
    const bounds = map.getBounds();
    if (bounds) {
      map.fitBounds(bounds.pad(0.1));
    }
  }, [map]);
  return null;
}

export default function LocationMap({ locations }: LocationMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const defaultPosition = { lat: 0, lng: 0 };
  const defaultZoom = 2;

  useEffect(() => {
    // Simulate loading time for map initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[600px] w-full rounded-md border flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-md border relative overflow-hidden">
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={[defaultPosition.lat, defaultPosition.lng]}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="z-0"
      >
        <MapInitializer />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
          >
            <Popup className="rounded-lg shadow-lg">
              <div className="p-2">
                <h3 className="font-bold text-base">{location.customer_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{location.location_type}</p>
                <div className="text-xs text-gray-500 mt-2">
                  <p>Lat: {location.latitude.toFixed(6)}</p>
                  <p>Lng: {location.longitude.toFixed(6)}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
