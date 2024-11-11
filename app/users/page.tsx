'use client'

import { useState } from "react"
import { Search, ArrowLeft, Users as UsersIcon, Layout, BarChart3, Globe2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, useLogs } from "@/components/useLogs"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts'

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { users } = useLogs()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  const handleBack = () => {
    setSelectedUser(null)
  }

  if (selectedUser) {
    return <UserDashboard user={selectedUser} onBack={handleBack} />
  }

  return (
    <Card className="bg-gray-900 p-8  ">
      <CardHeader>
        <CardTitle className="text-white">User Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 p-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-white p-2"
          />
          <Button variant="secondary" className="px-4 py-2">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <Table className="mt-4 p-4">
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-white p-4">Name</TableHead>
              <TableHead className="text-white p-4">Email</TableHead>
              <TableHead className="text-white p-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.email} className="border-gray-800">
                <TableCell className="font-medium text-white p-4">{user.name}</TableCell>
                <TableCell className="text-gray-400 p-4">{user.email}</TableCell>
                <TableCell className="p-4">
                  <Button variant="outline" size="sm" onClick={() => handleUserSelect(user)} className="px-3 py-1">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function UserDashboard({ user, onBack }: { user: User; onBack: () => void }) {
  const loginCount = user.logs.length
  const lastLogin = user.logs[0]?.timestamp || "N/A"
  const uniqueIPs = new Set(user.logs.map((log) => log.ip)).size
  const uniqueCountries = new Set(user.logs.map((log) => log.countryCode)).size

  const areaData = user.logs
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

  return (
    <>
      <Button variant="outline" onClick={onBack} className="mb-4 px-4 py-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to User Search
      </Button>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 p-4">
        <Card className="bg-[#4c1d95] text-white p-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Count</CardTitle>
            <UsersIcon className="ml-auto h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loginCount}</div>
            <p className="text-xs text-white/60">Total logins recorded</p>
          </CardContent>
        </Card>
        <Card className="bg-[#ea580c] text-white p-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
            <Layout className="ml-auto h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(lastLogin).toLocaleString()}</div>
            <p className="text-xs text-white/60">Most recent login timestamp</p>
          </CardContent>
        </Card>
        <Card className="bg-[#16a34a] text-white p-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
            <BarChart3 className="ml-auto h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueIPs}</div>
            <p className="text-xs text-white/60">Different IP addresses used</p>
          </CardContent>
        </Card>
        <Card className="bg-[#0891b2] text-white p-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe2 className="ml-auto h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCountries}</div>
            <p className="text-xs text-white/60">Different countries logged in from</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6 bg-gray-900/50 p-6">
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
      <Card className="mt-6 bg-gray-900 p-6">
        <CardHeader>
          <CardTitle className="text-white">Recent Logins</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-white p-4">IP Address</TableHead>
                <TableHead className="text-white p-4">Timestamp</TableHead>
                <TableHead className="text-white p-4">Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.logs.slice(0, 5).map((log, index) => (
                <TableRow key={index} className="border-gray-800">
                  <TableCell className="text-gray-400 p-4">{log.ip}</TableCell>
                  <TableCell className="text-gray-400 p-4">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-400 p-4">{log.countryCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
