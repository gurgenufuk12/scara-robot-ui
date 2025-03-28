import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";

const API_BASE_URL = "http://localhost:5114/api/robot";

export default function MotorControl() {
  const [motorStatus, setMotorStatus] = useState<{ [key: string]: boolean }>({
    robot1_motor1: false,
    robot1_motor2: false,
    robot2_motor1: false,
    robot2_motor2: false,
  });

  const [blink, setBlink] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch initial motor status when component mounts
  useEffect(() => {
    fetchMotorStatus();

    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Get current motor status from the backend
  const fetchMotorStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/robot-status`);
      if (response.ok) {
        const data = await response.json();
        setMotorStatus(data);
      } else {
        console.error("Failed to fetch motor status");
      }
    } catch (error) {
      console.error("Error fetching motor status:", error);
    }
  };

  // Toggle individual motor
  const toggleMotor = async (
    robot: "robot1" | "robot2",
    motor: "motor1" | "motor2"
  ) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/toggle-${robot}-${motor}`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setMotorStatus((prev) => ({
          ...prev,
          [`${robot}_${motor}`]: data.durum,
        }));
      }
    } catch (error) {
      console.error(`Error toggling ${robot} ${motor}:`, error);
    } finally {
      setLoading(false);
    }
  };
  // Turn all motors on
  const turnAllMotorsOn = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/turn-on-all-motors`, {
        method: "POST",
      });
      console.log("response", response);

      if (response.ok) {
        const data = await response.json();
        setMotorStatus(data.status);
      }
    } catch (error) {
      console.error("Error turning on all motors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Turn all motors off
  const turnAllMotorsOff = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/turn-off-all-motors`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setMotorStatus(data.status);
      }
    } catch (error) {
      console.error("Error turning off all motors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle all motors to a specified state
  const toggleAllMotors = (state: boolean) => {
    if (state) {
      turnAllMotorsOn();
    } else {
      turnAllMotorsOff();
    }
  };

  // Emergency stop - turn off all motors
  const emergencyStop = () => {
    turnAllMotorsOff();
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
      {loading && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
          İşlem yapılıyor...
        </div>
      )}

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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => toggleAllMotors(true)}
          className="bg-green-600 hover:bg-green-700 py-1 px-2 text-xs"
          disabled={loading}
        >
          Tümünü Aç
        </Button>
        <Button
          onClick={emergencyStop}
          className="bg-red-600 hover:bg-red-700 py-1 px-2 text-xs border border-yellow-500"
          disabled={loading}
        >
          Acil Stop
        </Button>
      </div>
    </div>
  );
}
