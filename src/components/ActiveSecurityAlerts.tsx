import React from 'react';
import { AlertTriangle, Shield, Info } from 'lucide-react';
import type { AssetType } from '@/shared/types';

interface ActiveSecurityAlertsProps {
  assets: AssetType[];
  selectedAssetName: string;
  setSelectedAssetName: (asset: string) => void;
}

const ActiveSecurityAlerts: React.FC<ActiveSecurityAlertsProps> = ({
  assets,
  selectedAssetName,
  setSelectedAssetName
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <Shield className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (severity.toLowerCase()) {
      case 'critical':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'high':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  };

  // Flatten all alerts from all assets for display
  const getAllAlerts = () => {
    const allAlerts: Array<{
      assetName: string;
      severity: string;
      alertData: any;
    }> = [];

    assets.forEach(asset => {
      asset.alerts.forEach(alert => {
        alert.data.forEach(alertItem => {
          allAlerts.push({
            assetName: asset.name,
            severity: alert.severity,
            alertData: alertItem
          });
        });
      });
    });

    return allAlerts;
  };

  const filteredAlerts = selectedAssetName === 'All' 
    ? getAllAlerts()
    : getAllAlerts().filter(alert => alert.assetName === selectedAssetName);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Active Security Alerts</h2>
        <select
          value={selectedAssetName}
          onChange={(e) => setSelectedAssetName(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Assets</option>
          {assets.map((asset, index) => (
            <option key={index} value={asset.name}>
              {asset.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plugin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Port/Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CVSS Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Seen
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlerts.slice(0, 10).map((alert, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(alert.severity)}
                    <span className={getSeverityBadge(alert.severity)}>
                      {alert.severity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {alert.assetName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={alert.alertData.synopsis || alert.alertData.description}>
                    {alert.alertData.synopsis || alert.alertData.description || 'No description available'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.alertData.pluginName && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {alert.alertData.pluginName}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.alertData.port && alert.alertData.service ? (
                    <span>{alert.alertData.port}/{alert.alertData.service}</span>
                  ) : alert.alertData.port ? (
                    <span>Port {alert.alertData.port}</span>
                  ) : alert.alertData.service ? (
                    <span>{alert.alertData.service}</span>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.alertData.cvss3Score || alert.alertData.cvssScore ? (
                    <span className="font-medium">
                      {alert.alertData.cvss3Score || alert.alertData.cvssScore}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {alert.alertData.lastSeen ? 
                    new Date(alert.alertData.lastSeen).toLocaleDateString() : 
                    alert.alertData.createdAt ? 
                    new Date(alert.alertData.createdAt).toLocaleDateString() : 
                    '-'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No alerts found for the selected asset.
          </div>
        )}
        
        {filteredAlerts.length > 10 && (
          <div className="text-center py-4 text-sm text-gray-500">
            Showing 10 of {filteredAlerts.length} alerts
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveSecurityAlerts;