import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function JointControl({
  selectedRobot,
}: {
  selectedRobot: string;
}) {
  const [joint1, setJoint1] = useState(0);
  const [joint2, setJoint2] = useState(0);

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-semibold">Eksen Kontrol</h2>
        <div className="mt-4 flex items-center gap-2">
          <label>Joint 1</label>
          <Button
            onClick={() => setJoint1(joint1 - 1)}
            disabled={!selectedRobot}
          >
            -
          </Button>
          <span>{joint1}</span>
          <Button
            onClick={() => setJoint1(joint1 + 1)}
            disabled={!selectedRobot}
          >
            +
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <label>Joint 2</label>
          <Button
            onClick={() => setJoint2(joint2 - 1)}
            disabled={!selectedRobot}
          >
            -
          </Button>
          <span>{joint2}</span>
          <Button
            onClick={() => setJoint2(joint2 + 1)}
            disabled={!selectedRobot}
          >
            +
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
