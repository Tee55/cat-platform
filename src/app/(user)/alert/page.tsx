"use client";

import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Eye,
  Activity,
  Search,
  Shield,
  ExternalLink,
  Clock,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { api } from "@/trpc/react";
import type { CVEMatchInfoSchemaType } from "@/shared/types";
import DOMPurify from "dompurify";
import { LoadingScreen } from "@/components/Loading";

const getSeverityColor = (cveId: string) => {
  if (cveId.includes("2024")) {
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700"; // Critical
  } else if (cveId.includes("2023")) {
    return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700"; // High
  } else {
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700"; // Medium
  }
};

const getSeverityText = (cveId: string) => {
  if (cveId.includes("2024")) return "Critical";
  if (cveId.includes("2023")) return "High";
  return "Medium";
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

function Filters({
  searchTerm,
  setSearchTerm,
  severityFilter,
  setSeverityFilter,
  newsTypeFilter,
  setNewsTypeFilter,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  severityFilter: string;
  setSeverityFilter: React.Dispatch<React.SetStateAction<string>>;
  newsTypeFilter: string;
  setNewsTypeFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Card className="mb-6 dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search by CVE, product, vendor, or vulnerability name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search CVE matches"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={newsTypeFilter} onValueChange={setNewsTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by news type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All News Types</SelectItem>
              <SelectItem value="general">General News</SelectItem>
              <SelectItem value="cyfirma">Cyfirma Intelligence</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

const AlertCard = ({ match }: { match: CVEMatchInfoSchemaType }) => {
  const cveId = match.cve.cveID || "Unknown CVE";
  const severity = getSeverityText(cveId);
  const totalNewsItems =
    match.matchedNews.length + match.matchedCyfirmaNews.length;

  return (
    <Card className="mb-4 transition-shadow hover:shadow-md dark:bg-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2 dark:bg-red-900">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <CardTitle className="text-foreground text-lg font-semibold">
                {cveId}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1 text-sm">
                {match.cve.product} by {match.cve.vendorProject} •{" "}
                {totalNewsItems} news {totalNewsItems === 1 ? "item" : "items"}
              </CardDescription>
            </div>
          </div>
          <Badge className={getSeverityColor(cveId)}>{severity}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Vulnerability Details */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <div className="mb-3 flex items-center gap-2">
            <Shield className="text-muted-foreground h-4 w-4" />
            <span className="text-foreground font-medium">
              Vulnerability Details
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Product:</span>
              <p className="text-foreground font-medium">{match.cve.product}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Vendor:</span>
              <p className="text-foreground font-medium">
                {match.cve.vendorProject}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Date Added:</span>
              <p className="text-foreground font-medium">
                {formatDate(match.cve.dateAdded)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date:</span>
              <p className="text-foreground font-medium">
                {formatDate(match.cve.dueDate)}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-muted-foreground">Vulnerability Name:</span>
            <p className="text-foreground mt-1 font-medium">
              {match.cve.vulnerabilityName}
            </p>
          </div>
          <div className="mt-3">
            <span className="text-muted-foreground">Description:</span>
            <p className="text-foreground mt-1">{match.cve.shortDescription}</p>
          </div>
          <div className="mt-3">
            <span className="text-muted-foreground">Required Action:</span>
            <p className="text-foreground mt-1">{match.cve.requiredAction}</p>
          </div>
          {match.cve.knownRansomwareCampaignUse && (
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-300" />
                <span className="font-medium text-red-600 dark:text-red-300">
                  Known Ransomware Campaign Use
                </span>
              </div>
              <p className="mt-1 text-red-700 dark:text-red-400">
                {match.cve.knownRansomwareCampaignUse}
              </p>
            </div>
          )}
        </div>

        {/* General News Items */}
        {match.matchedNews.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-foreground font-medium">
                General Security News ({match.matchedNews.length})
              </span>
            </div>
            <div className="space-y-3">
              {match.matchedNews.slice(0, 3).map((news) => (
                <div
                  key={news.id}
                  className="rounded-lg border bg-blue-50 p-3 dark:bg-blue-900"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="text-foreground text-sm leading-tight font-medium">
                      {news.title}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(news.source, "_blank")}
                      aria-label={`Open news source: ${news.title}`}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <p
                    className="text-muted-foreground mb-2 line-clamp-2 text-xs"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(news.detail),
                    }}
                  ></p>
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>By {news.author}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(news.newsDate)}
                    </div>
                  </div>
                  {news.recommendation && (
                    <div className="mt-2 rounded bg-green-50 p-2 text-xs dark:bg-green-900">
                      <span className="font-medium text-green-800 dark:text-green-400">
                        Recommendation:{" "}
                      </span>
                      <span className="text-green-700 dark:text-green-300">
                        {news.recommendation}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {match.matchedNews.length > 3 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`View ${
                      match.matchedNews.length - 3
                    } more general news items`}
                  >
                    View {match.matchedNews.length - 3} more general news items
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cyfirma News Items */}
        {match.matchedCyfirmaNews.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-foreground font-medium">
                Cyfirma Intelligence ({match.matchedCyfirmaNews.length})
              </span>
            </div>
            <div className="space-y-3">
              {match.matchedCyfirmaNews.slice(0, 3).map((news) => (
                <div
                  key={news.id}
                  className="rounded-lg border bg-purple-50 p-3 dark:bg-purple-900"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="text-foreground text-sm leading-tight font-medium">
                      {news.title}
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => window.open(news.source, "_blank")}
                      aria-label={`Open Cyfirma news source: ${news.title}`}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <p
                    className="text-muted-foreground mb-2 line-clamp-2 text-xs"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(news.detail),
                    }}
                  ></p>
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>By {news.author}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(news.newsDate)}
                    </div>
                  </div>
                  {news.recommendation && (
                    <div className="mt-2 rounded bg-green-50 p-2 text-xs dark:bg-green-900">
                      <span className="font-medium text-green-800 dark:text-green-400">
                        Recommendation:{" "}
                      </span>
                      <span className="text-green-700 dark:text-green-300">
                        {news.recommendation}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {match.matchedCyfirmaNews.length > 3 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`View ${
                      match.matchedCyfirmaNews.length - 3
                    } more Cyfirma intelligence items`}
                  >
                    View {match.matchedCyfirmaNews.length - 3} more Cyfirma
                    intelligence items
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex items-center justify-between pt-2">
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            {match.cve.cwes && match.cve.cwes.length > 0 && (
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>CWE: {match.cve.cwes.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CVEAlertPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [newsTypeFilter, setNewsTypeFilter] = useState("all");

  const {
    data: scanMatchData,
    isLoading,
    error,
  } = api.scanResult.getScanMatchResultByScanBatchId.useQuery({
    id: "bdb85b25-6c55-4124-a47b-00ab41379b2f",
  });

  // Filter matches based on search, severity, and news type
  const filteredMatches = useMemo(() => {
    if (!scanMatchData?.cveMatches) return [];

    return scanMatchData.cveMatches.filter((match) => {
      const cveId = match.cve.cveID || "";
      const severity = getSeverityText(cveId);

      const matchesSearch =
        searchTerm === "" ||
        cveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.cve.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.cve.vulnerabilityName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        match.cve.vendorProject
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesSeverity =
        severityFilter === "all" ||
        severity.toLowerCase() === severityFilter.toLowerCase();

      const hasNewsType =
        newsTypeFilter === "all" ||
        (newsTypeFilter === "general" && match.matchedNews.length > 0) ||
        (newsTypeFilter === "cyfirma" && match.matchedCyfirmaNews.length > 0);

      return matchesSearch && matchesSeverity && hasNewsType;
    });
  }, [scanMatchData?.cveMatches, searchTerm, severityFilter, newsTypeFilter]);

  if (isLoading) {
    return (
      <LoadingScreen />
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load CVE security alerts. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalNewsItems =
    scanMatchData?.cveMatches.reduce(
      (acc, match) =>
        acc + match.matchedNews.length + match.matchedCyfirmaNews.length,
      0,
    ) || 0;

  const criticalMatches = filteredMatches.filter(
    (match) =>
      getSeverityText(match.cve.cveID || "").toLowerCase() === "critical",
  ).length;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-destructive/10 dark:bg-destructive/20 rounded-lg p-2">
              <AlertTriangle className="text-destructive h-6 w-6" />
            </div>
            <div>
              <h1 className="text-foreground text-2xl font-bold">
                CVE Security Alerts
              </h1>
              <p className="text-muted-foreground text-sm">
                CVE alerts from Cyfirma, curated news, and real-time monitoring.
              </p>
            </div>
          </div>

          <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <AlertTriangle className="text-destructive h-4 w-4" />
              <span>{criticalMatches} Critical alerts</span>
            </div>
            <div className="flex items-center gap-1">
              <Newspaper className="text-foreground h-4 w-4" />
              <span>{totalNewsItems} news items</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          severityFilter={severityFilter}
          setSeverityFilter={setSeverityFilter}
          newsTypeFilter={newsTypeFilter}
          setNewsTypeFilter={setNewsTypeFilter}
        />

        {/* Alerts List */}
        {filteredMatches.length === 0 ? (
          <div className="text-muted-foreground text-center">
            No matches found.
          </div>
        ) : (
          filteredMatches.map((match) => (
            <AlertCard key={match.cve.cveID} match={match} />
          ))
        )}
      </div>
    </div>
  );
}
