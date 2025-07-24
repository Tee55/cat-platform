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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ScanVulnerabilityResponseType {
  pluginName?: string;
  hostId: string;
  description?: string;
}

interface HighVulnerabilitiesPanelProps {
  highVulnerabilities: ScanVulnerabilityResponseType[];
}

const HighVulnerabilitiesPanel: React.FC<HighVulnerabilitiesPanelProps> = ({
  highVulnerabilities,
}) => {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVulnerability, setSelectedVulnerability] =
    useState<null | {
      name: string;
      description: string;
      host: string;
      count: number;
    }>(null);

  const highVulnerabilitiesCount = useMemo(() => {
    const vulnerabilityMap = new Map<
      string,
      {
        name: string;
        description: string;
        host: string;
        count: number;
      }
    >();

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
          count: 1,
        });
      }
    });

    return Array.from(vulnerabilityMap.values()).sort(
      (a, b) => b.count - a.count,
    );
  }, [highVulnerabilities]);

  const totalPages = Math.ceil(
    highVulnerabilitiesCount.length / ITEMS_PER_PAGE,
  );

  const paginatedVulnerabilities = highVulnerabilitiesCount.slice(
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
          High Priority Alerts
        </CardTitle>
      </CardHeader>

      <CardContent>
        {highVulnerabilitiesCount.length === 0 ? (
          <Alert>
            <AlertDescription className="py-8 text-center text-muted-foreground">
              No high priority vulnerabilities found
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="mb-6 max-h-96 space-y-3 overflow-y-auto pr-2">
              {paginatedVulnerabilities.map((vulnerability, index) => (
                <Alert
                  key={`${vulnerability.name}-${vulnerability.host}-${index}`}
                  className="cursor-pointer border border-destructive/20 bg-destructive/10 transition-colors hover:bg-destructive/20"
                  onClick={() => setSelectedVulnerability(vulnerability)}
                >
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="ml-2">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-destructive">
                          {vulnerability.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Host: {vulnerability.host}
                        </p>
                        {vulnerability.description !==
                          "No description available" && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
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
              <div className="flex items-center justify-between">
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

            {/* Dialog modal */}
            <Dialog
              open={!!selectedVulnerability}
              onOpenChange={() => setSelectedVulnerability(null)}
            >
              <DialogContent className="sm:max-w-md p-8">
                <DialogHeader>
                  <DialogTitle className="text-destructive">
                    {selectedVulnerability?.name}
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <p className="text-sm text-muted-foreground">
                    Host: {selectedVulnerability?.host}
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedVulnerability?.description}
                  </p>
                  <Badge variant="destructive" className="mt-4">
                    Occurrences: {selectedVulnerability?.count}
                  </Badge>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HighVulnerabilitiesPanel;
