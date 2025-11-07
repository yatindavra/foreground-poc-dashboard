'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { Card } from '@/components/ui/card'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const icon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png' })

export default function MapClient() {
  const [pos, setPos] = useState([0, 0])

  useEffect(() => {
    const s = new EventSource('/api/stream')
    s.onmessage = e => {
      const { lat, lng } = JSON.parse(e.data)
      setPos([lat, lng])
    }
    return () => s.close()
  }, [])

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="overflow-hidden shadow-xl">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">Live Location Tracker</h2>
          <p className="text-muted-foreground mt-1">Real-time position: {pos[0].toFixed(6)}, {pos[1].toFixed(6)}</p>
        </div>
        <div className="h-screen">
          <MapContainer center={pos} zoom={16} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={pos} icon={icon} />
          </MapContainer>
        </div>
      </Card>
    </div>
  )
}