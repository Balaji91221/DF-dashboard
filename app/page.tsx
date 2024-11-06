"use client"

import { useEffect, useState } from "react"
import {
  BarChart3,
  Globe2,
  Layout,
  Users,
  Home,
  PieChart as PieChartIcon,
  HelpCircle,
} from "lucide-react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { scaleSequential } from "d3-scale"
import { interpolateBlues } from "d3-scale-chromatic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Area,
  AreaChart,
  Pie,
  PieChart as RePieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface Log {
  name: string
  email: string
  requester: string
  timestamp: string
  ip: string
  countryCode: string
  latitude: number
  longitude: number
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

function extractCoordinates(ipInfo: string): { latitude: number; longitude: number } {
  const latMatch = ipInfo.match(/Latitude: ([-\d.]+)/)
  const lonMatch = ipInfo.match(/Longitude: ([-\d.]+)/)
  return {
    latitude: latMatch ? parseFloat(latMatch[1]) : 0,
    longitude: lonMatch ? parseFloat(lonMatch[1]) : 0,
  }
}

export default function Component() {
  const [logs, setLogs] = useState<Log[]>([])
  const [countryCounts, setCountryCounts] = useState<{ [key: string]: number }>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("https://mauthn.mukham.in/all_logs", {
          method: "GET",
          headers: {
            logsauth: "authorized",
          },
        })
        if (response.ok) {
          const data = await response.json()
          const processedLogs = data.map((entry: Log) => {
            const requesterInfo = entry.requester || ""
            const countryCodeMatch = requesterInfo.match(/Country Code: (\w+)/)
            const countryCode = countryCodeMatch ? countryCodeMatch[1] : "Unknown"
            const { latitude, longitude } = extractCoordinates(requesterInfo)
            return {
              name: entry.name,
              email: entry.email,
              requester: requesterInfo,
              timestamp: entry.timestamp,
              ip: entry.ip || "",
              countryCode: countryCode,
              latitude,
              longitude,
            }
          })
          setLogs(processedLogs)

          const counts = processedLogs.reduce(
            (acc: { [key: string]: number }, log: Log) => {
              acc[log.countryCode] = (acc[log.countryCode] || 0) + 1
              return acc
            },
            {}
          )
          setCountryCounts(counts)
        } else {
          setError("Failed to fetch logs")
        }
      } catch {
        setError("Error fetching logs")
      }
    }

    fetchLogs()
  }, [])

  const loginCount = logs.length
  const uniqueUsers = new Set(logs.map((log) => log.email)).size
  const authMethodsCount = new Set(logs.map((log) => log.requester.split(" - ")[0])).size


  const areaData = logs
    .reduce((acc: { date: string; value: number }[], log) => {
      const date = new Date(log.timestamp).toLocaleDateString()
      const existingEntry = acc.find((entry) => entry.date === date)
      if (existingEntry) {
        existingEntry.value++
      } else {
        acc.push({ date, value: 1 })
      }
      return acc
    }, [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const maxCount = Math.max(...Object.values(countryCounts))
  const colorScale = scaleSequential(interpolateBlues)
      .domain([0, maxCount])

  const deviceData = [
    { name: "Desktop", value: 400, color: "#8884d8" },
    { name: "Mobile", value: 300, color: "#82ca9d" },
    { name: "Tablet", value: 300, color: "#ffc658" },
  ]

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <nav className="w-64 bg-gray-900 p-4">
        <div className="mb-8 flex items-center">
   
          <h1 className="text-xl font-semibold text-white">MAuthN</h1>
        </div>
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center rounded p-2 text-white hover:bg-gray-800"
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/users"
              className="flex items-center rounded p-2 text-gray-400 hover:bg-gray-800"
            >
              <Users className="mr-2 h-5 w-5" />
              Users
            </a>
          </li>
          <li>
            <a
              href="/analytics"
              className="flex items-center rounded p-2 text-gray-400 hover:bg-gray-800"
            >
              <PieChartIcon className="mr-2 h-5 w-5" />
              Analytics
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center rounded p-2 text-gray-400 hover:bg-gray-800"
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              Help
            </a>
          </li>
        </ul>
      </nav>
      <div className="flex-1">
        <header className="flex h-16 items-center border-b border-gray-800 px-6">
          <h1 className="text-xl font-semibold text-white">
            Analytics Dashboard
          </h1>
          <div className="ml-auto">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[180px] border-gray-800 bg-transparent text-white">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <main className="flex-1 space-y-6 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-[#4c1d95] text-white">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Login Count</CardTitle>
                <Users className="ml-auto h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loginCount}</div>
                <p className="text-xs text-white/60">Total logins recorded</p>
              </CardContent>
            </Card>
            <Card className="bg-[#ea580c] text-white">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                <Layout className="ml-auto h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueUsers}</div>
                <p className="text-xs text-white/60">Distinct users logged in</p>
              </CardContent>
            </Card>
            <Card className="bg-[#16a34a] text-white">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auth Methods</CardTitle>
                <BarChart3 className="ml-auto h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{authMethodsCount}</div>
                <p className="text-xs text-white/60">Different auth methods used</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0891b2] text-white">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Login</CardTitle>
                <Globe2 className="ml-auto h-4 w-4 opacity-75" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{logs[0]?.name || "N/A"}</div>
                <p className="text-xs text-white/60">{logs[0]?.timestamp || "No data"}</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-white">Login Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={areaData}>
                    <XAxis dataKey="date" stroke="#fff" opacity={0.5} />
                    <YAxis stroke="#fff" opacity={0.5} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      fill="url(#gradient)"
                      fillOpacity={0.2}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-white">Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-gray-900 rounded-lg shadow-lg p-4">
  <CardHeader className="mb-4">
    <CardTitle className="text-white text-xl font-semibold">Login Locations</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="h-[600px] w-full overflow-hidden rounded-md shadow-md bg-gray-800">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100, // Adjusted for better map zoom level
          center: [0, 20], // Centered on an appropriate global location
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.properties.ISO_A2;
              const fillColor = colorScale(countryCounts[countryCode] || 0);
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
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  </CardContent>
</Card>
          <Card className="bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">Recent Logins</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">IP Address</TableHead>
                    <TableHead className="text-white">Timestamp</TableHead>
                    <TableHead className="text-white">Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.slice(0, 5).map((log, index) => (
                    <TableRow key={index} className="border-gray-800">
                      <TableCell className="font-medium text-white">
                        {log.name}
                      </TableCell>
                      <TableCell className="text-gray-400">{log.email}</TableCell>
                      <TableCell className="text-gray-400">
                        {log.ip}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {log.countryCode}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}