import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReactNode } from "react";

interface AssetSelectProps {
  asset: { name: string }[];
  setSelectedAsset: (value: string) => void;
  label: ReactNode;
}

export const AssetSelector = (props: AssetSelectProps) => {
  const { asset, setSelectedAsset, label } = props;
  return (
    <div className="flex items-center justify-between w-full">
      {/* Label on the left */}
      <div>{label}</div>

      {/* Select on the right */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Select Asset:</span>
        <Select
          defaultValue="All"
          onValueChange={(value) => setSelectedAsset(value)}
        >
          <SelectTrigger className="w-28 h-8">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {asset.map((item, index) => (
              <SelectItem key={index} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
