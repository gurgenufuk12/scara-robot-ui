import { useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CartesianControl() {
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);

  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;

  // Kartezyen koordinatlar için durumlar
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    z: 0,
    roll: 0,
    pitch: 0,
    yaw: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef<boolean>(false);

  const handleButtonDown = (
    axis: keyof typeof position,
    increment: boolean
  ): void => {
    // Mevcut durumu temizle
    handleButtonUp();

    // Aktif duruma geçir
    isActiveRef.current = true;

    // Değişiklik fonksiyonu
    const updatePosition = () => {
      setPosition((prev) => ({
        ...prev,
        [axis]: increment ? prev[axis] + 1 : prev[axis] - 1,
      }));
    };

    // İlk değişikliği hemen yap
    updatePosition();

    // Interval ayarla
    intervalRef.current = setInterval(() => {
      if (isActiveRef.current) {
        updatePosition();
      }
    }, 100);
  };

  const handleButtonUp = () => {
    // Aktif durumu kapat
    isActiveRef.current = false;

    // Mevcut interval'ı temizle
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const renderAxisControl = (axis: keyof typeof position, label: string) => {
    const value = position[axis];
    const showRotationControls =
      axis === "roll" || axis === "pitch" || axis === "yaw";

    // 2 eksenli robotlarda sadece X, Y eksenlerini göster
    if (axisCount === 2 && (axis === "z" || showRotationControls)) {
      return null;
    }

    return (
      <div className="bg-gray-700 rounded-lg p-3 shadow-inner">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
              <span className="text-blue-400 font-bold">
                {axis.toUpperCase()}
              </span>
            </div>
            <h3 className="text-white font-medium">{label}</h3>
          </div>
          <div className="bg-gray-800 px-3 py-1 rounded-md text-blue-400 font-mono">
            {value} {showRotationControls ? "°" : "mm"}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onMouseDown={() => handleButtonDown(axis, false)}
            onMouseUp={handleButtonUp}
            onMouseLeave={handleButtonUp}
            disabled={!selectedRobotId}
            className="bg-red-600 hover:bg-red-700 w-1/2 py-2 text-lg font-bold rounded-md text-white"
          >
            -
          </button>
          <button
            onMouseDown={() => handleButtonDown(axis, true)}
            onMouseUp={handleButtonUp}
            onMouseLeave={handleButtonUp}
            disabled={!selectedRobotId}
            className="bg-green-600 hover:bg-green-700 w-1/2 py-2 text-lg font-bold rounded-md text-white"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl text-white font-bold">
          Kartezyen Kontrol
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
      ) : (
        <>
          <div className="mb-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
            <div className="grid grid-cols-3 gap-3">
              {renderAxisControl("x", "X Ekseni")}
              {renderAxisControl("y", "Y Ekseni")}
              {renderAxisControl("z", "Z Ekseni")}
            </div>
          </div>

          {axisCount === 6 && (
            <div className="mb-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
              <h3 className="text-sm text-gray-400 mb-2">Oryantasyon</h3>
              <div className="grid grid-cols-3 gap-3">
                {renderAxisControl("roll", "Roll")}
                {renderAxisControl("pitch", "Pitch")}
                {renderAxisControl("yaw", "Yaw")}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-4">
            <Button
              onClick={() =>
                setPosition({ x: 0, y: 0, z: 0, roll: 0, pitch: 0, yaw: 0 })
              }
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Sıfırla
            </Button>
            <Button
              onClick={() => console.log("Hareketi Uygula", position)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Hareketi Uygula
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
