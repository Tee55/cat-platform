"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScanVulnerabilityResponseType {
  pluginName?: string;
  hostId: string;
  description?: string;
}

interface HighVulnerabilitiesPanelProps {
  highVulnerabilities: ScanVulnerabilityResponseType[];
}

const HighVulnerabilitiesPanel: React.FC<HighVulnerabilitiesPanelProps> = ({ 
  highVulnerabilities 
}) => {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const highVulnerabilitiesCount = useMemo(() => {
    const vulnerabilityMap = new Map<string, {
      name: string;
      description: string;
      host: string;
      count: number;
    }>();

    highVulnerabilities.forEach((item) => {
      const key = `${item.pluginName}-${item.hostId}`;
      const existing = vulnerabilityMap.get(key);
      
      if (existing) {
        existing.count += 1;
      } else {
        vulnerabilityMap.set(key, {
          name: item.pluginName ?? "Unknown Vulnerability",
          host: item.hostId,
          description: item.description ?? "No description available",
          count: 1
        });
      }
    });

    return Array.from(vulnerabilityMap.values()).sort((a, b) => b.count - a.count);
  }, [highVulnerabilities]);

  const totalPages = Math.ceil(highVulnerabilitiesCount.length / ITEMS_PER_PAGE);
  
  const paginatedVulnerabilities = highVulnerabilitiesCount.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <AlertTriangle className="h-5 w-5" />
          High Priority Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {highVulnerabilitiesCount.length === 0 ? (
          <Alert>
            <AlertDescription className="text-center py-8">
              No high priority vulnerabilities found
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {paginatedVulnerabilities.map((vulnerability, index) => (
                <Alert key={`${vulnerability.name}-${vulnerability.host}-${index}`} className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="ml-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {vulnerability.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Host: {vulnerability.host}
                        </p>
                        {vulnerability.description !== "No description available" && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {vulnerability.description}
                          </p>
                        )}
                      </div>
                      <Badge className="ml-3 flex-shrink-0 bg-orange-500 hover:bg-orange-600">
                        {vulnerability.count}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Previous
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HighVulnerabilitiesPanel;