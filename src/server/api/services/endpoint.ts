import { TRPCError } from "@trpc/server";
import type { EndpointSchemaType, PaginationParams, PaginationResponse } from "@/shared/types";
import { apiUrl } from "./api";
import { z } from "zod";
import { EndpointSchema } from "@/shared/schema";
import { auth } from "@/server/auth";

const PaginationResponseSchema = z.object({
  data: z.array(EndpointSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export const endpointService = {
  async fetchEndpoints(params: PaginationParams = {}): Promise<PaginationResponse<EndpointSchemaType>> {
    try {
      // Build query string
      const searchParams = new URLSearchParams();
      
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.sort) searchParams.set('sortedColumnName', params.sort);
      if (params.order) searchParams.set('sortedOrder', params.order);
      if (params.search) searchParams.set('searchQuery', params.search);
      
      const queryString = searchParams.toString();
      const url = `${apiUrl}/endpoint/pagination${queryString ? `?${queryString}` : ''}`;

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
          message: error.message ?? "Failed to fetch endpoints",
        });
      }
      const validatedData = PaginationResponseSchema.parse(await response.json());

      return validatedData;
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      throw error;
    }
  },
};