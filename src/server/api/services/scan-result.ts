import { TRPCError } from "@trpc/server";
import type { PaginationParams, ScanBatchResponseType, ScanResultResponseType, ScanStatisticsResponseType, ScanVulnerabilityResponseType } from "@/shared/types";
import { apiUrl } from "./api";
import { z } from "zod";
import { ScanBatchResponseSchema, ScanResultResponseSchema, ScanStatisticsResponseSchema, ScanVulnerabilityResponseSchema } from "@/shared/schema";
import { auth } from "@/server/auth";

export const scanResultService = {
  /**
   * Upload a single Nessus file
   */
  async uploadSingleFile(
    file: File,
  ): Promise<ScanResultResponseType> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const session = await auth();
      const response = await fetch(`${apiUrl}/scan-results/upload/single`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message ?? "Failed to upload file",
        });
      }
      return ScanResultResponseSchema.parse(await response.json());
    } catch (error) {
      console.error("Error uploading single file:", error);
      throw error;
    }
  },

  /**
   * Upload multiple Nessus files
   */
  async uploadMultipleFiles(
    files: File[],
  ): Promise<ScanResultResponseType> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const session = await auth();
      const response = await fetch(`${apiUrl}/scan-results/upload/multiple`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message ?? "Failed to upload files",
        });
      }
      return ScanResultResponseSchema.parse(await response.json());
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      throw error;
    }
  },

  /**
   * Get scan batch by ID
   */
  async getScanResultById(
    id: string,
  ): Promise<ScanBatchResponseType> {
    try {
      const session = await auth();
      const response = await fetch(`${apiUrl}/scan-results/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new TRPCError({
          code: response.status === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR",
          message: error.message ?? "Failed to fetch scan result",
        });
      }
      const rawData = await response.json() as { data: ScanBatchResponseType };
      console.log("Fetched scan result data:", rawData.data);
      return ScanBatchResponseSchema.parse(rawData.data);
    } catch (error) {
      console.error("Error fetching scan result by ID:", error);
      throw error;
    }
  },

  /**
   * Get scan statistics
   */
  async getScanStatistics(
    scanBatchId?: string,
  ): Promise<ScanStatisticsResponseType> {
    try {
      const searchParams = new URLSearchParams();
      if (scanBatchId) searchParams.set("scanBatchId", scanBatchId);

      const queryString = searchParams.toString();
      const url = `${apiUrl}/scan-results/statistics/summary${queryString ? `?${queryString}` : ""}`;

      const session = await auth();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message ?? "Failed to fetch scan statistics",
        });
      }
      return ScanStatisticsResponseSchema.parse(await response.json());
    } catch (error) {
      console.error("Error fetching scan statistics:", error);
      throw error;
    }
  },

  /**
   * Get vulnerabilities by severity
   */
  async getVulnerabilitiesBySeverity(
    severity: "Critical" | "High" | "Medium" | "Low" | "Info",
    scanBatchId?: string,
    limit?: number,
  ): Promise<ScanVulnerabilityResponseType[]> {
    try {
      const searchParams = new URLSearchParams();
      if (scanBatchId) searchParams.set("scanBatchId", scanBatchId);
      if (limit) searchParams.set("limit", limit.toString());

      const queryString = searchParams.toString();
      const url = `${apiUrl}/scan-results/vulnerabilities/severity/${severity}${queryString ? `?${queryString}` : ""}`;
      
      const session = await auth();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
      });

      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new TRPCError({
          code:
            response.status === 400 ? "BAD_REQUEST" : "INTERNAL_SERVER_ERROR",
          message: error.message ?? "Failed to fetch vulnerabilities",
        });
      }
      const rawData = await response.json() as { data: ScanVulnerabilityResponseType[] };
      return z.array(ScanVulnerabilityResponseSchema).parse(rawData.data);
    } catch (error) {
      console.error("Error fetching vulnerabilities by severity:", error);
      throw error;
    }
  },

  /**
   * Legacy method - fetch vulnerabilities with pagination
   * You might want to implement this if you have a paginated endpoint
   */
  async fetchVulnerabilities(
    params: PaginationParams & {
      severity?: "Critical" | "High" | "Medium" | "Low" | "Info";
      scanBatchId?: string;
    },
  ): Promise<ScanVulnerabilityResponseType[]> {
    try {
      // If severity is provided, use the severity endpoint
      if (params.severity) {
        return await this.getVulnerabilitiesBySeverity(
          params.severity,
          params.scanBatchId,
          params.limit,
        );
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Severity parameter is required for vulnerability fetching",
      });
    } catch (error) {
      console.error("Error fetching vulnerabilities:", error);
      throw error;
    }
  },
};
