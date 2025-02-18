
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
  return (
    <div className="h-[600px] w-full rounded-md border flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Location Information</h3>
          <p>Total locations: {locations.length}</p>
        </div>
        <div className="max-h-96 overflow-y-auto w-full max-w-md p-4">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className="p-4 border rounded-lg mb-2 bg-white shadow-sm"
            >
              <h4 className="font-semibold">{location.customer_name}</h4>
              <p className="text-sm text-gray-600 mt-1">{location.location_type}</p>
              <div className="text-xs text-gray-500 mt-2">
                <p>Lat: {location.latitude.toFixed(6)}</p>
                <p>Lng: {location.longitude.toFixed(6)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
