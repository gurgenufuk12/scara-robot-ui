import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppSelector } from "@/store/hooks";

const API_URL = "http://localhost:8000/api/robot";

export default function JointControl() {
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);
  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;

  const [debug, setDebug] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<{
    jointIndex: number | null;
    direction: string | null;
  }>({ jointIndex: null, direction: null });

  const intervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach((interval) => {
        clearInterval(interval);
      });
    };
  }, []);

  const sendJointValueToAPI = (jointIndex: number, value: number) => {
    if (!selectedRobotId) return;
    if (!selectedRobot?.motors[`motor${jointIndex + 1}`]) {
      setDebug(`Motor${jointIndex} kapalı, lütfen motoru açın.`);

      return;
    }
    setLoading(true);
    fetch(`${API_URL}/update-joint-value`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        robotId: selectedRobotId,
        jointIndex,
        value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setDebug(`${JSON.stringify(data.message).replace(/"/g, "")}`);
      })
      .catch((error) => {
        setDebug(`API hatası: ${error.message}`);
        console.error("API hatası:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleButtonDown = (jointIndex: number, increment: boolean) => {
    const buttonKey = `joint${jointIndex}_${increment ? "inc" : "dec"}`;
    const direction = increment ? "inc" : "dec";

    if (intervalsRef.current[buttonKey]) {
      clearInterval(intervalsRef.current[buttonKey]);
      delete intervalsRef.current[buttonKey];
    }

    setActiveButton({ jointIndex, direction });

    sendJointValueToAPI(jointIndex, increment ? 1 : -1);

    intervalsRef.current[buttonKey] = setInterval(() => {
      sendJointValueToAPI(jointIndex, increment ? 1 : -1);
    }, 100);
  };

  const handleButtonUp = (jointIndex: number, increment: boolean) => {
    const buttonKey = `joint${jointIndex}_${increment ? "inc" : "dec"}`;
    const direction = increment ? "inc" : "dec";

    if (intervalsRef.current[buttonKey]) {
      clearInterval(intervalsRef.current[buttonKey]);
      delete intervalsRef.current[buttonKey];
    }

    if (
      activeButton.jointIndex === jointIndex &&
      activeButton.direction === direction
    ) {
      setActiveButton({ jointIndex: null, direction: null });
      sendJointValueToAPI(jointIndex, 0);
    }
  };

  const handleTouchStart = (
    e: React.TouchEvent,
    jointIndex: number,
    increment: boolean
  ) => {
    e.preventDefault();
    handleButtonDown(jointIndex, increment);
  };

  const handleTouchEnd = (
    e: React.TouchEvent,
    jointIndex: number,
    increment: boolean
  ) => {
    e.preventDefault();
    handleButtonUp(jointIndex, increment);
  };

  const handleTouchCancel = (
    e: React.TouchEvent,
    jointIndex: number,
    increment: boolean
  ) => {
    e.preventDefault();
    handleButtonUp(jointIndex, increment);
  };

  const renderJointControl = (jointIndex: number) => {
    const motorActive =
      selectedRobot?.motors[`motor${jointIndex + 1}`] ?? false;
    return (
      <div
        key={jointIndex}
        className="mb-4 bg-gray-700 rounded-lg p-4 shadow-inner"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold text-lg">
            Eksen {jointIndex + 1}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            onMouseDown={() => handleButtonDown(jointIndex, false)}
            onMouseUp={() => handleButtonUp(jointIndex, false)}
            onMouseLeave={() => handleButtonUp(jointIndex, false)}
            onTouchStart={(e) => handleTouchStart(e, jointIndex, false)}
            onTouchEnd={(e) => handleTouchEnd(e, jointIndex, false)}
            onTouchCancel={(e) => handleTouchCancel(e, jointIndex, false)}
            disabled={loading || !selectedRobotId || !motorActive}
            className={`bg-red-600 hover:bg-red-700 w-1/2 py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            -
          </Button>

          <Button
            onMouseDown={() => handleButtonDown(jointIndex, true)}
            onMouseUp={() => handleButtonUp(jointIndex, true)}
            onMouseLeave={() => handleButtonUp(jointIndex, true)}
            onTouchStart={(e) => handleTouchStart(e, jointIndex, true)}
            onTouchEnd={(e) => handleTouchEnd(e, jointIndex, true)}
            onTouchCancel={(e) => handleTouchCancel(e, jointIndex, true)}
            disabled={loading || !selectedRobotId || !motorActive}
            className={`bg-green-600 hover:bg-green-700 w-1/2 py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            +
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl text-white font-bold">
          Eksen Kontrol Paneli
          {axisCount > 0 && (
            <span className="ml-2 bg-blue-900 px-2 py-0.5 text-xs rounded-full">
              {axisCount} Eksen
            </span>
          )}
        </h2>
        {selectedRobotId && (
          <div className="bg-blue-900 px-3 py-1 rounded-md text-blue-200">
            Robot: {selectedRobot?.name || selectedRobotId}
          </div>
        )}
      </div>

      {!selectedRobotId ? (
        <div className="text-center text-gray-400 py-8">
          Lütfen bir robot seçin
        </div>
      ) : axisCount <= 3 ? (
        <div>
          {Array.from({ length: axisCount }, (_, i) => renderJointControl(i))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: axisCount }, (_, i) => renderJointControl(i))}
        </div>
      )}
    </Card>
  );
}
