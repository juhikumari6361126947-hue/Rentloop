import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

function MapEvents({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function LocationPicker({ lat, lng, onChange }) {
  const defaultCenter = [20.5937, 78.9629]; // India center
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState(null);

  const center = lat && lng ? [lat, lng] : defaultCenter;
  const zoom = lat && lng ? 13 : 4;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery || !map) return;
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const results = await resp.json();
      if (results && results.length > 0) {
        const { lat: resultLat, lon: resultLng } = results[0];
        const newLat = Number(resultLat);
        const newLng = Number(resultLng);
        // update map view and marker
        map.setView([newLat, newLng], 13, { animate: true });
        onChange(newLat, newLng);
      } else {
        alert("Location not found. Try a different query.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to search location.");
    }
  };

  return (
    <div className="space-y-2">
      {/* Search Bar */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search location…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 input"
          required
        />
        <button onClick={handleSearch} className="btn-primary whitespace-nowrap">Search</button>
      </div>

      <div className="w-full h-[250px] rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0 relative">
        <MapContainer 
          center={center} 
          zoom={zoom} 
          className="w-full h-full" 
          scrollWheelZoom={true}
          whenCreated={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {lat && lng && <Marker position={[lat, lng]} />}
          <MapEvents setLocation={onChange} />
        </MapContainer>
      </div>
    </div>
  );
}
