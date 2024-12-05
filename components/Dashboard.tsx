'use client';

import React from 'react';
import { BarChart3, Globe2, Layout, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, Pie, PieChart as RePieChart, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { useLogs } from '@/hooks/useLogs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import WorldMap from '@/components/WorldMap';

interface AuthMethodData {
  name: string;
  value: number;
  color: string;
}

const Dashboard = () => {
  const { logs, loginCount, uniqueUsers, authMethodsCount, authMethodsData } = useLogs();

  const areaData = logs
    .reduce((acc: { date: string; value: number }[], log) => {
      const date = new Date(log.timestamp).toLocaleDateString();
      const existingEntry = acc.find((entry) => entry.date === date);
      if (existingEntry) {
        existingEntry.value++;
      } else {
        acc.push({ date, value: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
  title="Login Count"
  icon={<Users />}
  value={loginCount}
  description="Total logins recorded"
  bgColor="bg-purple-600"
/>
<DashboardCard
  title="Unique Users"
  icon={<Layout />}
  value={uniqueUsers}
  description="Distinct users logged in"
  bgColor="bg-blue-600"
/>
<DashboardCard
  title="Auth Methods"
  icon={<BarChart3 />}
  value={authMethodsCount}
  description="Different auth methods used"
  bgColor="bg-green-600"
/>
<DashboardCard
  title="Latest Login"
  icon={<Globe2 />}
  value={logs[0]?.name || 'N/A'}
  description={logs[0]?.timestamp || 'No data'}
  bgColor="bg-orange-600"
/>

      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard title="Login Activity">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={areaData}>
              <XAxis dataKey="date" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="url(#colorLogin)" />
              <defs>
                <linearGradient id="colorLogin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Auth Methods Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={authMethodsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {authMethodsData.map((entry: AuthMethodData, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <WorldMap />

      <Card>
        <CardHeader>
          <CardTitle>Recent Logins</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice(0, 5).map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{log.name}</TableCell>
                  <TableCell>{log.email}</TableCell>
                  <TableCell>{log.requester}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{log.countryCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  description: string;
}

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  description: string;
  bgColor?: string; // Add bgColor prop
}

const DashboardCard = ({ title, icon, value, description, bgColor }: DashboardCardProps) => (
  <Card className={`${bgColor} text-white`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-white">{description}</p>
    </CardContent>
  </Card>
);
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export default Dashboard;

