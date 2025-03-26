import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";

export default function MotorControl() {
  const [motorStatus, setMotorStatus] = useState<{ [key: string]: boolean }>({
    robot1_motor1: false,
    robot1_motor2: false,
    robot2_motor1: false,
    robot2_motor2: false,
  });

  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  const toggleMotor = (
    robot: "robot1" | "robot2",
    motor: "motor1" | "motor2"
  ) => {
    const key = `${robot}_${motor}`;
    setMotorStatus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAllMotors = (state: boolean) => {
    setMotorStatus({
      robot1_motor1: state,
      robot1_motor2: state,
      robot2_motor1: state,
      robot2_motor2: state,
    });
  };

  const emergencyStop = () => {
    toggleAllMotors(false);
    console.log("EMERGENCY STOP ACTIVATED");
  };

  const StatusIndicator = ({ isActive }: { isActive: boolean }) => {
    const blinkingClass = !isActive && blink ? "opacity-30" : "opacity-100";

    return (
      <div
        className={`h-2 w-2 rounded-full mr-1 transition-opacity ${
          isActive ? "bg-green-500" : `bg-red-500 ${blinkingClass}`
        }`}
      ></div>
    );
  };

  return (
    <div className="flex items-center gap-3 bg-gray-200 p-2 rounded-md">
      <div className="flex items-center gap-2 border-r pr-3 border-gray-300">
        <div className="text-xs font-medium text-black font-sans">Robot 1:</div>
        <div className="flex items-center">
          <div className="flex flex-col items-center mx-1">
            <span className="text-[10px] text-gray-500">J1</span>
            <div className="flex items-center">
              <StatusIndicator isActive={motorStatus.robot1_motor1} />
              <Switch
                checked={motorStatus.robot1_motor1}
                onCheckedChange={() => toggleMotor("robot1", "motor1")}
              />
            </div>
          </div>
          <div className="flex flex-col items-center mx-1">
            <span className="text-[10px] text-gray-500">J2</span>
            <div className="flex items-center">
              <StatusIndicator isActive={motorStatus.robot1_motor2} />
              <Switch
                checked={motorStatus.robot1_motor2}
                onCheckedChange={() => toggleMotor("robot1", "motor2")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-r pr-3 border-gray-300">
        <div className="text-xs font-medium text-black font-sans">Robot 2:</div>
        <div className="flex items-center">
          <div className="flex flex-col items-center mx-1">
            <span className="text-[10px] text-gray-500">J1</span>
            <div className="flex items-center">
              <StatusIndicator isActive={motorStatus.robot2_motor1} />
              <Switch
                checked={motorStatus.robot2_motor1}
                onCheckedChange={() => toggleMotor("robot2", "motor1")}
              />
            </div>
          </div>
          <div className="flex flex-col items-center mx-1">
            <span className="text-[10px] text-gray-500">J2</span>
            <div className="flex items-center">
              <StatusIndicator isActive={motorStatus.robot2_motor2} />
              <Switch
                checked={motorStatus.robot2_motor2}
                onCheckedChange={() => toggleMotor("robot2", "motor2")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => toggleAllMotors(true)}
          className="bg-green-600 hover:bg-green-700 py-1 px-2 text-xs"
        >
          Tümünü Aç
        </Button>
        <Button
          onClick={emergencyStop}
          className="bg-red-600 hover:bg-red-700 py-1 px-2 text-xs border border-yellow-500"
        >
          Acil Stop
        </Button>
      </div>
    </div>
  );
}
