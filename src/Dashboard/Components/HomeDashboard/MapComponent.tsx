import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  from: [number, number];
  to: [number, number];
  className?: string;
};

const orangeIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-orange.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const MapComponent: React.FC<Props> = ({ from, to, className }) => {
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchRoute = async () => {
      const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]] // [lat, lng]
        );
        setRoute(coords);
      } else {
        setRoute([]);
      }
    };
    fetchRoute();
  }, [from, to]);

  return (
    <div className={`p-3 bg-black text-white rounded-lg shadow-lg mr-1 mt-4 ${className}`}>
      <MapContainer
        center={from}
        zoom={13}
        style={{ height: "550px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={from} icon={orangeIcon} />
        <Marker position={to} />
        {route.length > 0 && (
          <Polyline positions={route} pathOptions={{ color: "orange", weight: 6 }} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;