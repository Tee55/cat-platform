
type SeverityCardProps = {
  handleOpen: (visible: { name: string; value: number; color: string }) => void;
  entry: {
    name: string;
    value: number;
    color: string;
  };
  style?: string;
}

export const SeverityCard = ({ handleOpen, entry, style = "" }: SeverityCardProps) => {
  return (
    <div
      onClick={() => handleOpen(entry)}
      className={`flex flex-col items-center rounded-md p-1 border-2 w-full cursor-pointer ${style}`}
      style={{ borderColor: entry.color, backgroundColor: entry.color }}
    >
      <span style={{ color: "black" }}>{entry.name}</span>
      <span style={{ color: "black" }}>{entry.value}</span>
    </div>
  );
};
