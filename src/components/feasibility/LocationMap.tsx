
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  locations: Array<{
    id: string;
    latitude: number;
    longitude: number;
    customer_name: string;
    location_type: string;
  }>;
}

export default function LocationMap({ locations }: LocationMapProps) {
  // Set default center if no locations
  const defaultCenter: LatLngExpression = [0, 0];
  const defaultZoom = 2;

  return (
    <div className="h-[600px] w-full rounded-md border">
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude] as LatLngExpression}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{location.customer_name}</h3>
                <p className="text-sm text-gray-600">{location.location_type}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
