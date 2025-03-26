import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function JointControl({
  selectedRobot,
}: {
  selectedRobot: string;
}) {
  const [joint1, setJoint1] = useState(0);
  const [joint2, setJoint2] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleButtonDown = (action: () => void): void => {
    action();
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Start a new interval that will continue indefinitely
    intervalRef.current = setInterval(action, 100);
  };

  const handleButtonUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const renderJointControl = (
    jointNumber: number,
    value: number,
    setValue: React.Dispatch<React.SetStateAction<number>>
  ) => {
    return (
      <div className="mb-4 bg-gray-700 rounded-lg p-4 shadow-inner">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold text-lg">
            Eksen {jointNumber}
          </h3>
          <div className="bg-gray-800 px-3 py-1 rounded-md text-blue-400 font-mono">
            {value}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            onMouseDown={() =>
              handleButtonDown(() => setValue((prev) => prev - 1))
            }
            onMouseUp={handleButtonUp}
            onMouseLeave={handleButtonUp}
            onTouchStart={() =>
              handleButtonDown(() => setValue((prev) => prev - 1))
            }
            onTouchEnd={handleButtonUp}
            disabled={!selectedRobot}
            className="bg-red-600 hover:bg-red-700 w-1/2 py-3 text-lg font-bold"
          >
            -
          </Button>

          <Button
            onMouseDown={() =>
              handleButtonDown(() => setValue((prev) => prev + 1))
            }
            onMouseUp={handleButtonUp}
            onMouseLeave={handleButtonUp}
            onTouchStart={() =>
              handleButtonDown(() => setValue((prev) => prev + 1))
            }
            onTouchEnd={handleButtonUp}
            disabled={!selectedRobot}
            className="bg-green-600 hover:bg-green-700 w-1/2 py-3 text-lg font-bold"
          >
            +
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 w-1/3">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl text-white font-bold">Eksen Kontrol Paneli</h2>
        {selectedRobot && (
          <div className="bg-blue-900 px-3 py-1 rounded-md text-blue-200">
            Robot: {selectedRobot}
          </div>
        )}
      </div>

      {renderJointControl(1, joint1, setJoint1)}
      {renderJointControl(2, joint2, setJoint2)}

      <div className="mt-6 flex justify-end gap-4">
        <Button
          onClick={() => {
            setJoint1(0);
            setJoint2(0);
          }}
          disabled={!selectedRobot}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          Sıfırla
        </Button>
        <Button
          onClick={() => console.log("Hareketi Uygula", { joint1, joint2 })}
          disabled={!selectedRobot}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Hareketi Uygula
        </Button>
      </div>
    </Card>
  );
}
