import { Box } from "@radix-ui/themes";
import type { ReactNode } from "react";

type StatusCardProps = {
  icon?: ReactNode;
  data: number;
  color: string;
  label?: string;
}

const StatusCard = (props: StatusCardProps) => {
  const { icon, data, color, label } = props;
  return (
    <Box 
      className={`bg-gradient-to-br ${color} text-white flex-1 min-w-0 rounded-lg shadow-sm`}
      p="2"
      style={{ minWidth: 0 }}
    >
      <div className="sm:p-4 p-2 flex items-center">
        {icon ?? null}
        <div>
          <p className="text-xs sm:text-sm">
            {label}
            <br />
            <strong className="text-xl sm:text-2xl">{data}</strong>
          </p>
        </div>
      </div>
    </Box>
  );
};

export default StatusCard;