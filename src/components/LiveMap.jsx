// frontend/src/components/LiveMap.jsx
import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// fix default marker icons in many bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const donorIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

const hospitalIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

const RoutingMachine = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from.latitude, from.longitude),
        L.latLng(to.latitude, to.longitude),
      ],
      lineOptions: {
        addWaypoints: false,
      },
      routeWhileDragging: false,
      draggableWaypoints: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [from, to, map]);

  return null;
};

const LiveMap = ({ donors = [], hospitals = [], route = null }) => {
  const centerSource = hospitals[0] || donors[0] || {
    latitude: 12.9716,
    longitude: 77.5946,
  };

  const center = [centerSource.latitude, centerSource.longitude];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{
        height: "320px",
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {donors.map((d) => (
        <Marker
          key={d.userId || d.id}
          position={[d.latitude, d.longitude]}
          icon={donorIcon}
        >
          <Popup>{d.name || "Donor"}</Popup>
        </Marker>
      ))}

      {hospitals.map((h) => (
        <Marker
          key={h.userId || h.id}
          position={[h.latitude, h.longitude]}
          icon={hospitalIcon}
        >
          <Popup>{h.name || "Hospital"}</Popup>
        </Marker>
      ))}

      {route && route.from && route.to && (
        <RoutingMachine from={route.from} to={route.to} />
      )}
    </MapContainer>
  );
};

export default LiveMap;
