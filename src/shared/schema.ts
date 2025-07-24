import { z } from "zod";


export const ScanVulnerabilityResponseSchema = z.object({
  id: z.string(),
  scanBatchId: z.string(),
  hostId: z.string(),
  firstFound: z.string(),
  lastSeen: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  pluginId: z.string().optional(),
  pluginName: z.string().optional(),
  pluginFamily: z.string().optional(),
  pluginType: z.string().optional().nullable(),
  port: z.number().int().optional(),
  protocol: z.string().optional(),
  service: z.string().optional(),
  severity: z.string().optional(),
  riskFactor: z.string().optional(),
  synopsis: z.string().optional(),
  description: z.string().optional(),
  solution: z.string().optional(),
  seeAlso: z.array(z.string()).optional(),
  cvssVector: z.string().optional().nullable(),
  cvssScore: z.number().optional().nullable(),
  cvss3Vector: z.string().optional().nullable(),
  cvss3Score: z.number().optional().nullable(),
  cve: z.array(z.string()).optional().nullable(),
  bid: z.array(z.string()).optional(),
  xref: z.array(z.string()).optional(),

  // Plugin Output
  pluginOutput: z.string().optional().nullable(),
});

export const ScanHostResponseSchema = z.object({
  id: z.string({
    required_error: "Host ID is required",
    invalid_type_error: "Host ID must be a string",
  }),
  scanBatchId: z.string({
    required_error: "Scan batch ID is required",
    invalid_type_error: "Scan batch ID must be a string",
  }),
  hostName: z.string({
    required_error: "Host name is required",
    invalid_type_error: "Host name must be a string",
  }),
  ipAddress: z.string().nullable(),
  operatingSystem: z.string().nullable(),
  macAddress: z.string().nullable(),
  netbiosName: z.string().nullable(),
  fqdn: z.string().nullable(),
  systemType: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  vulnerabilities: z.array(ScanVulnerabilityResponseSchema, {
    required_error: "Vulnerabilities array is required",
    invalid_type_error: "Vulnerabilities must be an array",
  }),
});

export const ScanResultResponseSchema = z.object({
  message: z.string(),
  count: z.number(),
});

export const ScanBatchResponseSchema = z.object({
  timestamp: z.string().transform((str) => new Date(str)),
  fileName: z.string().optional(),
  fileCount: z.number().optional(),
  totalItems: z.number().optional(),
  createdAt: z.string().transform((str) => new Date(str)).optional(),
  updatedAt: z.string().transform((str) => new Date(str)).optional(),
  hosts: z.array(ScanHostResponseSchema).optional().default([]),
});

export const ScanStatisticsResponseSchema = z.object({
  totalHosts: z.number(),
  totalVulns: z.number(),
  criticalCount: z.number(),
  highCount: z.number(),
  mediumCount: z.number(),
  lowCount: z.number(),
  infoCount: z.number(),
});

export const QuerySchema = z.object({
  start: z.string().catch("No start provided"),
  end: z.string().catch("No end provided"),

  category: z.string().optional(),
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  all: z.boolean().optional(),
});

export const EndpointSchema = z.object({
  endpoint_id: z.string().catch("No endpoint_id provided"),
  endpoint_name: z.string().catch("No endpoint_name provided"),
  endpoint_type: z.string().optional(),
  endpoint_status: z.string().optional(),
  os_type: z.string().optional(),
  os_version: z.string().optional(),

  ip: z.array(z.string()).optional(),
  ipv6: z.array(z.string()).optional(),
  public_ip: z.string().optional(),

  users: z.array(z.string()).optional(),
  domain: z.string().optional(),
  alias: z.string().optional(),

  first_seen: z.number().optional(),
  last_seen: z.number().optional(),

  content_version: z.string().optional(),
  installation_package: z.string().optional(),

  active_directory: z.array(z.string()).optional(),
  install_date: z.number().optional(),

  endpoint_version: z.string().optional(),
  is_isolated: z.string().optional(),
  isolated_date: z.number().optional(),

  group_name: z.array(z.string()).optional(),
  operational_status: z.string().optional(),
  operational_status_description: z.string().optional(),
  operational_status_details: z.array(z.string()).optional(),

  scan_status: z.string().optional(),

  content_release_timestamp: z.number().optional(),
  last_content_update_time: z.number().optional(),

  operating_system: z.string().optional(),
  mac_address: z.array(z.string()).optional(),

  assigned_prevention_policy: z.string().optional(),
  assigned_extensions_policy: z.string().optional(),

  token_hash: z.string().optional(),

  tags: z.record(z.any()).optional(),

  content_status: z.string().optional(),
});

export const VulnerabilitySchema = z.object({
  cveID: z.string().catch("No CVE ID provided").nullable(),
  vendorProject: z.string().catch("No vendor/project provided"),
  product: z.string().catch("No product name provided"),
  vulnerabilityName: z.string().catch("No vulnerability name provided"),
  dateAdded: z.string().datetime().catch("Invalid or missing dateAdded"),
  shortDescription: z.string().catch("No description provided"),
  requiredAction: z.string().catch("No required action provided"),
  dueDate: z.string().datetime().catch("Invalid or missing dueDate"),
  knownRansomwareCampaignUse: z.string().optional(),
  notes: z.string().optional(),
  cwes: z.array(z.string()).optional(),
});

export const NewsSchema = z.object({
  id: z.string().catch("No news UID provided"),
  title: z.string().catch("No title provided"),
  detail: z.string().catch("No detail provided"),
  author: z.string().catch("No author provided"),
  img: z.string().catch("No image URL provided"),
  source: z.string().catch("Invalid or missing source URL"),
  newsDate: z.string().datetime().catch("Invalid or missing date"),
  createAt: z.string().datetime().catch("Invalid or missing createAt"),
  updateAt: z.string().datetime().catch("Invalid or missing updateAt"),
  products: z.array(z.string()).optional(),
  cves: z.array(z.string()).optional(),
  recommendation: z.string().catch("No recommendation provided"),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string().catch("No access token provided"),
  refreshToken: z.string().catch("No refresh token provided"),
  user: z.object({
    id: z.string().catch("No user ID provided"),
    email: z.string().email().catch("Invalid or missing email"),
    firstName: z.string().catch("No first name provided"),
    lastName: z.string().catch("No last name provided"),
    emailVerified: z.boolean().catch(false),
    roles: z.array(z.object({
      id: z.string().catch("No role ID provided"),
      name: z.string().catch("No role name provided"),
    })).optional(),
  }), 
});
