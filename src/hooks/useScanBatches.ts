import { api } from "@/trpc/react";

export const useScanBatches = () => {
  return api.scanResult.getScanBatchesInfo.useQuery();
};
