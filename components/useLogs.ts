'use client';

import { useEffect, useState } from 'react';

export interface Log {
  name: string;
  email: string;
  requester: string;
  timestamp: string;
  ip: string;
  countryCode: string;
  latitude: number;
  longitude: number;
}

export interface User {
  name: string;
  email: string;
  logs: Log[];
}

export const useLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [countryCounts, setCountryCounts] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("https://mauthn.mukham.in/all_logs", {
          method: "GET",
          headers: {
            logsauth: "authorized",
          },
        });
        
        if (response.ok) {
          const data = await response.json();

          // Process logs
          const processedLogs = data.map((entry: Log) => {
            const requesterInfo = entry.requester || "";
            const countryCodeMatch = requesterInfo.match(/Country Code: (\w+)/);
            const countryCode = countryCodeMatch ? countryCodeMatch[1] : "Unknown";
            const { latitude, longitude } = extractCoordinates(requesterInfo);
            
            return {
              name: entry.name,
              email: entry.email,
              requester: requesterInfo,
              timestamp: entry.timestamp,
              ip: entry.ip || "",
              countryCode: countryCode,
              latitude,
              longitude,
            };
          });

          // Set logs data
          setLogs(processedLogs);

          // Country counts
          const counts = processedLogs.reduce(
            (acc: { [key: string]: number }, log: Log) => {
              acc[log.countryCode] = (acc[log.countryCode] || 0) + 1;
              return acc;
            },
            {}
          );
          setCountryCounts(counts);

          // Group by user
          const userMap = processedLogs.reduce((acc: { [key: string]: User }, log: Log) => {
            if (!acc[log.email]) {
              acc[log.email] = { name: log.name, email: log.email, logs: [] };
            }
            acc[log.email].logs.push(log);
            return acc;
          }, {});
          setUsers(Object.values(userMap));
        } else {
          setError("Failed to fetch logs");
        }
      } catch {
        setError("Error fetching logs");
      }
    };

    fetchLogs();
  }, []);

  // Calculate statistics
  const loginCount = logs.length;
  const uniqueUsers = new Set(logs.map((log) => log.email)).size;
  const authMethodsCount = new Set(logs.map((log) => log.requester.split(" - ")[0])).size;

  const authMethodsData = Array.from(
    logs.reduce((acc, log) => {
      const authMethod = log.requester.split(" - ")[0];
      acc.set(authMethod, (acc.get(authMethod) || 0) + 1);
      return acc;
    }, new Map())
  ).map(([name, value], index) => ({
    name,
    value,
    color: `hsl(${index * 137.5 % 360}, 70%, 50%)`,
  }));

  return {
    logs,
    users,
    countryCounts,
    error,
    loginCount,
    uniqueUsers,
    authMethodsCount,
    authMethodsData,
  };
};

function extractCoordinates(requesterInfo: string): { latitude: number; longitude: number } {
  const latMatch = requesterInfo.match(/Latitude: ([\d.-]+)/);
  const lonMatch = requesterInfo.match(/Longitude: ([\d.-]+)/);
  const latitude = latMatch ? parseFloat(latMatch[1]) : 0;
  const longitude = lonMatch ? parseFloat(lonMatch[1]) : 0;
  return { latitude, longitude };
}
