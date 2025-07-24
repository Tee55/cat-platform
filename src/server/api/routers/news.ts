import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { newsService } from "@/server/api/services/news";

// Input validation schema for pagination parameters
const PaginationParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
});

export const newsRouter = createTRPCRouter({
  // Fetch regular news with pagination
  fetchNews: protectedProcedure
    .input(PaginationParamsSchema)
    .query(async ({ input }) => {
      return await newsService.fetchNews(input);
    }),

  // Fetch Cyfirma news with pagination
  fetchCyfirmaNews: protectedProcedure
    .input(PaginationParamsSchema)
    .query(async ({ input }) => {
      return await newsService.fetchCyfirmaNews(input);
    }),
});