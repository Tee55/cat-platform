import { MoreVertical, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type StatsCardProps = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  description: string;
  color?: string;
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  color,
}) => {
  const { theme } = useTheme();
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="font-medium">{title}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-700">
              <MoreVertical size={16} className="text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-col h-full relative justify-between">
        <div
          className="text-8xl text-center font-medium mb-2"
          style={{
            color: color ? color : theme === "dark" ? "white" : "black",
          }}
        >
          {value}
        </div>
        <p className="absolute bottom-6 w-5/6 text-xl text-center font-medium">
          {description}
        </p>
        <div className="absolute bottom-0.5 left-2 text-xs text-blue-400 flex items-center gap-1">
          <RefreshCw size={12} />
          <span>Update Now</span>
        </div>
      </CardContent>
    </Card>
  );
};
export default StatsCard;
