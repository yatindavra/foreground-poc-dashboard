'use client'
import dynamic from 'next/dynamic'

const MapPage = dynamic(() => import('@/components/mapClientV2.js'), { ssr: false })

export default function Page() {
  return <MapPage />
}
