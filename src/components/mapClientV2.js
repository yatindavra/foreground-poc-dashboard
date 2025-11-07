"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import L from 'leaflet'


const icon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png' })

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });



export default function Page() {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/db", { cache: "no-store" });
    const json = await res.json();
    setUsers(json.users || []);
    if (!selectedId && (json.users || []).length) setSelectedId(json.users[0].id);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const selected = useMemo(() => users.find(u => u.id === selectedId) || null, [users, selectedId]);

  const act = async (action, userId) => {
    setLoading(true);
    await fetch(`/api/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    setLoading(false);
    load();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: 280, borderRight: "1px solid #eee", padding: 16, overflowY: "auto" }}>
        <h3>Users</h3>
        {users.map(u => (
          <div key={u.id} onClick={() => setSelectedId(u.id)} style={{ padding: 8, marginBottom: 6, cursor: "pointer", borderRadius: 8, background: selectedId === u.id ? "#eef6ff" : "#f7f7f7" }}>
            <div style={{ fontWeight: 600 }}>{u.name || u.id}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Tracking desired: {u.trackingDesired ? "yes" : "no"}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Last seen: {u.lastSeen || "—"}</div>
          </div>
        ))}
      </aside>

      <main style={{ flex: 1, padding: 16 }}>
        {!selected ? (
          <div>Select a user</div>
        ) : (
          <>
            <h2>{selected.name || selected.id}</h2>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <button disabled={loading} onClick={() => act("start", selected.id)}>Start</button>
              <button disabled={loading} onClick={() => act("stop", selected.id)}>Stop</button>
              <button onClick={load}>Refresh</button>
            </div>

            {selected.currentLocation && (
              <div style={{ height: "400px", borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
                <MapContainer
                  center={[selected.currentLocation.latitude, selected.currentLocation.longitude]}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[selected.currentLocation.latitude, selected.currentLocation.longitude]} icon={icon}>
                    <Popup>{selected.name || selected.id}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}

            <h4>Recent (max 10)</h4>
            {(selected.locations || []).slice().reverse().map((loc, i) => (
              <div key={i} style={{ fontSize: 14 }}>
                {loc.timestamp} → {loc.latitude}, {loc.longitude}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
