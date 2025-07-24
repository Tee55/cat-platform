"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { SidebarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useScanBatches } from "@/hooks/useScanBatches";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dayjs from "dayjs";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: scanBatches, isLoading } = useScanBatches();
  const selectedId = searchParams.get("batchId");

  // Auto-select first batchId if not set
  useEffect(() => {
    if (!selectedId && scanBatches && scanBatches.length > 0) {
      const sorted = [...scanBatches].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
      const firstBatch = sorted[0];
      if (!firstBatch) return;
      const url = new URL(window.location.href);
      url.searchParams.set("batchId", firstBatch.scanBatchId);
      router.replace(url.toString()); // use replace to avoid pushing history
    }
  }, [selectedId, scanBatches, router]);

  const handleSelectChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("batchId", value);
    router.push(url.toString());
  };

  const currentPageName = {
    "/dashboard": "Dashboard",
    "/vulnerability-dashboard": "Vulnerability Scan",
    "/alert": "Critical Alert / Notify",
    "/cve-search": "CVE Search",
    "/campaigns": "Campaigns",
  }[pathname] ?? "Unknown Page";

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b p-4">
      <div className="flex h-[--header-height] w-full items-center gap-4 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">CAT Platform</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Scan Batch Selector */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Scan Batch:</span>
          <Select onValueChange={handleSelectChange} value={selectedId ?? ""}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Select Scan Batch" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem disabled value="loading">Loading...</SelectItem>
              ) : (
                [...(scanBatches ?? [])]
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((batch) => (
                    <SelectItem key={batch.scanBatchId} value={batch.scanBatchId}>
                      {dayjs(batch.timestamp).format("YYYY-MM-DD HH:mm")} ({batch.fileName})
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
