"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { api } from "@/trpc/react";
import DOMPurify from "dompurify";

type TrendPoint = {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
};

const SummaryCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { data, isLoading } = api.scanResult.getScanBatchesInfo.useQuery();

  const trendData: TrendPoint[] = [];
  let totalHosts = 0;
  let totalVulns = 0;
  let critical = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  if (data) {
    for (const batch of data) {
      const stats = batch.scanStatistics;
      const createdDate = batch.createdAt ?? batch.timestamp;

      trendData.push({
        date: dayjs(createdDate).format("MMM D"),
        critical: stats.criticalCount,
        high: stats.highCount,
        medium: stats.mediumCount,
        low: stats.lowCount,
      });

      totalHosts += stats.totalHosts;
      totalVulns += stats.totalVulns;
      critical += stats.criticalCount;
      high += stats.highCount;
      medium += stats.mediumCount;
      low += stats.lowCount;
    }
  }

  // Fetch news data (pagination shape)
  const { data: generalNewsRes, isLoading: isLoadingNews } =
    api.news.fetchNews.useQuery({});
  const { data: cyfirmaNewsRes, isLoading: isLoadingCyfirma } =
    api.news.fetchCyfirmaNews.useQuery({});

  // Extract items arrays safely
  const generalNewsItems = generalNewsRes?.data;
  const cyfirmaNewsItems = cyfirmaNewsRes?.data;

  // Combine and sort news by date desc, limit 6
  const combinedNews = useMemo(() => {
    const formatNewsItem = (item: any, source: "general" | "cyfirma") => ({
      ...item,
      sourceType: source,
      date: new Date(item.newsDate),
    });

    if (!generalNewsItems || !cyfirmaNewsItems) return [];

    return [
      ...generalNewsItems.map((n) => formatNewsItem(n, "general")),
      ...cyfirmaNewsItems.map((n) => formatNewsItem(n, "cyfirma")),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 6);
  }, [generalNewsItems, cyfirmaNewsItems]);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Security Dashboard
        </h1>
        <p className="mt-1 text-gray-500">
          Overview of scan batches and vulnerability trends
        </p>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard title="Total Hosts" value={totalHosts} />
          <SummaryCard title="Total Vulnerabilities" value={totalVulns} />
          <SummaryCard
            title="Critical / High"
            value={`${critical} / ${high}`}
          />
        </div>
      )}

      {/* Trend Chart */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Security Metrics Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData.reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="critical"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Critical"
                />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#ea580c"
                  strokeWidth={2}
                  name="High"
                />
                <Line
                  type="monotone"
                  dataKey="medium"
                  stroke="#d97706"
                  strokeWidth={2}
                  name="Medium"
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#059669"
                  strokeWidth={2}
                  name="Low"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* News Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Cybersecurity News</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingNews || isLoadingCyfirma ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-200">
              <div className="space-y-4">
                {combinedNews.map((news) => (
                  <div
                    key={news.id}
                    className="bg-muted/50 rounded-lg border p-4 transition hover:shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {news.title}
                        </h3>
                        <p
                          className="mt-1 line-clamp-2 text-sm text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(news.detail),
                          }}
                        >
                        </p>
                      </div>
                      <div className="ml-4 shrink-0">
                        <Badge variant="outline">
                          {news.sourceType === "cyfirma" ? "Cyfirma" : "News"}
                        </Badge>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{dayjs(news.newsDate).format("MMM D, YYYY")}</span>
                      <a
                        href={news.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Source
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
