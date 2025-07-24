import React, { useMemo, useState } from 'react';
import { Search, Filter, Server, Globe, Shield, Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assetFilter, setAssetFilter] = useState('all');

  const getServiceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('http') || n.includes('web')) return <Globe className="w-4 h-4 text-blue-600" />;
    if (n.includes('ssh') || n.includes('secure')) return <Shield className="w-4 h-4 text-green-600" />;
    if (n.includes('sql') || n.includes('database')) return <Database className="w-4 h-4 text-purple-600" />;
    return <Server className="w-4 h-4 text-gray-600" />;
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status.toLowerCase()) {
      case 'running':
      case 'active':
        return 'default';
      case 'stopped':
      case 'inactive':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getAllServices = () => {
    return serviceNames.map(service => ({
      name: service.name,
      protocol: service.protocol || 'TCP',
      status: 'Running',
      assetName: service.name || 'Unknown'
    }));
  };

  const allServices = getAllServices();

  const filteredServices = selectedAssetName === 'All'
    ? allServices
    : allServices.filter(s => s.assetName === selectedAssetName);

  const dialogFilteredServices = useMemo(() => {
    let result = getAllServices();

    if (assetFilter !== 'all') {
      result = result.filter(s => s.assetName === assetFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter(s => s.status.toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(lower) ||
        s.assetName.toLowerCase().includes(lower) ||
        s.protocol.toLowerCase().includes(lower)
      );
    }

    return result;
  }, [searchTerm, assetFilter, statusFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAssetFilter('all');
  };

  const uniqueStatuses = [...new Set(allServices.map(s => s.status))];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Services Information</CardTitle>
          <div className="flex items-center gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Show All Services</Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>All Services</DialogTitle>
                </DialogHeader>

                {/* Filters */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search service name, protocol, asset..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          {uniqueStatuses.map((s, i) => (
                            <SelectItem key={i} value={s.toLowerCase()}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Select value={assetFilter} onValueChange={setAssetFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="All Assets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assets</SelectItem>
                        {assets.map((a, i) => (
                          <SelectItem key={i} value={a.name}>{a.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={resetFilters}>
                      Reset
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Showing {dialogFilteredServices.length} services
                    {searchTerm && ` for "${searchTerm}"`}
                  </div>
                </div>

                {/* Services Table */}
                <div className="flex-1 overflow-auto border rounded-md">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Protocol</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Asset</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dialogFilteredServices.map((service, i) => (
                        <TableRow key={`${service.name}-${i}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getServiceIcon(service.name)}
                              <span className="font-medium">{service.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{service.protocol}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(service.status)}>
                              {service.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{service.assetName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {dialogFilteredServices.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No services found matching your criteria.
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
                {assets.map((a, i) => (
                  <SelectItem key={i} value={a.name}>
                    {a.name}
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
                <TableHead>Service</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Asset</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.slice(0, 8).map((service, i) => (
                <TableRow key={`${service.name}-${i}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getServiceIcon(service.name)}
                      <span className="font-medium">{service.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{service.protocol}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(service.status)}>
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{service.assetName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredServices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No services found for the selected asset.
            </div>
          )}

          {filteredServices.length > 8 && (
            <div className="text-center py-4 text-sm text-muted-foreground border-t">
              Showing 8 of {filteredServices.length} services
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesTable;
