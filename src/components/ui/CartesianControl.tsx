import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function CartesianControl({
  selectedRobot,
}: {
  selectedRobot: string;
}) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <Card className="bg-gray-800 p-5 rounded-xl shadow-md">
      <CardContent>
        <h2 className="text-xl font-semibold">Kartezyen Kontrol</h2>
        <div className="mt-4 flex items-center gap-2">
          <label>X Koordinat</label>
          <Button onClick={() => setX(x - 1)} disabled={!selectedRobot}>
            -
          </Button>
          <span>{x}</span>
          <Button onClick={() => setX(x + 1)} disabled={!selectedRobot}>
            +
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <label>Y Koordinat</label>
          <Button onClick={() => setY(y - 1)} disabled={!selectedRobot}>
            -
          </Button>
          <span>{y}</span>
          <Button onClick={() => setY(y + 1)} disabled={!selectedRobot}>
            +
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
