"use client";

import type { AssetType, PluginType, ServiceType } from '@/shared/types';
import { useMemo } from 'react';
import type { ScanVulnerabilityResponseType } from '@/shared/types';
import { api } from '@/trpc/react';

// Utility function to convert numeric severity to text
const getSeverityFromNumeric = (severity?: string): string => {
  switch (severity) {
    case '0':
      return 'Info';
    case '1':
      return 'Low';
    case '2':
      return 'Medium';
    case '3':
      return 'High';
    case '4':
      return 'Critical';
    default:
      return 'Info';
  }
};

// Utility function to get severity from CVSS score (fallback)
const getSeverityFromScore = (score?: number): string => {
  if (!score && score !== 0) return 'Info';
  if (score < 0.1) return 'Info';
  if (score < 4) return 'Low';
  if (score < 7) return 'Medium';
  if (score < 9) return 'High';
  return 'Critical';
};

const createEmptyAsset = (hostId: string, hostName?: string, ipAddress?: string): AssetType => ({
  name: hostName || ipAddress || hostId,
  plugins: [],
  alerts: [
    { severity: 'critical', data: [] },
    { severity: 'high', data: [] },
    { severity: 'medium', data: [] },
    { severity: 'low', data: [] },
    { severity: 'info', data: [] }
  ],
  serviceList: []
});

export const useScanBatch = (scanBatchId?: string) => {
  // Single tRPC query to get all scan batch data including hosts and vulnerabilities
  const scanBatchQuery = api.scanResult.getScanResultById.useQuery(
    { id: scanBatchId || '' },
    { enabled: !!scanBatchId }
  );

  // Extract all vulnerabilities from hosts
  const allVulnerabilities = useMemo(() => {
    if (!scanBatchQuery.data?.hosts) return [];
    
    return scanBatchQuery.data.hosts.flatMap(host => 
      host.vulnerabilities || []
    );
  }, [scanBatchQuery.data?.hosts]);

  // Process data inside useMemo for performance optimization
  const processedData = useMemo(() => {
    const portSet = new Set<string>();
    const serviceMap = new Map<string, ServiceType>();
    const pluginMap = new Map<string, PluginType>();
    const osVersionSet = new Set<string>();
    const assetMap = new Map<string, AssetType>();

    // Severity counts and grouped vulnerabilities
    let criticalCount = 0, highCount = 0, mediumCount = 0, lowCount = 0, infoCount = 0;
    const criticalData: ScanVulnerabilityResponseType[] = [];
    const highData: ScanVulnerabilityResponseType[] = [];
    const mediumData: ScanVulnerabilityResponseType[] = [];
    const lowData: ScanVulnerabilityResponseType[] = [];
    const infoData: ScanVulnerabilityResponseType[] = [];

    // Process hosts from scanBatch data if available
    if (scanBatchQuery.data?.hosts) {
      scanBatchQuery.data.hosts.forEach((host) => {
        // Collect OS versions from hosts
        if (host.operatingSystem) {
          osVersionSet.add(host.operatingSystem);
        }

        // Process each host as an asset
        if (!assetMap.has(host.id)) {
          assetMap.set(host.id, createEmptyAsset(host.id, host.hostName, host.ipAddress || host.hostName));
        }
      });
    }

    allVulnerabilities.forEach((entry) => {
      // Get severity - prioritize the severity field, fallback to CVSS score
      const severityLevel = entry.severity 
        ? getSeverityFromNumeric(entry.severity)
        : getSeverityFromScore(entry.cvssScore || entry.cvss3Score || 0);

      // Ports
      if (entry.port !== undefined && entry.port !== null) {
        portSet.add(entry.port.toString());
      }

      // Services
      if (entry.service) {
        const serviceKey = `${entry.service}-${entry.protocol || 'N/A'}`;
        if (!serviceMap.has(serviceKey)) {
          serviceMap.set(serviceKey, {
            name: entry.service,
            protocol: entry.protocol || 'N/A'
          });
        }
      }

      // Plugins
      if (entry.pluginId) {
        if (!pluginMap.has(entry.pluginId)) {
          pluginMap.set(entry.pluginId, {
            id: entry.pluginId,
            name: entry.pluginName || 'N/A'
          });
        }
      }

      // Assets - ensure asset exists (should already be created above)
      const hostId = entry.hostId;
      if (!assetMap.has(hostId)) {
        assetMap.set(hostId, createEmptyAsset(hostId));
      }
      const currentAsset = assetMap.get(hostId)!;

      // Add plugin to asset
      if (entry.pluginId && !currentAsset.plugins.some(p => p.id === entry.pluginId)) {
        currentAsset.plugins.push({
          id: entry.pluginId,
          name: entry.pluginName || 'N/A'
        });
      }

      // Add service to asset
      if (entry.service && !currentAsset.serviceList.some(s => s.name === entry.service && s.protocol === (entry.protocol || 'N/A'))) {
        currentAsset.serviceList.push({
          name: entry.service,
          protocol: entry.protocol || 'N/A'
        });
      }

      // Add vulnerability to asset's alerts by severity
      const alertGroup = currentAsset.alerts.find(a => a.severity.toLowerCase() === severityLevel.toLowerCase());
      if (alertGroup) {
        alertGroup.data.push(entry);
      }

      // Count by severity and group
      switch (severityLevel) {
        case 'Critical':
          criticalCount++;
          criticalData.push(entry);
          break;
        case 'High':
          highCount++;
          highData.push(entry);
          break;
        case 'Medium':
          mediumCount++;
          mediumData.push(entry);
          break;
        case 'Low':
          lowCount++;
          lowData.push(entry);
          break;
        case 'Info':
          infoCount++;
          infoData.push(entry);
          break;
      }
    });

    return {
      criticalVulnerabilities: criticalData,
      highVulnerabilities: highData,
      mediumVulnerabilities: mediumData,
      lowVulnerabilities: lowData,
      infoVulnerabilities: infoData,
      severities: [
        { severity: 'Info', count: infoCount },
        { severity: 'Low', count: lowCount },
        { severity: 'Medium', count: mediumCount },
        { severity: 'High', count: highCount },
        { severity: 'Critical', count: criticalCount },
      ],
      assets: Array.from(assetMap.values()),
      plugins: Array.from(pluginMap.values()),
      serviceNames: Array.from(serviceMap.values()),
      vulnerabilityPorts: Array.from(portSet),
      osVersions: Array.from(osVersionSet),
    };
  }, [allVulnerabilities, scanBatchQuery.data?.hosts]);

  return {
    ...processedData,
    // Scan batch data and metadata
    scanBatch: scanBatchQuery.data,
    hosts: scanBatchQuery.data?.hosts || [],
    vulnerabilities: allVulnerabilities,
    loading: scanBatchQuery.isLoading,
    error: scanBatchQuery.error,
    refetch: () => {
      scanBatchQuery.refetch();
    },
  };
};