import type { ReactNode } from "react";

type StatusCardProps = {
  icon?: ReactNode;
  data: number;
  color: string; // e.g. "bg-red-500", "bg-teal-600"
  label?: string;
};

const StatusCard = ({ icon, data, color, label }: StatusCardProps) => {
  return (
    <div
      className={`flex items-center gap-4 rounded p-4 text-white ${color}`}
      role="region"
      aria-label={label}
    >
      {icon && <div className="text-2xl">{icon}</div>}
      <div>
        <div className="text-3xl font-bold">{data}</div>
        {label && <div className="text-sm">{label}</div>}
      </div>
    </div>
  );
};

export default StatusCard;
