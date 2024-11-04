"use client"

import { useEffect, useState } from "react"
import { BarChart3, Globe2, Layout, Users, Home, HelpCircle } from "lucide-react"
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer } from "recharts"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Log {
  name: string
  email: string
  requester: string
  timestamp: string
  ip: string
  authMethods: string
}

export default function Dashboard() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('https://mauthn.mukham.in/all_logs', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cookie': 'Authorization=authorized',
            'Content-Type': 'application/json',
          },
        });
        

        if (response.ok) {
          const data = await response.json();
          setLogs(data.map((entry: Log) => ({
            name: entry.name,
            email: entry.email,
            requester: entry.requester,
            timestamp: entry.timestamp,
            ip: entry.ip,
            authMethods: entry.authMethods,
          })));
        } else {
          setError('Failed to fetch logs');
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError('An error occurred while fetching logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const loginCount = logs.length
  const uniqueUsers = new Set(logs.map(log => log.email)).size
  const authMethodsCount = new Set(logs.map(log => log.authMethods)).size

  const deviceData = [
    { name: "Desktop", value: 45, color: "#8b5cf6" },
    { name: "Tablet", value: 15, color: "#f97316" },
    { name: "Mobile", value: 40, color: "#06b6d4" },
  ]

  const areaData = logs.reduce((acc: { date: string; value: number }[], log) => {
    const date = new Date(log.timestamp).toLocaleDateString()
    const existingEntry = acc.find(entry => entry.date === date)
    if (existingEntry) {
      existingEntry.value++
    } else {
      acc.push({ date, value: 1 })
    }
    return acc
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <nav className="w-64 bg-gray-900 p-4">
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-semibold text-white">MAuthN</h1>
        </div>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center text-white hover:bg-gray-800 rounded p-2">
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-gray-400 hover:bg-gray-800 rounded p-2">
              <Users className="h-5 w-5 mr-2" />
              Users
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center text-gray-400 hover:bg-gray-800 rounded p-2">
              <HelpCircle className="h-5 w-5 mr-2" />
              Help
            </a>
          </li>
        </ul>
      </nav>
      <div className="flex-1">
        <header className="flex h-16 items-center border-b border-gray-800 px-6">
          <h1 className="text-xl font-semibold text-white">Analytics Dashboard</h1>
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
            {/* Statistics Cards */}
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
          {/* Chart and Device Breakdown */}
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
          {/* Recent Logins Table */}
          <Card className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white">Recent Logins</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Requester</TableHead>
                    <TableHead className="text-white">Timestamp</TableHead>
                    <TableHead className="text-white">IP</TableHead>
                    <TableHead className="text-white">Auth Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.slice(0, 5).map((log, index) => (
                    <TableRow key={index} className="border-gray-800">
                      <TableCell className="font-medium text-white">{log.name}</TableCell>
                      <TableCell className="text-gray-400">{log.email}</TableCell>
                      <TableCell className="text-gray-400">{log.requester}</TableCell>
                      <TableCell className="text-gray-400">{log.timestamp}</TableCell>
                      <TableCell className="text-gray-400">{log.ip}</TableCell>
                      <TableCell className="text-gray-400">{log.authMethods}</TableCell>
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
