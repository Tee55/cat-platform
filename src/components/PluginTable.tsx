import React from 'react';
import { Puzzle, Activity } from 'lucide-react';
import type { AssetType, PluginType } from '@/shared/types';

interface PluginTableProps {
  assets: AssetType[];
  plugins: PluginType[];
  selectedAssetName: string;
  setSelectedAssetName: (asset: string) => void;
}

const PluginTable: React.FC<PluginTableProps> = ({
  assets,
  plugins,
  selectedAssetName,
  setSelectedAssetName
}) => {
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'security':
        return <Activity className="w-4 h-4 text-blue-600" />;
      default:
        return <Puzzle className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get all plugins from assets based on your schema
  const getAllPlugins = () => {
    const allPlugins: Array<{
      id: string;
      name: string;
      assetName: string;
      type?: string;
      version?: string;
      status?: string;
    }> = [];

    assets.forEach(asset => {
      asset.plugins.forEach(plugin => {
        allPlugins.push({
          id: plugin.id,
          name: plugin.name,
          assetName: asset.name,
          type: 'Security', // Based on your schema, these are likely security plugins
          version: 'N/A', // Not in your current schema
          status: 'Active' // Default status
        });
      });
    });

    return allPlugins;
  };

  const allPlugins = getAllPlugins();
  
  const filteredPlugins = selectedAssetName === 'All' 
    ? allPlugins 
    : allPlugins.filter(plugin => plugin.assetName === selectedAssetName);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Plugin Information</h2>
        <select
          value={selectedAssetName}
          onChange={(e) => {
            const assetName = e.target.value;
            const asset = assets.find(a => a.name === assetName) || { name: 'All' } as AssetType;
            setSelectedAssetName(asset.name);
          }}
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
                Plugin Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plugin ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plugin ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlugins.slice(0, 8).map((pluginItem, index) => (
              <tr key={`${pluginItem.id}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Puzzle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {pluginItem.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {pluginItem.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(pluginItem.type || 'general')}
                    <span className="text-sm text-gray-900">
                      {pluginItem.type || 'General'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pluginItem.assetName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={getStatusBadge(pluginItem.status || 'active')}>
                    {pluginItem.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredPlugins.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No plugins found for the selected asset.
          </div>
        )}
        
        {filteredPlugins.length > 8 && (
          <div className="text-center py-4 text-sm text-gray-500">
            Showing 8 of {filteredPlugins.length} plugins
          </div>
        )}
      </div>
    </div>
  );
};

export default PluginTable;