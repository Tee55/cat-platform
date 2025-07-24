import Link from "next/link";
import { Card } from "../ui/card";
import {
  FaExclamationCircle,
  FaFireAlt,
  FaProjectDiagram,
  FaRegCheckCircle,
  FaRegSmile,
} from "react-icons/fa";
import { useMyContext } from "@/util/context";

export const ProjectCard = ({
  name,
  assets,
  critical,
  high,
  medium,
  low,
}: {
  name: string;
  assets: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}) => {
  const context = useMyContext();
  function handleClick(name: string) {
    context?.setZone?.(name);
  }
  return (
    <Card className="border rounded-3xl p-7 flex flex-col items-center hover:scale-105 transition-transform duration-200">
      <div className="flex items-center gap-2 mb-2">
        <FaProjectDiagram className="text-[#F26C20] text-2xl" />
        <span className="text-xl font-bold">{name}</span>
      </div>
      <span className="text-lg text-blue-700 underline mb-3">
        Assets: {assets}
      </span>
      <div className="flex gap-2 text-sm mb-2">
        <span className="flex items-center gap-1">
          <FaExclamationCircle className="text-red-700" />
          {critical}
        </span>
        <span className="flex items-center gap-1">
          <FaFireAlt className="text-red-400" />
          {high}
        </span>
        <span className="flex items-center gap-1">
          <FaRegSmile className="text-blue-400" />
          {medium}
        </span>
        <span className="flex items-center gap-1">
          <FaRegCheckCircle className="text-yellow-400" />
          {low}
        </span>
      </div>
      <Link href="/asset">
        <button
          onClick={() => handleClick(name)}
          className="mt-2 px-5 py-2 bg-[#F26C20] text-white rounded-xl font-semibold shadow hover:bg-orange-500 transition"
        >
          View Assets
        </button>
      </Link>
    </Card>
  );
};
