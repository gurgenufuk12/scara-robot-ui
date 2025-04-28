import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppSelector } from "@/store/hooks";
import { useConnection } from "@/contexts/ConnectionContext";

const API_URL = "http://localhost:8000/api/robot";

// Tüm olası Kartezyen eksenleri tanımlama
const CARTESIAN_AXES = ["x", "y", "z", "roll", "pitch", "yaw"];

export default function CartesianControl() {
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);
  const { getApiUrl, isConnected } = useConnection(); // Context'ten al
  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;

  const [debug, setDebug] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<{
    axis: string | null;
    direction: string | null;
  }>({ axis: null, direction: null });

  const intervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Eksen sayısına göre gösterilecek eksenleri belirleme
  const getVisibleAxes = () => {
    if (axisCount === 2) {
      return CARTESIAN_AXES.slice(0, 2); // Sadece X ve Y
    } else if (axisCount === 6) {
      return CARTESIAN_AXES; // Tüm eksenler: X, Y, Z, Roll, Pitch, Yaw
    } else {
      // Diğer eksen sayıları için - eksen sayısı kadar göster
      return CARTESIAN_AXES.slice(
        0,
        Math.min(axisCount, CARTESIAN_AXES.length)
      );
    }
  };

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach((interval) => {
        clearInterval(interval);
      });
    };
  }, []);

  const sendCartesianValueToAPI = (axis: string, value: number) => {
    const apiUrl = getApiUrl("update-cartesian-value"); // Dinamik URL al
    if (!selectedRobotId || !apiUrl || !isConnected) return;

    setLoading(true);
    console.log(`API'ye ${axis} eksenine ${value} değeri gönderiliyor...`);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        robotId: selectedRobotId,
        axis,
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

  const handleButtonDown = (axis: string, increment: boolean) => {
    const buttonKey = `${axis}_${increment ? "inc" : "dec"}`;
    const direction = increment ? "inc" : "dec";

    if (intervalsRef.current[buttonKey]) {
      clearInterval(intervalsRef.current[buttonKey]);
      delete intervalsRef.current[buttonKey];
    }

    setActiveButton({ axis, direction });

    sendCartesianValueToAPI(axis, increment ? 1 : -1);

    intervalsRef.current[buttonKey] = setInterval(() => {
      sendCartesianValueToAPI(axis, increment ? 1 : -1);
    }, 100);
  };

  const handleButtonUp = (axis: string, increment: boolean) => {
    const buttonKey = `${axis}_${increment ? "inc" : "dec"}`;
    const direction = increment ? "inc" : "dec";

    if (intervalsRef.current[buttonKey]) {
      clearInterval(intervalsRef.current[buttonKey]);
      delete intervalsRef.current[buttonKey];
    }

    if (activeButton.axis === axis && activeButton.direction === direction) {
      setActiveButton({ axis: null, direction: null });
      sendCartesianValueToAPI(axis, 0);
    }
  };

  const handleTouchStart = (
    e: React.TouchEvent,
    axis: string,
    increment: boolean
  ) => {
    e.preventDefault();
    handleButtonDown(axis, increment);
  };

  const handleTouchEnd = (
    e: React.TouchEvent,
    axis: string,
    increment: boolean
  ) => {
    e.preventDefault();
    handleButtonUp(axis, increment);
  };

  const handleTouchCancel = (
    e: React.TouchEvent,
    axis: string,
    increment: boolean
  ) => {
    e.preventDefault();
    handleButtonUp(axis, increment);
  };

  const renderCartesianControl = (axis: string) => {
    const axisLabel = axis.charAt(0).toUpperCase() + axis.slice(1);

    return (
      <div key={axis} className="mb-4 bg-gray-700 rounded-lg p-4 shadow-inner">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold text-lg">{axisLabel}</h3>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            onMouseDown={() => handleButtonDown(axis, false)}
            onMouseUp={() => handleButtonUp(axis, false)}
            onMouseLeave={() => handleButtonUp(axis, false)}
            onTouchStart={(e) => handleTouchStart(e, axis, false)}
            onTouchEnd={(e) => handleTouchEnd(e, axis, false)}
            onTouchCancel={(e) => handleTouchCancel(e, axis, false)}
            disabled={loading || !selectedRobotId}
            className={`bg-red-600 hover:bg-red-700 w-1/2 py-3 text-lg font-bold`}
          >
            -
          </Button>

          <Button
            onMouseDown={() => handleButtonDown(axis, true)}
            onMouseUp={() => handleButtonUp(axis, true)}
            onMouseLeave={() => handleButtonUp(axis, true)}
            onTouchStart={(e) => handleTouchStart(e, axis, true)}
            onTouchEnd={(e) => handleTouchEnd(e, axis, true)}
            onTouchCancel={(e) => handleTouchCancel(e, axis, true)}
            disabled={loading || !selectedRobotId}
            className={`bg-green-600 hover:bg-green-700 w-1/2 py-3 text-lg font-bold`}
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
          Kartezyen Kontrol Paneli
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
          {getVisibleAxes().map((axis) => renderCartesianControl(axis))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getVisibleAxes().map((axis) => renderCartesianControl(axis))}
        </div>
      )}

      {/* {debug && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg text-sm text-gray-200">
          {debug}
        </div>
      )} */}
    </Card>
  );
}
