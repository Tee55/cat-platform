import type { z } from "zod";
import type { NewsSchema, EndpointSchema, LoginResponseSchema, QuerySchema, ScanBatchResponseSchema, ScanResultResponseSchema, ScanStatisticsResponseSchema, ScanVulnerabilityResponseSchema, VulnerabilitySchema, ScanMatchResultResponseSchema, CVEMatchInfoSchema, ScanBatchInfoResponseSchema } from "@/shared/schema";
import type { JSX } from "react";

export type QuerySchemaType = z.infer<typeof QuerySchema>;
export type EndpointSchemaType = z.infer<typeof EndpointSchema>;
export type VulnerabilitySchemaType = z.infer<typeof VulnerabilitySchema>;
export type NewsSchemaType = z.infer<typeof NewsSchema>;
export type LoginResponseSchemaType = z.infer<typeof LoginResponseSchema>;
export type ScanResultResponseType = z.infer<typeof ScanResultResponseSchema>;
export type ScanBatchResponseType = z.infer<typeof ScanBatchResponseSchema>;
export type ScanStatisticsResponseType = z.infer<
  typeof ScanStatisticsResponseSchema
>;
export type ScanVulnerabilityResponseType = z.infer<
  typeof ScanVulnerabilityResponseSchema
>;
export type CVEMatchInfoSchemaType = z.infer<typeof CVEMatchInfoSchema>;
export type ScanMatchResultResponseType = z.infer<
  typeof ScanMatchResultResponseSchema
>;
export type ScanBatchInfoResponseType = z.infer<typeof ScanBatchInfoResponseSchema>;

export type PaginationResponse<T = QuerySchemaType | EndpointSchemaType | VulnerabilitySchemaType | NewsSchemaType> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type UserRole = {
    id: string;
    name: string;
};

export type AssetType =  {
  name: string;
  alerts: AlertType[];
  plugins: PluginType[];
  serviceList: ServiceType[];
}

export type SeverityCountType = {
  severity: string;
  count: number;
}

export type AlertType = {
  severity: string;
  data: ScanVulnerabilityResponseType[];
}

export type PluginType = {
  id: string;
  name: string;
}

export type ServiceType = {
  name: string;
  protocol: string;
}

export type MenuType = {
    label: string,
    icon: () => JSX.Element
    onClick?: () => void,
}

export type Appearance = "inherit" | "light" | "dark";

export type LoginRequest = {
  email: string;
  password: string;
}

export type Role = {
  id: string;
  name: string;
}

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
  roles?: Role[];
}

export type PaginationParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';