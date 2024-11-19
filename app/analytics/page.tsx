'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useLogs } from '@/components/useLogs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Analytics() {
  const { logs, authMethodsData } = useLogs();

  // Aggregate daily login data
  const dailyLoginData = logs.reduce((acc: { [key: string]: number }, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.entries(dailyLoginData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

  // Aggregate country data
  const countryData = logs.reduce((acc: { [key: string]: number }, log) => {
    acc[log.countryCode] = (acc[log.countryCode] || 0) + 1;
    return acc;
  }, {});

  const topCountries = Object.entries(countryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({ country, count }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>

      {/* Daily Logins Bar Chart */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gray-900/60 p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white text-xl">Daily Logins (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="date" stroke="#fff" opacity={0.7} />
                <YAxis stroke="#fff" opacity={0.7} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#8884d8" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Authentication Methods Pie Chart */}
        <Card className="bg-gray-900/60 p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white text-xl">Services</CardTitle>
          </CardHeader>
          <CardContent>
          <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={authMethodsData}
      cx="50%"
      cy="50%"
      innerRadius={60}
      outerRadius={100}
      fill="#8884d8"
      dataKey="value"
    >
      {authMethodsData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip
      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
      labelStyle={{ color: '#fff' }}
    />
  </PieChart>
</ResponsiveContainer>

          </CardContent>
        </Card>
      </div>

      {/* Top 5 Countries Table */}
      <Card className="bg-gray-900/60 p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-xl">Top 5 Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-white">Country</TableHead>
                <TableHead className="text-white">Login Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCountries.map((country, index) => (
                <TableRow key={index} className="border-b border-gray-700">
                  <TableCell className="font-medium text-white">{country.country}</TableCell>
                  <TableCell className="text-gray-400">{country.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
