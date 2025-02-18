
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

// Component to handle map initialization and bounds
function MapInitializer({ locations }: LocationMapProps) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.latitude, loc.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    map.zoomControl.setPosition('topright');
  }, [locations, map]);
  
  return null;
}

export default function LocationMap({ locations }: LocationMapProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  // Default center position (will be overridden by MapInitializer)
  const defaultCenter: [number, number] = [0, 0];

  return (
    <div className="h-[600px] w-full rounded-md border relative overflow-hidden">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={defaultCenter}
        scrollWheelZoom={true}
      >
        <MapInitializer locations={locations} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{location.customer_name}</h3>
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
