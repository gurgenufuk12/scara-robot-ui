import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleMotor, setAllMotors, toggleAllMotors } from "@/store/robotSlice";
const API_URL = "http://localhost:8000/api/robot";

export default function MotorControl() {
  const dispatch = useAppDispatch();
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);

  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  // const axisCount = selectedRobot ? selectedRobot.axisCount : 0;
  const motorStatus = selectedRobot ? selectedRobot.motors : {};
  const motors = selectedRobot ? selectedRobot.motors : {};

  const [blink, setBlink] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleToggleMotor = (motorId: string) => {
    if (!selectedRobotId) return;

    setLoading(true);
    try {
      fetch(`${API_URL}/toggle_${selectedRobotId}_${motorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedRobotId, motorId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          dispatch(
            toggleMotor({
              robotId: selectedRobotId,
              motorId,
            })
          );
        })
        .catch((error) => {
          console.error("Robot seçimi hatası:", error);
        });
    } finally {
      setLoading(false);
    }
  };

  const handleTurnAllMotorsOn = () => {
    if (!selectedRobotId) return;

    setLoading(true);
    try {
      fetch(`${API_URL}/toggle-all-motors-on`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          dispatch(
            setAllMotors({
              robotId: selectedRobotId,
              status: true,
            })
          );
          console.log("Tüm motorlar açıldı:", data);
        })
        .catch((error) => {
          console.error("Motor açma hatası:", error);
        });
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyStop = () => {
    setLoading(true);
    try {
      fetch(`${API_URL}/emergency-stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          dispatch(
            toggleAllMotors({
              robotId: selectedRobotId,
              status: false,
            })
          );
          console.log("Tüm motorlar kapandı", data);
        })
        .catch((error) => {
          console.error("Motor kapatma hatası:", error);
        });
    } finally {
      setLoading(false);
    }
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

  const MotorControl = ({
    motorId,
    label,
  }: {
    motorId: string;
    label: string;
  }) => {
    const isActive = motorStatus[motorId] || false;

    return (
      <div className="flex flex-row">
        <span className="text-xl text-gray-400">{label}</span>
        <div className="flex items-center">
          <StatusIndicator isActive={isActive} />
          <Switch
            checked={isActive}
            onCheckedChange={() => handleToggleMotor(motorId)}
            disabled={loading}
          />
        </div>
      </div>
    );
  };

  if (!selectedRobot) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 bg-gray-700 p-3 rounded-md border border-gray-600 shadow-inner">
      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 rounded">
          <div className="bg-gray-800 px-4 py-2 rounded text-sm text-white">
            İşlem yapılıyor...
          </div>
        </div>
      )}

      <div className="mr-3 pr-3">
        <div className="text-sm font-medium text-white mb-1">
          {selectedRobot.name}
        </div>
        <div className="flex items-center">
          <div
            className={`h-2 w-2 rounded-full ${
              selectedRobot.isConnected ? "bg-green-500" : "bg-red-500"
            } mr-1`}
          ></div>
          <span className="text-xs text-gray-300">
            {selectedRobot.isConnected ? "Bağlı" : "Bağlantı Yok"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-3">
          {Object.keys(motors).map((motorId) => (
            <MotorControl
              key={motorId}
              motorId={motorId}
              label={`J${motorId.slice(-1)}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleTurnAllMotorsOn}
          className="bg-green-600 hover:bg-green-700 py-1 px-2 text-xs"
          disabled={loading}
        >
          Tümünü Aç
        </Button>
        <Button
          onClick={handleEmergencyStop}
          className="bg-red-600 hover:bg-red-700 py-1 px-2 text-xs border border-yellow-500"
          disabled={loading}
        >
          Acil Stop
        </Button>
      </div>
    </div>
  );
}
