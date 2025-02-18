
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix leaflet default marker icon
// Get the default icon image URLs
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

export default function LocationMap({ locations }: LocationMapProps) {
  const defaultPosition: [number, number] = [0, 0]; // Using tuple type for coordinates
  const defaultZoom = 2;

  return (
    <div className="h-[600px] w-full rounded-md border">
      <MapContainer
        style={{ width: '100%', height: '100%' }}
        center={defaultPosition}
        zoom={defaultZoom}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => {
          const position: [number, number] = [location.latitude, location.longitude];
          return (
            <Marker
              key={location.id}
              position={position}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{location.customer_name}</h3>
                  <p className="text-sm text-gray-600">{location.location_type}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
