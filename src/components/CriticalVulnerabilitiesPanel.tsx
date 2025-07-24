"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ChevronLeft, ChevronRight, X } from "lucide-react";

interface ScanVulnerabilityResponseType {
  pluginName?: string;
  hostId: string;
  description?: string;
}

interface CriticalVulnerabilitiesPanelProps {
  scanVulnerabilities: ScanVulnerabilityResponseType[];
}

const CriticalVulnerabilitiesPanel: React.FC<CriticalVulnerabilitiesPanelProps> =
  ({ scanVulnerabilities }) => {
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVulnerability, setSelectedVulnerability] =
      useState<null | {
        name: string;
        description: string;
        host: string;
        count: number;
      }>(null);

    const criticalVulnerabilitiesCount = useMemo(() => {
      const vulnerabilityMap = new Map<
        string,
        {
          name: string;
          description: string;
          host: string;
          count: number;
        }
      >();

      scanVulnerabilities.forEach((item) => {
        const key = `${item.pluginName}-${item.hostId}`;
        const existing = vulnerabilityMap.get(key);

        if (existing) {
          existing.count += 1;
        } else {
          vulnerabilityMap.set(key, {
            name: item.pluginName ?? "Unknown Vulnerability",
            host: item.hostId,
            description: item.description ?? "No description available",
            count: 1,
          });
        }
      });

      return Array.from(vulnerabilityMap.values()).sort(
        (a, b) => b.count - a.count,
      );
    }, [scanVulnerabilities]);

    const totalPages = Math.ceil(
      criticalVulnerabilitiesCount.length / ITEMS_PER_PAGE,
    );

    const paginatedVulnerabilities = criticalVulnerabilitiesCount.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
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
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Critical Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {criticalVulnerabilitiesCount.length === 0 ? (
            <Alert>
              <AlertDescription className="text-center py-8">
                No critical vulnerabilities found
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                {paginatedVulnerabilities.map((vulnerability, index) => (
                  <Alert
                    key={`${vulnerability.name}-${vulnerability.host}-${index}`}
                    className="border-destructive/20 bg-destructive/5 cursor-pointer hover:bg-destructive/10 transition-colors"
                    onClick={() => setSelectedVulnerability(vulnerability)}
                  >
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="ml-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">
                            {vulnerability.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Host: {vulnerability.host}
                          </p>
                          {vulnerability.description !==
                            "No description available" && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {vulnerability.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="destructive" className="ml-3 flex-shrink-0">
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

              {/* Detail Modal */}
              {selectedVulnerability && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                  onClick={() => setSelectedVulnerability(null)}
                >
                  <div
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                      onClick={() => setSelectedVulnerability(null)}
                      aria-label="Close detail"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-destructive mb-2">
                      {selectedVulnerability.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-1">
                      Host: {selectedVulnerability.host}
                    </p>
                    <p className="text-sm">{selectedVulnerability.description}</p>
                    <Badge className="mt-4 bg-destructive hover:bg-destructive/90">
                      Occurrences: {selectedVulnerability.count}
                    </Badge>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

export default CriticalVulnerabilitiesPanel;
