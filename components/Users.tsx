'use client'

import { ArrowLeft, UsersIcon, Layout, BarChart3, Globe2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts'
import WorldMap from '@/components/Map'
import { Input } from "@/components/ui/input"
import { User, useLogs } from "@/hooks/useLogs"

interface UserDashboardProps {
  user: User
  onBack: () => void
}

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
    <Card className="bg-white dark:bg-gray-800 p-8">
      <CardHeader>
        <CardTitle className="text-gray-800 dark:text-white">User Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 p-4">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white p-2"
          />
          <Button variant="secondary" className="px-4 py-2">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <Table className="mt-4 p-4">
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="text-gray-800 dark:text-white p-4">Name</TableHead>
              <TableHead className="text-gray-800 dark:text-white p-4">Email</TableHead>
              <TableHead className="text-gray-800 dark:text-white p-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.email} className="border-gray-200 dark:border-gray-700">
                <TableCell className="font-medium text-gray-800 dark:text-white p-4">{user.name}</TableCell>
                <TableCell className="text-gray-600 dark:text-gray-300 p-4">{user.email}</TableCell>
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

function UserDashboard({ user, onBack }: UserDashboardProps) {
  const [updatedUser, setUpdatedUser] = useState(user)

  useEffect(() => {
    const updateCountryCodes = async () => {
      const updatedLogs = await Promise.all(
        user.logs.map(async (log) => {
          if (log.countryCode === 'Unknown') {
            try {
              const response = await fetch(`https://ipapi.co/${log.ip}/json/`)
              const data = await response.json()
              return { ...log, countryCode: data.country_code }
            } catch (error) {
              console.error('Error fetching country from IP:', error)
              return log
            }
          }
          return log
        })
      )
      setUpdatedUser({ ...user, logs: updatedLogs })
    }

    updateCountryCodes()
  }, [user])

  const loginCount = updatedUser.logs.length
  const lastLogin = updatedUser.logs[0]?.timestamp || "N/A"
  const uniqueIPs = new Set(updatedUser.logs.map((log) => log.ip)).size
  const uniqueCountries = new Set(updatedUser.logs.map((log) => log.countryCode)).size

  const areaData = updatedUser.logs
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
        <Card className="bg-purple-600 text-white p-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Count</CardTitle>
            <UsersIcon className="ml-auto h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loginCount}</div>
            <p className="text-xs text-white/60">Total logins recorded</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-600 text-white p-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
            <Layout className="ml-auto h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(lastLogin).toLocaleString()}</div>
            <p className="text-xs text-white/60">Most recent login timestamp</p>
          </CardContent>
        </Card>
        <Card className="bg-green-600 text-white p-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
            <BarChart3 className="ml-auto h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueIPs}</div>
            <p className="text-xs text-white/60">Different IP addresses used</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-600 text-white p-4">
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
      <Card className="mt-6 bg-white dark:bg-gray-800 p-6">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">Login Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaData}>
              <XAxis dataKey="date" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fill="url(#colorUv)"
                fillOpacity={0.3}
              />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="mt-6 bg-white dark:bg-gray-800 p-6">
        <CardHeader>
          <CardTitle className="text-gray-800 dark:text-white">Recent Logins</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-gray-700">
                <TableHead className="text-gray-800 dark:text-white p-4">IP Address</TableHead>
                <TableHead className="text-gray-800 dark:text-white p-4">Timestamp</TableHead>
                <TableHead className="text-gray-800 dark:text-white p-4">Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updatedUser.logs.slice(0, 5).map((log, index) => (
                <TableRow key={index} className="border-gray-200 dark:border-gray-700">
                  <TableCell className="text-gray-600 dark:text-gray-300 p-4">{log.ip}</TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 p-4">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 p-4">{log.countryCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <WorldMap selectedUser={updatedUser} />
    </>
  )
}

