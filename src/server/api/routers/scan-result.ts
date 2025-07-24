// src/server/api/routers/scan.ts

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { scanResultService } from "@/server/api/services/scan-result";
import { z } from "zod";

export const scanResultRouter = createTRPCRouter({
  /**
   * Upload a single Nessus file
   */
  uploadSingleFile: protectedProcedure
    .input(z.object({ file: z.instanceof(File) }))
    .mutation(async ({ input, ctx }) => {
      return scanResultService.uploadSingleFile(input.file);
    }),

  /**
   * Upload multiple Nessus files
   */
  uploadMultipleFiles: protectedProcedure
    .input(z.object({ files: z.array(z.instanceof(File)) }))
    .mutation(async ({ input, ctx }) => {
      return scanResultService.uploadMultipleFiles(input.files);
    }),

  /**
   * Get scan batch by ID
   */
  getScanResultById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return scanResultService.getScanResultById(input.id);
    }),

  /**
   * Get scan statistics
   */
  getStatistics: protectedProcedure
    .input(z.object({ scanBatchId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      return scanResultService.getScanStatistics(input.scanBatchId);
    }),

  /**
   * Get vulnerabilities by severity
   */
  getVulnerabilities: protectedProcedure
    .input(z.object({
      severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Info']),
      scanBatchId: z.string().optional(),
      limit: z.number().optional(),
    }))
    .query(async ({ input, ctx }) => {
      return scanResultService.getVulnerabilitiesBySeverity(
        input.severity,
        input.scanBatchId,
        input.limit,
      );
    }),

  /**
   * Fetch vulnerabilities with pagination (legacy)
   */
  fetchVulnerabilities: protectedProcedure
    .input(z.object({
      severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Info']).optional(),
      scanBatchId: z.string().optional(),
      page: z.number().optional(),
      limit: z.number().optional(),
      sort: z.string().optional(),
      order: z.enum(['asc', 'desc']).optional(),
      search: z.string().optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (!input.severity) {
        throw new Error("Severity parameter is required");
      }
      return scanResultService.fetchVulnerabilities({
        severity: input.severity,
        scanBatchId: input.scanBatchId,
        page: input.page,
        limit: input.limit,
        sort: input.sort,
        order: input.order,
        search: input.search,
      });
    }),
});
