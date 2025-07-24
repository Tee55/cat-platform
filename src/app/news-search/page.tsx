"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  User,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { api } from "@/trpc/react";
import type { NewsSchemaType } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DOMPurify from 'dompurify';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Extended type for news with source type
type NewsWithSource = NewsSchemaType & {
  sourceType: string;
};

const NewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("newsDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit] = useState(12);

  const queryParams = {
    page: currentPage,
    limit,
    search: searchQuery || undefined,
    sort: sortField,
    order: sortOrder,
  };

  const {
    data: regularNews,
    isLoading: regularLoading,
    error: regularError,
  } = api.news.fetchNews.useQuery(queryParams);

  const {
    data: cyfirmaNews,
    isLoading: cyfirmaLoading,
    error: cyfirmaError,
  } = api.news.fetchCyfirmaNews.useQuery(queryParams);

  const combinedNews = useMemo(() => {
    const regular = regularNews?.data || [];
    const cyfirma = cyfirmaNews?.data || [];

    const regularWithSource: NewsWithSource[] = regular.map((item: any) => ({
      ...item,
      sourceType: "Regular News",
    }));
    const cyfirmaWithSource: NewsWithSource[] = cyfirma.map((item: any) => ({
      ...item,
      sourceType: "Cyfirma Intelligence",
    }));

    const combined = [...regularWithSource, ...cyfirmaWithSource];

    return combined.sort((a: NewsWithSource, b: NewsWithSource) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "newsDate":
        case "createAt":
        case "updateAt":
          aValue = new Date(a[sortField]).getTime();
          bValue = new Date(b[sortField]).getTime();
          break;
        case "title":
        case "author":
        case "detail":
        case "source":
        case "recommendation":
          aValue = a[sortField];
          bValue = b[sortField];
          break;
        default:
          aValue = new Date(a.newsDate).getTime();
          bValue = new Date(b.newsDate).getTime();
      }

      return sortOrder === "asc"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
          ? 1
          : -1;
    });
  }, [regularNews, cyfirmaNews, sortField, sortOrder]);

  // Calculate total pagination (using the higher total from both sources)
  const totalItems = Math.max(
    regularNews?.pagination?.total || 0,
    cyfirmaNews?.pagination?.total || 0,
  );
  const totalPages = Math.ceil(totalItems / limit);

  const isLoading = regularLoading || cyfirmaLoading;
  const hasError = regularError || cyfirmaError;

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength = 120) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getSourceVariant = (sourceType: string) => {
    return sourceType === "Regular News" ? "default" : "secondary";
  };

  // Loading skeleton component
  const NewsCardSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="aspect-video">
        <Skeleton className="h-full w-full" />
      </div>
      <CardHeader className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          News & Intelligence Feed
        </h1>
        <p className="text-muted-foreground text-xl">
          Latest security news and threat intelligence from multiple sources
        </p>
      </div>

      {/* Search and Controls */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                className="pl-10"
              />
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <Button
                variant={sortField === "newsDate" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("newsDate")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Date
                {sortField === "newsDate" && (
                  <ArrowUpDown className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortField === "title" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("title")}
                className="gap-2"
              >
                Title
                {sortField === "title" && <ArrowUpDown className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {hasError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Error loading news: {regularError?.message || cyfirmaError?.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* News Grid */}
      {!isLoading && !hasError && combinedNews.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {combinedNews.map((article) => (
              <Card
                key={`${article.sourceType}-${article.source}`}
                className="group overflow-hidden transition-shadow hover:shadow-lg"
              >
                {/* Image */}
                <div className="bg-muted relative aspect-video overflow-hidden">
                  <img
                    src={
                      article.img || "https://picsum.photos/seed/picsum/200/300"
                    }
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    width={400}
                    height={225}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://picsum.photos/seed/picsum/200/300";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={getSourceVariant(article.sourceType)}
                      className="text-xs font-medium"
                    >
                      {article.sourceType}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="group-hover:text-primary line-clamp-2 text-base leading-tight transition-colors">
                    {article.title}
                  </CardTitle>
                  <CardDescription
                    className="line-clamp-2 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(article.detail),
                    }}
                  ></CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Meta Information */}
                  <div className="text-muted-foreground flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">
                          {article.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="max-w-20 truncate">
                        {article.author}
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-3" />
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.newsDate)}</span>
                    </div>
                  </div>

                  {/* CVEs and Products */}
                  {((article.cves && article.cves.length > 0) ||
                    (article.products && article.products.length > 0)) && (
                    <div className="space-y-2">
                      {article.cves && article.cves.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {article.cves.slice(0, 2).map((index, cve) => (
                            <Badge
                              key={index}
                              variant="destructive"
                              className="px-1.5 py-0.5 text-xs"
                            >
                              {cve}
                            </Badge>
                          ))}
                          {article.cves.length > 2 && (
                            <Badge
                              variant="outline"
                              className="px-1.5 py-0.5 text-xs"
                            >
                              +{article.cves.length - 2} CVEs
                            </Badge>
                          )}
                        </div>
                      )}
                      {article.products && article.products.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {article.products
                            .slice(0, 2)
                            .map((index, product) => (
                              <Badge
                                key={index}
                                className="bg-green-100 px-1.5 py-0.5 text-xs text-green-800 hover:bg-green-200"
                              >
                                {product}
                              </Badge>
                            ))}
                          {article.products.length > 2 && (
                            <Badge
                              variant="outline"
                              className="px-1.5 py-0.5 text-xs"
                            >
                              +{article.products.length - 2} products
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:bg-primary group-hover:text-primary-foreground w-full justify-between transition-colors"
                    asChild
                  >
                    <a
                      href={article.source}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="min-w-9"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-muted-foreground mt-6 text-center text-sm">
            Showing {combinedNews.length} articles from {totalItems} total
            results
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && !hasError && combinedNews.length === 0 && (
        <Card className="py-16 text-center">
          <CardContent className="space-y-4">
            <Search className="text-muted-foreground mx-auto h-16 w-16 opacity-50" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No news found</h3>
              <p className="text-muted-foreground mx-auto max-w-md">
                Try adjusting your search terms or filters to find relevant
                articles
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewsPage;
