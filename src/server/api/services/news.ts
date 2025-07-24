import { TRPCError } from "@trpc/server";
import type { NewsSchemaType, PaginationParams, PaginationResponse, VulnerabilitySchemaType } from "@/shared/types";
import { apiUrl } from "./api";
import { z } from "zod";
import { NewsSchema, VulnerabilitySchema } from "@/shared/schema";
import { auth } from "@/server/auth";

const PaginationResponseSchema = z.object({
  data: z.object({
    items: z.array(NewsSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNextPage: z.boolean(),
      hasPreviousPage: z.boolean(),
    }),
  }),
});
export const newsService = {

  async fetchNews(params: PaginationParams = {}): Promise<PaginationResponse<NewsSchemaType>> {
    try {
      // Build query string
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.sort) searchParams.set('sortedColumnName', params.sort);
      if (params.order) searchParams.set('sortedOrder', params.order);
      if (params.search) searchParams.set('searchQuery', params.search);
      
      const queryString = searchParams.toString();
      const url = `${apiUrl}/news/pagination${queryString ? `?${queryString}` : ''}`;

      const session = await auth();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
      });

      if (!response.ok) {
        const error = await response.json() as { message?: string };
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.message ?? "Failed to fetch news",
        });
      }
      const validatedData = PaginationResponseSchema.parse(
        await response.json(),
      );

      return {
        data: validatedData.data.items,
        pagination: validatedData.data.pagination,
      };
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      throw error;
    }
  },

  async fetchCyfirmaNews(params: PaginationParams = {}): Promise<PaginationResponse<NewsSchemaType>> {
    try {
      // Build query string
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.sort) searchParams.set('sortedColumnName', params.sort);
      if (params.order) searchParams.set('sortedOrder', params.order);
      if (params.search) searchParams.set('searchQuery', params.search);
      
      const queryString = searchParams.toString();
      const url = `${apiUrl}/campaign/pagination${queryString ? `?${queryString}` : ''}`;

      const session = await auth();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
      });

      if (!response.ok) {
        const error = await response.json() as { message?: string };
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.message ?? "Failed to fetch cyfirma news",
        });
      }
      const validatedData = PaginationResponseSchema.parse(
        await response.json(),
      );

      return {
        data: validatedData.data.items,
        pagination: validatedData.data.pagination,
      };
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      throw error;
    }
  },
};