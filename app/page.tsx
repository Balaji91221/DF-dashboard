'use client';

import React from 'react'
import { BarChart3, Globe2, Layout, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, Pie, PieChart as RePieChart, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { useLogs } from '@/components/useLogs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'


import Map from '@/components/Map'



const Dashboard = () => {
  const { logs, loginCount, uniqueUsers, authMethodsCount, authMethodsData } = useLogs()



 
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

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Login Count" icon={<Users />} value={loginCount} description="Total logins recorded" color="#4c1d95" />
        <DashboardCard title="Unique Users" icon={<Layout />} value={uniqueUsers} description="Distinct users logged in" color="#ea580c" />
        <DashboardCard title="Auth Methods" icon={<BarChart3 />} value={authMethodsCount} description="Different auth methods used" color="#16a34a" />
        <DashboardCard title="Latest Login" icon={<Globe2 />} value={logs[0]?.name || 'N/A'} description={logs[0]?.timestamp || 'No data'} color="#0891b2" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title="Login Activity">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaData}>
              <XAxis dataKey="date" stroke="#fff" opacity={0.5} />
              <YAxis stroke="#fff" opacity={0.5} />
              <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#gradient)" fillOpacity={0.2} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Auth Methods Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie data={authMethodsData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" paddingAngle={5} dataKey="value">
                {authMethodsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </RePieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <Map/>
      <Card className="bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-white">Recent Logins</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Requester</TableHead>
                <TableHead className="text-white">Timestamp</TableHead>
                <TableHead className="text-white">IP</TableHead>
                
                <TableHead className="text-white">Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice(0, 5).map((log, index) => (
                <TableRow key={index} className="border-gray-800">
                  <TableCell className="font-medium text-white">{log.name}</TableCell>
                  <TableCell className="text-gray-400">{log.email}</TableCell>
                  <TableCell className="text-gray-400">{log.requester}</TableCell>
                  <TableCell className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="text-gray-400">{log.ip}</TableCell>
                  <TableCell className="text-gray-400">{log.requester.split(' - ').slice(1)[0]}</TableCell>
                  <TableCell className="text-gray-400">{log.countryCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  icon: React.ReactNode
  value: string | number
  description: string
  color: string
}

const DashboardCard = ({ title, icon, value, description, color }: DashboardCardProps) => (
  <Card style={{ backgroundColor: color }} className="text-white">
    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="ml-auto h-4 w-4 opacity-75" aria-hidden="true">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-white/60">{description}</p>
    </CardContent>
  </Card>
)

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card className="bg-gray-900/50 p-4 rounded-lg shadow-lg">
    <CardHeader className="mb-4">
      <CardTitle className="text-white text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

export default Dashboard