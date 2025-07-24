import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

type LabelCardProps = {
  data: unknown[];
  label?: string;
  color?: string;
  description?: ReactNode;
}

export const LabelCard = (props: LabelCardProps) => {
  const { data, color, label, description } = props;
  return (
    <Card>
      <CardContent className="p-2 sm:p-4">
        <div className={`${color}`}>
          <p>{label}</p>
          <strong className="text-3xl block">{data.length}</strong>
        </div>
        {description}
      </CardContent>
    </Card>
  );
};
