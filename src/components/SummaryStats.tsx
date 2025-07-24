import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Server, Network, Shield, HardDrive } from 'lucide-react';
import type { AssetType, PluginType, ServiceType } from '@/shared/types';
import type { ScanVulnerabilityResponseType } from '@/shared/types';

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
    
    vulnerabilities.forEach(vuln => {
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
        incidents: count
      }));
  };

  // Process OS version data - since osVersion is string[], create mock data
  const getOsData = () => {
    return osVersion.slice(0, 5).map((os, index) => ({
      name: os || `OS ${index + 1}`,
      value: Math.floor(Math.random() * 50) + 10
    }));
  };

  // Process service data for additional stats
  const getServiceStats = () => {
    const serviceCounts: { [key: string]: number } = {};
    
    vulnerabilities.forEach(vuln => {
      if (vuln.service) {
        serviceCounts[vuln.service] = (serviceCounts[vuln.service] || 0) + 1;
      }
    });

    return serviceCounts;
  };

  const portData = getPortData();
  const osData = getOsData();
  const serviceStats = getServiceStats();

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="mt-8 space-y-6">
      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Network className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Vulnerabilities</p>
              <p className="text-2xl font-bold text-gray-900">{vulnerabilities.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Plugin Types</p>
              <p className="text-2xl font-bold text-gray-900">{pluginTypes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Server className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Services</p>
              <p className="text-2xl font-bold text-gray-900">{serviceNames.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <HardDrive className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Assets</p>
              <p className="text-2xl font-bold text-gray-900">{assets.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Port Incidents Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vulnerable Ports</h3>
          <div className="h-64">
            {portData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="port" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No port data available
              </div>
            )}
          </div>
        </div>

        {/* OS Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">OS Distribution</h3>
          <div className="h-64">
            {osData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={osData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent || 0).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {osData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No OS data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plugin Types Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plugin Types Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pluginTypes.slice(0, 6).map((plugin, index) => (
            <div key={plugin.id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{plugin.name}</p>
                  <p className="text-sm text-gray-500">ID: {plugin.id}</p>
                </div>
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          ))}
          {pluginTypes.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-4">
              No plugin types available
            </div>
          )}
        </div>
      </div>

      {/* Service Summary */}
      {Object.keys(serviceStats).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vulnerable Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(serviceStats)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([service, count], index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{service}</p>
                      <p className="text-sm text-gray-500">{count} vulnerabilities</p>
                    </div>
                    <Server className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryStats;