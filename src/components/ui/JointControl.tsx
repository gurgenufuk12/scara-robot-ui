import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateJointValue, resetJoints } from "@/store/robotSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function JointControl() {
  const dispatch = useAppDispatch();
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);

  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;
  const jointValues = selectedRobot ? selectedRobot.jointValues : [];

  // Basit bir durum ekleyelim, bu sorunla ilgili debug için
  const [debug, setDebug] = useState<string>("");

  // Interval ve basılı tutma durumu için ref'ler
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeJointRef = useRef<{ index: number; increment: boolean } | null>(null);

  // Component unmount olduğunda interval'ı temizle
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Buton basılı tutulduğunda değer değiştirme fonksiyonu
  const changeJointValue = (jointIndex: number, increment: boolean) => {
    if (!selectedRobotId) return;

    const currentValue = jointValues[jointIndex] || 0;
    const newValue = increment ? currentValue + 1 : currentValue - 1;

    setDebug(`Joint ${jointIndex + 1}: ${currentValue} -> ${newValue}`);

    dispatch(
      updateJointValue({
        robotId: selectedRobotId,
        jointIndex,
        value: newValue,
      })
    );
  };

  // Buton basılı tutulduğunda çağrılır
  const handleButtonDown = (jointIndex: number, increment: boolean) => {
    // Mevcut interval'ı temizle
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Aktif joint bilgisini kaydet
    activeJointRef.current = { index: jointIndex, increment };

    // İlk değişikliği hemen yap
    changeJointValue(jointIndex, increment);

    // Interval oluştur
    intervalRef.current = setInterval(() => {
      if (activeJointRef.current) {
        const { index, increment } = activeJointRef.current;
        changeJointValue(index, increment);
      }
    }, 100);
  };

  // Buton bırakıldığında çağrılır
  const handleButtonUp = () => {
    // Aktif joint bilgisini temizle
    activeJointRef.current = null;

    // Interval'ı temizle
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Dokunmatik olaylar için işleyiciler
  const handleTouchStart = (
    jointIndex: number,
    increment: boolean,
    e: React.TouchEvent
  ) => {
    e.preventDefault(); // Varsayılan davranışı engelle
    e.stopPropagation(); // Olay yayılımını engelle
    handleButtonDown(jointIndex, increment);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Varsayılan davranışı engelle
    e.stopPropagation(); // Olay yayılımını engelle
    handleButtonUp();
  };

  // Eksen kontrolü render fonksiyonu
  const renderJointControl = (jointIndex: number) => {
    const value = jointValues[jointIndex] || 0;

    return (
      <div
        key={jointIndex}
        className="mb-4 bg-gray-700 rounded-lg p-4 shadow-inner"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold text-lg">
            Eksen {jointIndex + 1}
          </h3>
          <div className="bg-gray-800 px-3 py-1 rounded-md text-blue-400 font-mono">
            {value}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Azaltma butonu */}
          <button
            onMouseDown={() => handleButtonDown(jointIndex, false)}
            onMouseUp={handleButtonUp}
            onMouseLeave={handleButtonUp}
            onTouchStart={(e) => handleTouchStart(jointIndex, false, e)}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleButtonUp}
            disabled={!selectedRobotId}
            className={`
              bg-red-600 hover:bg-red-700 w-1/2 py-3 text-lg font-bold
              rounded-md text-white touch-none select-none
              ${!selectedRobotId ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            -
          </button>

          {/* Arttırma butonu */}
          <button
            onMouseDown={() => handleButtonDown(jointIndex, true)}
            onMouseUp={handleButtonUp}
            onMouseLeave={handleButtonUp}
            onTouchStart={(e) => handleTouchStart(jointIndex, true, e)}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleButtonUp}
            disabled={!selectedRobotId}
            className={`
              bg-green-600 hover:bg-green-700 w-1/2 py-3 text-lg font-bold
              rounded-md text-white touch-none select-none
              ${!selectedRobotId ? "opacity-50 cursor-not-allowed" : ""}
            `}
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
        <div className="bg-black/50 text-white text-xs p-2 mb-2 rounded">
          Debug: {debug}
        </div>
      )}

      {!selectedRobotId ? (
        <div className="text-center text-gray-400 py-8">
          Lütfen bir robot seçin
        </div>
      ) : axisCount <= 3 ? (
        // 2-3 eksen için dikey düzen
        <div>
          {Array.from({ length: axisCount }, (_, i) => renderJointControl(i))}
        </div>
      ) : (
        // 6 eksen için grid düzeni
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: axisCount }, (_, i) => renderJointControl(i))}
        </div>
      )}

      {selectedRobotId && (
        <div className="mt-6 flex justify-end gap-4">
          <Button
            onClick={() => dispatch(resetJoints(selectedRobotId))}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            Sıfırla
          </Button>
          <Button
            onClick={() => console.log("Hareketi Uygula", jointValues)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Hareketi Uygula
          </Button>
        </div>
      )}
    </Card>
  );
}