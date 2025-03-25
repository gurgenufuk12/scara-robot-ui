import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function RobotSelector({
  setSelectedRobot,
}: {
  setSelectedRobot: (robot: string) => void;
}) {
  const [robot, setRobot] = useState("robot1");

  const handleSelect = (robotName: string) => {
    setRobot(robotName);
    setSelectedRobot(robotName);
  };

  return (
    <div className="flex gap-4 p-4">
      <Button
        onClick={() => handleSelect("robot1")}
        className={robot === "robot1" ? "bg-green-700" : "bg-gray-600"}
      >
        Robot 1
      </Button>
      <Button
        onClick={() => handleSelect("robot2")}
        className={robot === "robot2" ? "bg-green-700" : "bg-gray-600"}
      >
        Robot 2
      </Button>
    </div>
  );
}
