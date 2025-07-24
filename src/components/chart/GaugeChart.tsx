import { useTheme } from "next-themes";
import GaugeChartLib from "react-gauge-chart";

type GaugeChartProps = {
  value: number;
  maxValue: number;
  color: string;
  title?: string;
  subtitle?: string;
};

export const GaugeChart: React.FC<Partial<GaugeChartProps>> = ({
  value = 0,
  maxValue = 100,
  color = "#AAFF66",
  subtitle = "",
}) => {
  const safeValue = Number(value);
  const safeMax = Number(maxValue);

  const percent =
    Number.isFinite(safeValue) && Number.isFinite(safeMax) && safeMax > 0
      ? Math.min(safeValue / safeMax, 1)
      : 0;
  const { theme } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <GaugeChartLib
        id="gauge-chart"
        percent={percent}
        colors={["#FF6666", "#FFAA66", color]}
        textColor="#fff"
        needleColor={theme === "dark" ? "white" : "black"}
        needleBaseColor={theme === "dark" ? "white" : "black"}
        animate={false}
        hideText={true}
      />
      <div className="text-center mt-2">
        <div className="text-2xl font-bold" style={{ color }}>
          {safeValue}
        </div>
        <div className="text-sm text-gray-400">{subtitle}</div>
      </div>
    </div>
  );
};
