"use client"

import React, { useEffect, useRef, useCallback, useMemo } from "react"
import type { Company } from "@/types"
import { useMapStore } from "@/store/mapStore"
import { Flame } from "lucide-react"
import Supercluster from "supercluster"
import { JOBS_BY_COMPANY } from "@/lib/data-indices"

// ── Haversine distance formula ──────────────────────────────────
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── City coordinates ──────────────────────────────────────────────
export const INDIA_CITIES: Record<string, { lat: number; lng: number; zoom: number }> = {
  bengaluru: { lat: 12.9716, lng: 77.5946, zoom: 12 },
  bangalore: { lat: 12.9716, lng: 77.5946, zoom: 12 },
  mumbai: { lat: 19.076, lng: 72.8777, zoom: 12 },
  delhi: { lat: 28.6139, lng: 77.209, zoom: 11 },
  hyderabad: { lat: 17.385, lng: 78.4867, zoom: 12 },
  pune: { lat: 18.5204, lng: 73.8567, zoom: 12 },
  chennai: { lat: 13.0827, lng: 80.2707, zoom: 12 },
  gurugram: { lat: 28.4595, lng: 77.0266, zoom: 12 },
  gurgaon: { lat: 28.4595, lng: 77.0266, zoom: 12 },
  noida: { lat: 28.5355, lng: 77.391, zoom: 12 },
  ahmedabad: { lat: 23.0225, lng: 72.5714, zoom: 12 },
  kolkata: { lat: 22.5726, lng: 88.3639, zoom: 12 },
  jaipur: { lat: 26.9124, lng: 75.7873, zoom: 12 },
  kochi: { lat: 9.9312, lng: 76.2673, zoom: 13 },
  india: { lat: 20.5937, lng: 78.9629, zoom: 5 },
}

function detectCity(lat: number, lng: number, zoom: number): string | null {
  if (zoom < 9) return null
  for (const [name, coords] of Object.entries(INDIA_CITIES)) {
    if (name === "india" || name === "gurgaon" || name === "bangalore") continue
    if (Math.abs(lat - coords.lat) < 1.0 && Math.abs(lng - coords.lng) < 1.0) {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
  }
  return null
}

// ── Make a company DivIcon ───────────────────────────────────────
function makeIcon(L: typeof import("leaflet"), company: Company, isSelected: boolean) {
  const initials = company.name.slice(0, 1).toUpperCase()
  const border = isSelected ? "#FF6B00" : "rgba(255,255,255,0.8)"
  const shadow = isSelected
    ? "0 0 20px rgba(255,107,0,0.5), 0 12px 24px rgba(0,0,0,0.6)"
    : "0 6px 16px rgba(0,0,0,0.4)"
    
  const jobs = JOBS_BY_COMPANY[company.id] || []
  const hasJobs = jobs.length > 0

  // Premium Marker Design
  const html = `
    <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;width:54px;height:74px;justify-content:flex-end;transform:translateZ(0);">
      ${hasJobs ? `<div class="pulse-ring" style="position:absolute;top:0;left:0;width:54px;height:54px;border-radius:50%;background:rgba(255,107,0,0.2);border:1.5px solid rgba(255,107,0,0.5);pointer-events:none;z-index:0;"></div>` : ""}
      
      <div style="
        width:48px;height:48px;border-radius:14px;overflow:hidden;
        border:2px solid ${border};background:#1E293B;
        box-shadow:${shadow};position:relative;z-index:2;
        display:flex;align-items:center;justify-content:center;
        margin-bottom: auto;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      " class="co-pin ${isSelected ? 'scale-110 shadow-[0_0_25px_rgba(255,107,0,0.4)]' : 'hover:scale-110'}">
        
        <!-- Fallback Intials (Always behind) -->
        <span style="font-weight:900;font-size:20px;color:#475569;position:absolute;z-index:1;user-select:none;">${initials}</span>
        
        <!-- Logo Image Overlay -->
        ${company.logo_url ? `
          <div style="position:absolute;inset:0;background:white;z-index:2;display:flex;align-items:center;justify-content:center;opacity:1;">
            <img src="${company.logo_url}" 
                 alt="${company.name}" 
                 style="width:90%;height:90%;object-fit:contain;pointer-events:none;"
                 onerror="this.parentElement.style.opacity='0'; this.parentElement.style.zIndex='0';"/>
          </div>
        ` : ""}
      </div>
      
      <!-- Pin Stem -->
      <div style="width:2.5px;height:12px;background:${border};margin-top:-1px;z-index:1;border-radius:1px;"></div>
      <div style="width:8px;height:8px;border-radius:50%;background:${border};box-shadow:0 0 12px ${border}; border: 2px solid #fff;"></div>
    </div>`

  return L.divIcon({
    html,
    className: "company-logo-marker",
    iconSize: [54, 74],
    iconAnchor: [27, 74],
    popupAnchor: [0, -74],
  })
}

interface Props {
  companies: Company[]
}

export default React.memo(function MapView({ companies }: Props) {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const userMarkerRef = useRef<any>(null)
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSyncTimeRef = useRef<number>(0)
  const superclusterRef = useRef<any>(null)

  // ATOMIC SELECTORS
  const viewport = useMapStore(s => s.viewport)
  const setViewport = useMapStore(s => s.setViewport)
  const setSelectedCompany = useMapStore(s => s.setSelectedCompany)
  const selectedCompanyId = useMapStore(s => s.selectedCompanyId)
  const selectedCompany = useMapStore(s => s.selectedCompany)
  const setCurrentCity = useMapStore(s => s.setCurrentCity)
  const visibleCompanies = useMapStore(s => s.visibleCompanies)
  const setVisibleCompanies = useMapStore(s => s.setVisibleCompanies)
  const setFlyToCity = useMapStore(s => s.setFlyToCity)
  const setUserLocation = useMapStore(s => s.setUserLocation)
  const pingLocation = useMapStore(s => s.pingLocation)
  const setPingLocation = useMapStore(s => s.setPingLocation)
  const showHeatmap = useMapStore(s => s.showHeatmap)
  const setShowHeatmap = useMapStore(s => s.setShowHeatmap)

  // ── Sync Markers with Map ──────────────────────────────────────────
  const syncMarkers = useCallback((L: typeof import("leaflet")) => {
    if (!mapRef.current || !superclusterRef.current) return
    const map = mapRef.current
    const now = performance.now()
    if (now - lastSyncTimeRef.current < 16) return // Max 60fps sync
    lastSyncTimeRef.current = now

    if (!map.getContainer()?.isConnected) return 

    let bounds, zoom
    try {
      bounds = map.getBounds()
      zoom = map.getZoom()
      if (!bounds || !bounds.getNorthWest) return
    } catch (e) {
      return
    }
    const bbox: [number, number, number, number] = [
      bounds.getWest() - 0.2, bounds.getSouth() - 0.2, 
      bounds.getEast() + 0.2, bounds.getNorth() + 0.2
    ]
    
    const clusters = superclusterRef.current.getClusters(bbox, zoom)
    const currentIds = new Set<string>()
    
    clusters.forEach((cluster: any) => {
      const isCluster = cluster.properties?.cluster
      const id = isCluster ? `cluster-${cluster.id}` : `company-${cluster.properties.company.id}`
      currentIds.add(id)
      
      if (!markersRef.current.has(id)) {
        let marker
        if (isCluster) {
           const count = cluster.properties.point_count
           const html = `<div style="background-color:#FF6B00;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:14px;box-shadow:0 0 20px rgba(255,107,0,0.6);border:2.5px solid #fff;cursor:pointer;">${count}</div>`
           const icon = L.divIcon({ html, className: 'company-cluster-icon', iconSize: [42, 42] })
           marker = L.marker([cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]], { icon })
           
           marker.on('click', () => {
             const expansionZoom = superclusterRef.current.getClusterExpansionZoom(cluster.id)
             map.flyTo([cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]], expansionZoom, { duration: 0.6 })
           })
        } else {
           const c = cluster.properties.company
           const icon = makeIcon(L, c, c.id === useMapStore.getState().selectedCompanyId)
           marker = L.marker([cluster.geometry.coordinates[1], cluster.geometry.coordinates[0]], { icon })
           
           marker.on("click", (e: any) => {
             L.DomEvent.stopPropagation(e)
             useMapStore.getState().setSelectedCompany(c.id, c)
           })
           
           const coJobs = JOBS_BY_COMPANY[c.id] || []
           const tooltipHtml = `
             <div style="padding:10px;min-width:140px;background:#1E293B;border:1px solid rgba(255,107,0,0.3);border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
               <div style="font-weight:800;font-size:14px;color:#fff;margin-bottom:2px;">${c.name}</div>
               <div style="color:#94A3B8;font-size:11px;font-weight:600;display:flex;items-center:center;gap:4px;">
                 <MapPin size={10} style="color:#FF6B00"/> ${c.locality ?? c.city}
               </div>
               ${coJobs.length > 0 ? `
                 <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);color:#22C55E;font-weight:800;font-size:12px;display:flex;align-items:center;gap:6px;">
                   <div style="width:8px;height:8px;border-radius:50%;background:#22C55E;box-shadow:0 0 10px #22C55E;"></div>
                   ${coJobs.length} Active Positions
                 </div>
               ` : ''}
             </div>
           `
           marker.bindTooltip(tooltipHtml, { direction: "top", offset: [0, -76], className: "premium-tooltip", opacity: 1 })
        }
        marker.addTo(map)
        markersRef.current.set(id, marker)
      }
    })
    
    // Cleanup old markers
    markersRef.current.forEach((marker: any, id: string) => {
      if (!currentIds.has(id)) {
        try { map.removeLayer(marker) } catch (_) {}
        markersRef.current.delete(id)
      }
    })
  }, [])

  // ── Visible companies from bounds ────────────────────────────────
  const updateViewState = useCallback((map: any) => {
    if (!map || !map.getContainer()) return
    
    let b, center, zoom
    try {
      b = map.getBounds()
      center = map.getCenter()
      zoom = map.getZoom()
    } catch (e) {
      return
    }

    setViewport({ latitude: center.lat, longitude: center.lng, zoom })
    setCurrentCity(detectCity(center.lat, center.lng, zoom))

    const sw = b.getSouthWest()
    const ne = b.getNorthEast()
    const visible = companies.filter(
      (c) => c.lat >= sw.lat && c.lat <= ne.lat && c.lng >= sw.lng && c.lng <= ne.lng
    )
    setVisibleCompanies(visible)
  }, [companies, setViewport, setCurrentCity, setVisibleCompanies])

  // ── Init map once ─────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !mapDivRef.current || mapRef.current) return

    import("leaflet").then((L) => {
      if (mapRef.current) return

      const map = L.map(mapDivRef.current!, {
        center: [viewport.latitude, viewport.longitude],
        zoom: viewport.zoom,
        zoomControl: false,
        preferCanvas: true,
        inertia: true,
        zoomAnimation: true,
        scrollWheelZoom: true,
        dragging: true,
      })

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 20,
        attribution: '© CartoDB',
        noWrap: true
      }).addTo(map)

      L.control.zoom({ position: "bottomright" }).addTo(map)
      mapRef.current = map

      // ── Supercluster Initialization ──
      const sc = new Supercluster({ radius: 60, maxZoom: 16 })
      superclusterRef.current = sc
      
      const features = companies.map(c => ({
        type: "Feature" as const,
        properties: { cluster: false, company: c },
        geometry: { type: "Point" as const, coordinates: [c.lng, c.lat] }
      }))
      sc.load(features)

      // Initial Sync when ready
      map.whenReady(() => {
        if (mapRef.current) syncMarkers(L)
      })

      let animationFrameId: number
      const handleMove = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
        animationFrameId = requestAnimationFrame(() => syncMarkers(L))
      }

      map.on("move", handleMove)
      map.on("moveend", () => {
        syncMarkers(L)
        if (moveTimerRef.current) clearTimeout(moveTimerRef.current)
        moveTimerRef.current = setTimeout(() => updateViewState(map), 150)
      })

      updateViewState(map)

      // Expose flyToCity to store
      useMapStore.getState().setFlyToCity((target: string | [number, number], customZoom = 14) => {
        if (!mapRef.current) return
        const map = mapRef.current
        let targetLat = 0, targetLng = 0, targetZoom = customZoom

        if (typeof target === 'string') {
          const key = target.toLowerCase().trim()
          const coords = INDIA_CITIES[key]
          if (!coords) return
          targetLat = coords.lat, targetLng = coords.lng, targetZoom = coords.zoom
        } else {
          targetLat = target[0], targetLng = target[1]
        }
        
        map.flyTo([targetLat, targetLng], targetZoom, { duration: 1.5, easeLinearity: 0.2 })
      })

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (!mapRef.current || !mapRef.current.getContainer()) return
            const { latitude, longitude } = pos.coords
            useMapStore.getState().setUserLocation({ lat: latitude, lng: longitude })
            
            const userIcon = L.divIcon({
              html: `<div style="width:18px;height:18px;border-radius:50%;background:#4285F4;border:3px solid #fff;box-shadow:0 0 0 4px rgba(66,133,244,0.25);"></div>`,
              className: "", iconSize: [18, 18], iconAnchor: [9, 9],
            })
            
            try {
              if (userMarkerRef.current) {
                try { mapRef.current.removeLayer(userMarkerRef.current) } catch (_) {}
              }
              userMarkerRef.current = L.marker([latitude, longitude], { 
                icon: userIcon, 
                zIndexOffset: 1000 
              }).addTo(mapRef.current)
            } catch (e) {
              console.warn("Leaflet: failed to add user marker", e)
            }
          },
          () => {}, { enableHighAccuracy: true, timeout: 10000 }
        )
      }
    })

    return () => {
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current)
      if (mapRef.current) {
        try { mapRef.current.remove() } catch (_) {}
        mapRef.current = null
        markersRef.current.clear()
      }
    }
  }, [viewport.latitude, viewport.longitude, viewport.zoom, companies, updateViewState, setViewport, setFlyToCity, setUserLocation])

  const pingMarkerRef = useRef<any>(null)
  useEffect(() => {
    if (!pingLocation || !mapRef.current) return
    import("leaflet").then((L) => {
      const pingIcon = L.divIcon({
        html: `<div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
          <div class="pulse-ring" style="position:absolute;width:64px;height:64px;border-radius:50%;background:rgba(232,98,26,0.3);border:2px solid #E8621A;"></div>
          <div style="width:14px;height:14px;border-radius:50%;background:#E8621A;border:2px solid #fff;"></div>
        </div>`,
        className: "", iconSize: [24, 24], iconAnchor: [12, 12],
      })
      try { if (pingMarkerRef.current) pingMarkerRef.current.remove() } catch (_) {}
      const timer = setTimeout(() => {
        if (!mapRef.current || !pingLocation) return
        try {
          pingMarkerRef.current = L.marker([pingLocation.lat, pingLocation.lng], { icon: pingIcon, zIndexOffset: 2000 }).addTo(mapRef.current)
          setTimeout(() => { try { if (pingMarkerRef.current) pingMarkerRef.current.remove() } catch (_) {}; setPingLocation(null) }, 4500)
        } catch (_) {}
      }, 3300)
      return () => { clearTimeout(timer); try { if (pingMarkerRef.current) pingMarkerRef.current.remove() } catch (_) {} }
    })
  }, [pingLocation, setPingLocation])

  useEffect(() => {
    if (!mapRef.current) return
    import("leaflet").then((L) => {
      markersRef.current.forEach((marker: any, id: string) => {
        if (id.startsWith('cluster-')) return
        const companyId = id.replace('company-', '')
        const company = companies.find((c) => c.id === companyId)
        if (!company) return
        marker.setIcon(makeIcon(L, company, companyId === selectedCompanyId))
      })
    })
  }, [selectedCompanyId, companies])

  useEffect(() => {
    if (!mapRef.current || !selectedCompany) return
    const timer = setTimeout(() => {
       if (!mapRef.current) return
       const currentZoom = mapRef.current.getZoom()
       mapRef.current.flyTo([selectedCompany.lat, selectedCompany.lng - (currentZoom > 12 ? 0.005 : 0)], Math.max(currentZoom, 15), { duration: 1.4, easeLinearity: 0.25 })
    }, 150)
    return () => clearTimeout(timer)
  }, [selectedCompany])

  const heatLayerRef = useRef<any>(null)
  useEffect(() => {
    if (!mapRef.current) return
    if (showHeatmap) {
      import("leaflet").then((leaflet) => {
        import("leaflet.heat").then(() => {
          const L = (window as any).L || leaflet
          if (heatLayerRef.current) {
            try { mapRef.current.removeLayer(heatLayerRef.current) } catch (_) {}
          }
          if (L.heatLayer) {
            const points = visibleCompanies.map(c => [c.lat, c.lng, Math.min((JOBS_BY_COMPANY[c.id]?.length || 0) * 0.15, 1.0)])
            heatLayerRef.current = L.heatLayer(points, { radius: 40, blur: 25, maxZoom: 14, gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' } }).addTo(mapRef.current)
          }
        })
      })
    } else if (heatLayerRef.current && mapRef.current) {
      try { mapRef.current.removeLayer(heatLayerRef.current) } catch (_) {}
      heatLayerRef.current = null
    }
  }, [showHeatmap, visibleCompanies])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapDivRef} className="w-full h-full z-0 touch-none antialiased" />
      <div className="absolute bottom-8 left-6 z-[1000]">
        <button onClick={() => setShowHeatmap(!showHeatmap)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-[11px] transition-all shadow-xl backdrop-blur-md border ${showHeatmap ? "bg-saffron text-white border-orange-400" : "bg-[#0A0D1F]/90 text-zinc-400 border-white/10 hover:border-saffron/30"}`}>
          <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-white' : 'text-saffron'}`} />
          {showHeatmap ? "HEATMAP ON" : "LIVE JOB HEATMAP"}
        </button>
      </div>
    </>
  )
})
