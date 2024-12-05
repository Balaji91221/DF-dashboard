'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Line,
} from 'react-simple-maps'
import { scaleSequential } from 'd3-scale'
import { interpolateBlues } from 'd3-scale-chromatic'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Log } from '@/hooks/useLogs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useLogs } from '@/hooks/useLogs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MapPin } from 'lucide-react'
// import { Marker } from 'react-leaflet';
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const FIXED_COORDINATES: { [key: string]: [number, number] } = {
  IN: [78.9629, 20.5937],
  US: [-95.7129, 37.0902],
  NL: [4.8952, 52.3702],
  SE: [18.0686, 59.3293],
}

interface MapProps {
  selectedUser?: User
}

export default function WorldMap({ selectedUser }: MapProps) {
  const { logs } = useLogs()
  const [countryCounts, setCountryCounts] = useState<{ [key: string]: number }>({})
  const [activeMarker, setActiveMarker] = useState<Log | null>(null)
  const [animationInProgress, setAnimationInProgress] = useState(false)
  const [markers, setMarkers] = useState<Log[]>([])
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(-1)
  const animationRef = useRef<number | null>(null)

  const colorScale = useMemo(
    () =>
      scaleSequential(interpolateBlues).domain([
        0,
        Math.max(...Object.values(countryCounts)) || 1,
      ]),
    [countryCounts]
  )

  useEffect(() => {
    const relevantLogs = selectedUser ? selectedUser.logs : logs
    const counts = relevantLogs.reduce((acc: { [key: string]: number }, log: Log) => {
      acc[log.countryCode] = (acc[log.countryCode] || 0) + 1
      return acc
    }, {})
    setCountryCounts(counts)
    setMarkers(relevantLogs)
  }, [selectedUser, logs])

  const animateMarkers = () => {
    if (animationInProgress) {
      cancelAnimationFrame(animationRef.current || 0)
      setAnimationInProgress(false)
      setCurrentMarkerIndex(-1)
      return
    }

    setAnimationInProgress(true)
    let index = 0

    const animate = () => {
      if (index < markers.length) {
        setCurrentMarkerIndex(index)
        setActiveMarker(markers[index])
        index++
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setAnimationInProgress(false)
        setCurrentMarkerIndex(-1)
      }
    }

    animate()
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Global Login Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 120 }}
          >
            <ZoomableGroup center={[0, 10]} zoom={1.2}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={colorScale(countryCounts[geo.properties.ISO_A2] || 0)}
                      stroke="#000000"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#F53', outline: 'none', stroke: '#000000', strokeWidth: 0.75 },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Fixed markers */}
              <TooltipProvider>
                {Object.entries(FIXED_COORDINATES).map(([countryCode, coordinates]) => (
                  <Tooltip key={countryCode}>
                    <TooltipTrigger>
                      <Marker coordinates={coordinates}>
                        <motion.circle
                          r={6}
                          fill="#FF6B6B"
                          stroke="#FFF"
                          strokeWidth={2}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                          }}
                        />
                      </Marker>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{countryCode} Server</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>

                {Object.entries(FIXED_COORDINATES).map(([countryCode, coordinates]) => (
                  <Marker key={countryCode} coordinates={coordinates}>
                  <MapPin fill='red' className="text-red-500" size={8} />
                  </Marker>
                ))}
              <AnimatePresence>
                {markers.slice(0, currentMarkerIndex + 1).map((marker, index) => {
                  const startCoordinates = FIXED_COORDINATES[marker.countryCode];
                  return (
                    <motion.g
                      key={`${marker.ip}-${index}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Marker coordinates={[marker.longitude, marker.latitude]}>
                        <motion.circle
                          r={4}
                          fill="#4CAF50"
                          stroke="#FFF"
                          strokeWidth={2}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                          }}
                        />
                      </Marker>
                      {startCoordinates && (
                        <Line
                          from={startCoordinates}
                          to={[marker.longitude, marker.latitude]}
                          stroke="#FF6B6B"
                          strokeWidth={2}
                          strokeLinecap="round"
                        />
                      )}
                    </motion.g>
                  );
                })}
              </AnimatePresence>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button
            onClick={animateMarkers}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {animationInProgress ? 'Stop Animation' : 'Start Animation'}
          </Button>
          <div className="text-sm">
            Total Logins: {markers.length} | Active Countries: {Object.keys(countryCounts).length}
          </div>
        </div>

        {activeMarker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-4 bg-gray-800 rounded-lg"
          >
            <h3 className="font-semibold text-lg mb-2">Login Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <p><strong>User:</strong> {activeMarker.name}</p>
              <p><strong>Email:</strong> {activeMarker.email}</p>
              <p><strong>Country:</strong> {activeMarker.countryCode}</p>
              <p><strong>IP Address:</strong> {activeMarker.ip}</p>
              <p><strong>Timestamp:</strong> {new Date(activeMarker.timestamp).toLocaleString()}</p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

