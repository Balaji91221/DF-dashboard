'use client'

import { useLogs } from "@/components/useLogs"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { scaleSequential } from "d3-scale"
import { interpolateBlues } from "d3-scale-chromatic"

// URL to the world map geography data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const Map = () => {
  const { logs, countryCounts } = useLogs()

  // Color scale for country shading based on login count
  const colorScale = scaleSequential(interpolateBlues).domain([0, Math.max(...Object.values(countryCounts))])

  // Function to map Alpha-2 codes to Alpha-3 codes if needed
  const alpha2ToAlpha3 = (alpha2: string) => {
    // You can use a mapping or fetch this data if available in the logs or an API
    const countryCodeMapping: { [key: string]: string } = {
      'US': 'USA', 'IN': 'IND', 'GB': 'GBR', 'DE': 'DEU',
      // Add more mappings as required
    }
    return countryCodeMapping[alpha2] || alpha2  // Return Alpha-2 if no mapping found
  }

  return (
    <div className="p-6 space-y-6 border rounded-lg">
      <div className="bg-gray-900 rounded-lg shadow-lg p-4">
        <h2 className="text-white text-xl font-semibold mb-4">Login Locations</h2>

        {/* Map container */}
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden rounded-md shadow-md bg-gray-800">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 100, center: [0, 20] }}
            width={800}
            height={400}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = geo.properties.ISO_A2  // Alpha-2 code from geography
                  const countryCodeAlpha3 = alpha2ToAlpha3(countryCode) // Convert Alpha-2 to Alpha-3 if needed
                  const fillColor = colorScale(countryCounts[countryCodeAlpha3] || 0)
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#2d3748"
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#63b3ed", outline: "none" },
                        pressed: { fill: "#2c5282", outline: "none" },
                      }}
                    />
                  )
                })
              }
            </Geographies>

            {/* Markers for login locations */}
            {logs.map((log, index) =>
              log.latitude && log.longitude ? (
                <Marker key={index} coordinates={[log.longitude, log.latitude]}>
                  <circle r={4} fill="#FF5533" stroke="#FFF" strokeWidth={2} />
                </Marker>
              ) : null
            )}
          </ComposableMap>
        </div>
      </div>
    </div>
  )
}

export default Map