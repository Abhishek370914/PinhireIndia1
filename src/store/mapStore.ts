"use client"

import { create } from "zustand"
import type { Company, MapFilters, MapViewMode, MapViewport } from "@/types"

interface MapState {
  // Viewport
  viewport: MapViewport
  setViewport: (v: Partial<MapViewport>) => void

  // Selected company
  selectedCompanyId: string | null
  selectedCompany: Company | null
  setSelectedCompany: (id: string | null, company?: Company | null) => void

  // View mode
  viewMode: MapViewMode
  setViewMode: (mode: MapViewMode) => void

  // Filters
  filters: MapFilters
  setFilters: (filters: Partial<MapFilters>) => void
  resetFilters: () => void

  // Hovered company (for map highlight)
  hoveredCompanyId: string | null
  setHoveredCompanyId: (id: string | null) => void

  // Panel open state
  isPanelOpen: boolean
  setIsPanelOpen: (open: boolean) => void

  // Current city detected from map viewport
  currentCity: string | null
  setCurrentCity: (city: string | null) => void

  // Companies visible in current map view
  visibleCompanies: Company[]
  setVisibleCompanies: (companies: Company[]) => void

  // MapRef flyTo helper (set by MapView)
  flyToCity: ((target: string | [number, number], zoom?: number) => void) | null
  setFlyToCity: (fn: (target: string | [number, number], zoom?: number) => void) => void

  // User GPS location
  userLocation: { lat: number; lng: number } | null
  setUserLocation: (loc: { lat: number; lng: number } | null) => void

  // Cinematic temporary ping location
  pingLocation: { lat: number; lng: number } | null
  setPingLocation: (loc: { lat: number; lng: number } | null) => void

  // Heatmap Overlay Toggle
  showHeatmap: boolean
  setShowHeatmap: (show: boolean) => void

  // Smart Match Radar
  isRadarActive: boolean
  setIsRadarActive: (active: boolean) => void
  radarMatches: Record<string, { score: number; reasons: string[] }> | null
  setRadarMatches: (matches: Record<string, { score: number; reasons: string[] }> | null) => void
}

const DEFAULT_FILTERS: MapFilters = {
  industries: [],
  companySizes: [],
  jobTypes: [],
  workModes: [],
  experienceMin: null,
  experienceMax: null,
  salaryMin: null,
  salaryMax: null,
  searchQuery: "",
  city: null,
  locality: null,
}

/** India center viewport */
const DEFAULT_VIEWPORT: MapViewport = {
  latitude: 20.5937,
  longitude: 78.9629,
  zoom: 4.5,
}

export const useMapStore = create<MapState>((set) => ({
  // Viewport
  viewport: DEFAULT_VIEWPORT,
  setViewport: (partial) =>
    set((s) => ({ viewport: { ...s.viewport, ...partial } })),

  // Selected company
  selectedCompanyId: null,
  selectedCompany: null,
  setSelectedCompany: (id, company = null) =>
    set({ selectedCompanyId: id, selectedCompany: company, isPanelOpen: id !== null }),

  // View mode
  viewMode: "map",
  setViewMode: (viewMode) => set({ viewMode }),

  // Filters
  filters: DEFAULT_FILTERS,
  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // Hover
  hoveredCompanyId: null,
  setHoveredCompanyId: (id) => set({ hoveredCompanyId: id }),

  // Panel
  isPanelOpen: false,
  setIsPanelOpen: (open) => set({ isPanelOpen: open }),

  // City
  currentCity: null,
  setCurrentCity: (currentCity) => set({ currentCity }),

  // Visible companies
  visibleCompanies: [],
  setVisibleCompanies: (visibleCompanies) => set({ visibleCompanies }),

  // FlyTo helper
  flyToCity: null,
  setFlyToCity: (fn) => set({ flyToCity: fn }),

  // User location
  userLocation: null,
  setUserLocation: (userLocation) => set({ userLocation }),

  // Cinematic ping location
  pingLocation: null,
  setPingLocation: (pingLocation) => set({ pingLocation }),

  // Heatmap Overlay Toggle
  showHeatmap: false,
  setShowHeatmap: (showHeatmap) => set({ showHeatmap }),

  // Smart Match Radar
  isRadarActive: false,
  setIsRadarActive: (isRadarActive) => set({ isRadarActive }),
  radarMatches: null,
  setRadarMatches: (radarMatches) => set({ radarMatches })
}))
