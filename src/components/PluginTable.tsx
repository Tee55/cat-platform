import React, { useState, useMemo } from 'react';
import { Puzzle, Activity, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [assetFilter, setAssetFilter] = useState<string>('all');

  const getStatusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
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
      type: string;
      version: string;
      status: string;
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

  // Filtered plugins for dialog with search and filters
  const dialogFilteredPlugins = useMemo(() => {
    let plugins = getAllPlugins();

    // Apply asset filter
    if (assetFilter !== 'all') {
      plugins = plugins.filter(plugin => plugin.assetName === assetFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      plugins = plugins.filter(plugin => plugin.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      plugins = plugins.filter(plugin => plugin.type.toLowerCase() === typeFilter.toLowerCase());
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      plugins = plugins.filter(plugin => 
        plugin.name.toLowerCase().includes(search) ||
        plugin.id.toLowerCase().includes(search) ||
        plugin.assetName.toLowerCase().includes(search) ||
        plugin.type.toLowerCase().includes(search) ||
        plugin.status.toLowerCase().includes(search)
      );
    }

    return plugins;
  }, [searchTerm, statusFilter, typeFilter, assetFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setAssetFilter('all');
  };

  // Get unique values for filters
  const uniqueStatuses = [...new Set(allPlugins.map(p => p.status))];
  const uniqueTypes = [...new Set(allPlugins.map(p => p.type))];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Plugin Information</CardTitle>
          <div className="flex items-center gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Show All Plugins</Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>All Plugins</DialogTitle>
                </DialogHeader>

                {/* Search and Filters */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search plugins, IDs, assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          {uniqueStatuses.map((status) => (
                            <SelectItem key={status} value={status.toLowerCase()}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Type Filter */}
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {uniqueTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Asset Filter */}
                    <Select value={assetFilter} onValueChange={setAssetFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Assets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assets</SelectItem>
                        {assets.map((asset, index) => (
                          <SelectItem key={index} value={asset.name}>
                            {asset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Reset Filters */}
                    <Button variant="outline" onClick={resetFilters}>
                      Reset
                    </Button>
                  </div>

                  {/* Results count */}
                  <div className="text-sm text-muted-foreground">
                    Showing {dialogFilteredPlugins.length} plugins
                    {searchTerm && ` for "${searchTerm}"`}
                  </div>
                </div>

                {/* Dialog Content - Scrollable Table */}
                <div className="flex-1 overflow-auto border rounded-md">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead>Plugin Name</TableHead>
                        <TableHead>Plugin ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dialogFilteredPlugins.map((pluginItem, index) => (
                        <TableRow key={`${pluginItem.id}-${index}`}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Puzzle className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">
                                {pluginItem.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {pluginItem.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(pluginItem.type)}
                              <span>{pluginItem.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {pluginItem.assetName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {pluginItem.version}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(pluginItem.status)}>
                              {pluginItem.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {dialogFilteredPlugins.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No plugins found matching your criteria.
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Select value={selectedAssetName} onValueChange={setSelectedAssetName}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Assets</SelectItem>
                {assets.map((asset, index) => (
                  <SelectItem key={index} value={asset.name}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plugin Name</TableHead>
                <TableHead>Plugin ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlugins.slice(0, 8).map((pluginItem, index) => (
                <TableRow key={`${pluginItem.id}-${index}`}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Puzzle className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">
                        {pluginItem.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {pluginItem.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(pluginItem.type)}
                      <span>{pluginItem.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {pluginItem.assetName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(pluginItem.status)}>
                      {pluginItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPlugins.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No plugins found for the selected asset.
            </div>
          )}
          
          {filteredPlugins.length > 8 && (
            <div className="text-center py-4 text-sm text-muted-foreground border-t">
              Showing 8 of {filteredPlugins.length} plugins
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PluginTable;