import React from 'react';
import { Server, Globe, Shield, Database } from 'lucide-react';
import type { AssetType, ServiceType } from '@/shared/types';

interface ServicesTableProps {
  assets: AssetType[];
  serviceNames: ServiceType[];
  selectedAssetName: string;
  setSelectedAssetName: (asset: string) => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  assets,
  serviceNames,
  selectedAssetName,
  setSelectedAssetName
}) => {
  const getServiceIcon = (serviceName: string) => {
    const service = serviceName?.toLowerCase();
    if (service?.includes('http') || service?.includes('web')) {
      return <Globe className="w-4 h-4 text-blue-600" />;
    } else if (service?.includes('ssh') || service?.includes('secure')) {
      return <Shield className="w-4 h-4 text-green-600" />;
    } else if (service?.includes('database') || service?.includes('sql')) {
      return <Database className="w-4 h-4 text-purple-600" />;
    }
    return <Server className="w-4 h-4 text-gray-600" />;
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case 'running':
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'stopped':
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredServices = selectedAssetName === 'All' 
    ? serviceNames 
    : serviceNames.filter(service => service.name === selectedAssetName);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Services Information</h2>
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
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Protocol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredServices.slice(0, 8).map((service, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getServiceIcon(service.name)}
                    <span className="text-sm font-medium text-gray-900">
                      {service.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {service.protocol || 'TCP'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge('running')}>
                    Running
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No services found for the selected asset.
          </div>
        )}
        
        {filteredServices.length > 8 && (
          <div className="text-center py-4 text-sm text-gray-500">
            Showing 8 of {filteredServices.length} services
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesTable;