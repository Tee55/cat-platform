import React, { useState, useMemo } from 'react';
import { AlertTriangle, Shield, Info, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AssetType, ScanVulnerabilityResponseType, SeverityLevel } from '@/shared/types';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [assetFilter, setAssetFilter] = useState<string>('all');

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

  const getSeverityVariant = (severity: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Flatten all alerts from all assets for display
  const getAllAlerts = () => {
    const allAlerts: Array<{
      assetName: string;
      severity: string;
      alertData: ScanVulnerabilityResponseType;
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

  // Filtered alerts for dialog with search and filters
  const dialogFilteredAlerts = useMemo(() => {
    let alerts = getAllAlerts();

    // Apply asset filter
    if (assetFilter !== 'all') {
      alerts = alerts.filter(alert => alert.assetName === assetFilter);
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      alerts = alerts.filter(alert => alert.severity.toLowerCase() === severityFilter.toLowerCase());
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      alerts = alerts.filter(alert => 
        alert.assetName.toLowerCase().includes(search) ||
        (alert.alertData.synopsis && alert.alertData.synopsis.toLowerCase().includes(search)) ||
        (alert.alertData.description && alert.alertData.description.toLowerCase().includes(search)) ||
        (alert.alertData.pluginName && alert.alertData.pluginName.toLowerCase().includes(search)) ||
        alert.severity.toLowerCase().includes(search)
      );
    }

    return alerts;
  }, [searchTerm, severityFilter, assetFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setSeverityFilter('all');
    setAssetFilter('all');
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Active Security Alerts</CardTitle>
          <div className="flex items-center gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Show All Alerts</Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>All Security Alerts</DialogTitle>
                </DialogHeader>

                {/* Search and Filters */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search alerts, assets, descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Severity Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <Select value={severityFilter} onValueChange={setSeverityFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All Severities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

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
                    Showing {dialogFilteredAlerts.length} alerts
                    {searchTerm && ` for "${searchTerm}"`}
                  </div>
                </div>

                {/* Dialog Content - Scrollable Table */}
                <div className="flex-1 overflow-auto border rounded-md">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background">
                      <TableRow>
                        <TableHead>Severity</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Plugin</TableHead>
                        <TableHead>Port/Service</TableHead>
                        <TableHead>CVSS Score</TableHead>
                        <TableHead>Last Seen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dialogFilteredAlerts.map((alert, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getSeverityIcon(alert.severity)}
                              <Badge variant={getSeverityVariant(alert.severity)}>
                                {alert.severity}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {alert.assetName}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={alert.alertData.synopsis || alert.alertData.description}>
                              {alert.alertData.synopsis || alert.alertData.description || 'No description available'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {alert.alertData.pluginName && (
                              <Badge variant="outline" className="text-xs">
                                {alert.alertData.pluginName}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {alert.alertData.port && alert.alertData.service ? (
                              <span>{alert.alertData.port}/{alert.alertData.service}</span>
                            ) : alert.alertData.port ? (
                              <span>Port {alert.alertData.port}</span>
                            ) : alert.alertData.service ? (
                              <span>{alert.alertData.service}</span>
                            ) : (
                              <span>-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {alert.alertData.cvss3Score || alert.alertData.cvssScore ? (
                              <span className="font-medium">
                                {alert.alertData.cvss3Score || alert.alertData.cvssScore}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {alert.alertData.lastSeen ? 
                              new Date(alert.alertData.lastSeen).toLocaleDateString() : 
                              alert.alertData.createdAt ? 
                              new Date(alert.alertData.createdAt).toLocaleDateString() : 
                              '-'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {dialogFilteredAlerts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No alerts found matching your criteria.
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
                <TableHead>Severity</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Plugin</TableHead>
                <TableHead>Port/Service</TableHead>
                <TableHead>CVSS Score</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.slice(0, 10).map((alert, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(alert.severity)}
                      <Badge variant={getSeverityVariant(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {alert.assetName}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={alert.alertData.synopsis || alert.alertData.description}>
                      {alert.alertData.synopsis || alert.alertData.description || 'No description available'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {alert.alertData.pluginName && (
                      <Badge variant="outline" className="text-xs">
                        {alert.alertData.pluginName}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {alert.alertData.port && alert.alertData.service ? (
                      <span>{alert.alertData.port}/{alert.alertData.service}</span>
                    ) : alert.alertData.port ? (
                      <span>Port {alert.alertData.port}</span>
                    ) : alert.alertData.service ? (
                      <span>{alert.alertData.service}</span>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {alert.alertData.cvss3Score || alert.alertData.cvssScore ? (
                      <span className="font-medium">
                        {alert.alertData.cvss3Score || alert.alertData.cvssScore}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {alert.alertData.lastSeen ? 
                      new Date(alert.alertData.lastSeen).toLocaleDateString() : 
                      alert.alertData.createdAt ? 
                      new Date(alert.alertData.createdAt).toLocaleDateString() : 
                      '-'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No alerts found for the selected asset.
            </div>
          )}
          
          {filteredAlerts.length > 10 && (
            <div className="text-center py-4 text-sm text-muted-foreground border-t">
              Showing 10 of {filteredAlerts.length} alerts
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveSecurityAlerts;