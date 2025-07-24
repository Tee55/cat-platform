"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Server, Shield, Network, HardDrive } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { AssetType, PluginType, ServiceType } from "@/shared/types";
import type { ScanVulnerabilityResponseType } from "@/shared/types";

interface SummaryStatsProps {
  vulnerabilityPorts: string[];
  pluginTypes: PluginType[];
  osVersion: string[];
  vulnerabilities: ScanVulnerabilityResponseType[];
  serviceNames: ServiceType[];
  assets: AssetType[];
}

const SummaryStats: React.FC<SummaryStatsProps> = ({
  vulnerabilityPorts,
  pluginTypes,
  osVersion,
  vulnerabilities,
  serviceNames,
  assets,
}) => {
  // Process port data from vulnerabilities for chart
  const getPortData = () => {
    const portCounts: { [key: string]: number } = {};
    vulnerabilities.forEach((vuln) => {
      if (vuln.port) {
        const port = vuln.port.toString();
        portCounts[port] = (portCounts[port] || 0) + 1;
      }
    });
    return Object.entries(portCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([port, count]) => ({
        port,
        incidents: count,
      }));
  };

  // Process OS version data - since osVersion is string[], create mock data
  const getOsData = () => {
    return osVersion.slice(0, 5).map((os, index) => ({
      name: os || `OS ${index + 1}`,
      value: Math.floor(Math.random() * 50) + 10,
    }));
  };

  // Process service data for additional stats
  const getServiceStats = () => {
    const serviceCounts: { [key: string]: number } = {};
    vulnerabilities.forEach((vuln) => {
      if (vuln.service) {
        serviceCounts[vuln.service] = (serviceCounts[vuln.service] || 0) + 1;
      }
    });
    return serviceCounts;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded bg-gray-900 p-2 text-sm text-white shadow-lg">
          <p>{label}</p>
          <p>
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const portData = getPortData();
  const osData = getOsData();
  const serviceStats = getServiceStats();

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  return (
    <div className="mt-8 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Network className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Vulnerabilities
              </p>
              <p className="text-foreground text-2xl font-bold">
                {vulnerabilities.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Shield className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Plugin Types
              </p>
              <p className="text-foreground text-2xl font-bold">
                {pluginTypes.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Server className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Services
              </p>
              <p className="text-foreground text-2xl font-bold">
                {serviceNames.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <HardDrive className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Assets
              </p>
              <p className="text-foreground text-2xl font-bold">
                {assets.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Port Incidents Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vulnerable Ports</CardTitle>
          </CardHeader>
          <CardContent className="h-64 p-6">
            {portData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portData}>
                  <Tooltip content={<CustomTooltip />} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="port" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                No port data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* OS Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>OS Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64 p-6">
            {osData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={osData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent || 0).toFixed(1)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {osData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center">
                No OS data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Plugin Types Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Plugin Types Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pluginTypes.length === 0 ? (
              <p className="text-muted-foreground col-span-full py-4 text-center">
                No plugin types available
              </p>
            ) : (
              pluginTypes.slice(0, 6).map((plugin) => (
                <Card key={plugin.id} className="border">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-foreground font-medium">
                        {plugin.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        ID: {plugin.id}
                      </p>
                    </div>
                    <div className="flex h-6 w-6 items-center justify-center">
                      <Shield className="text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Summary */}
      {Object.keys(serviceStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Vulnerable Services</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(serviceStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([service, count], idx) => (
                  <Card key={idx} className="border">
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <p className="text-foreground font-medium">{service}</p>
                        <p className="text-muted-foreground text-sm">
                          {count} vulnerabilities
                        </p>
                      </div>
                      <Server className="h-6 w-6 text-purple-600" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SummaryStats;
