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
    // Log ekleyerek sorunu daha iyi anlayabiliriz
    console.log(
      `Button down: ${increment ? "+" : "-"} for joint ${jointIndex}`
    );

    const buttonKey = `joint${jointIndex}_${increment ? "inc" : "dec"}`;

    // Eğer bu tuş için zaten bir interval varsa, önce onu temizle
    if (intervalsRef.current[buttonKey]) {
      clearInterval(intervalsRef.current[buttonKey]);
      delete intervalsRef.current[buttonKey];
    }

    // İlk değeri hemen gönder (0 değil, direkt +1 veya -1)
    sendJointValueToAPI(jointIndex, increment ? 1 : -1);

    // Basılı tutma için interval oluştur
    intervalsRef.current[buttonKey] = setInterval(() => {
      sendJointValueToAPI(jointIndex, increment ? 1 : -1);
    }, 100);
  };

  // Buton bırakıldığında çağrılır
  const handleButtonUp = (jointIndex: number, increment: boolean) => {
    console.log(`Button up: ${increment ? "+" : "-"} for joint ${jointIndex}`);

    const buttonKey = `joint${jointIndex}_${increment ? "inc" : "dec"}`;

    // Interval'ı temizle
    if (intervalsRef.current[buttonKey]) {
      clearInterval(intervalsRef.current[buttonKey]);
      delete intervalsRef.current[buttonKey];
    }

    // Buton bırakıldığında 0 değeri gönder
    sendJointValueToAPI(jointIndex, 0);
  };

  // Dokunmatik olaylar için özel işleyiciler
  const handleTouchStart = (
    e: React.TouchEvent,
    jointIndex: number,
    increment: boolean
  ) => {
    // Varsayılan davranışı engelle
    e.preventDefault();

    console.log(
      `Touch start: ${increment ? "+" : "-"} for joint ${jointIndex}`
    );

    // Dokunmatik olay için buton basma işlevini çağır
    handleButtonDown(jointIndex, increment);
  };

  const handleTouchEnd = (
    e: React.TouchEvent,
    jointIndex: number,
    increment: boolean
  ) => {
    // Varsayılan davranışı engelle
    e.preventDefault();

    console.log(`Touch end: ${increment ? "+" : "-"} for joint ${jointIndex}`);

    // Dokunmatik olay için buton bırakma işlevini çağır
    handleButtonUp(jointIndex, increment);
  };

  const handleTouchCancel = (
    e: React.TouchEvent,
    jointIndex: number,
    increment: boolean
  ) => {
    // Varsayılan davranışı engelle
    e.preventDefault();

    console.log(
      `Touch cancel: ${increment ? "+" : "-"} for joint ${jointIndex}`
    );

    // Dokunmatik olay iptal edildiğinde buton bırakma işlevini çağır
    handleButtonUp(jointIndex, increment);
  };

  const renderJointControl = (jointIndex: number) => {
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
            onMouseDown={() => handleButtonDown(jointIndex, false)} // Fare için "-" butonu
            onMouseUp={() => handleButtonUp(jointIndex, false)}
            onMouseLeave={() => handleButtonUp(jointIndex, false)}
            onTouchStart={(e) => handleTouchStart(e, jointIndex, false)} // Dokunmatik için "-" butonu - event nesnesini geçiriyoruz
            onTouchEnd={(e) => handleTouchEnd(e, jointIndex, false)}
            onTouchCancel={(e) => handleTouchCancel(e, jointIndex, false)} // Bu olay dokunma iptal edildiğinde tetiklenir
            disabled={loading || !selectedRobotId}
            className={`bg-red-600 hover:bg-red-700 w-1/2 py-3 text-lg font-bold`}
          >
            -
          </Button>

          <Button
            onMouseDown={() => handleButtonDown(jointIndex, true)} // Fare için "+" butonu
            onMouseUp={() => handleButtonUp(jointIndex, true)}
            onMouseLeave={() => handleButtonUp(jointIndex, true)}
            onTouchStart={(e) => handleTouchStart(e, jointIndex, true)} // Dokunmatik için "+" butonu - event nesnesini geçiriyoruz
            onTouchEnd={(e) => handleTouchEnd(e, jointIndex, true)}
            onTouchCancel={(e) => handleTouchCancel(e, jointIndex, true)} // Bu olay dokunma iptal edildiğinde tetiklenir
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

      {debug && (
        <div className="flex justify-end bg-gray-500 text-red-500 text-xl p-2 mb-2 rounded font-bold">
          Debug: {debug}
        </div>
      )}

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
