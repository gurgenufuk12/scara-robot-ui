import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useConnection } from "@/contexts/ConnectionContext";
import { updateJointValue } from "@/store/robotSlice";
import { Card } from "@/components/ui/Card";

interface JointData {
  joints: Record<string, number>;
}

export default function RobotViewer() {
  const dispatch = useAppDispatch();
  const { getApiUrl, isConnected } = useConnection();
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);

  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;
  const jointValues = selectedRobot ? selectedRobot.jointValues : [];

  const handleReduxJointUpdate = (data: JointData) => {
    if (data.joints && selectedRobotId) {
      Object.keys(data.joints)
        .filter((jointName) => {
          const jointIndex = parseInt(jointName.replace("joint", "")) - 1;
          return jointIndex < axisCount;
        })
        .forEach((jointName) => {
          const jointIndex = parseInt(jointName.replace("joint", "")) - 1;
          const jointValue = data.joints[jointName];

          dispatch(
            updateJointValue({
              robotId: selectedRobotId,
              jointIndex: jointIndex,
              value: jointValue,
            })
          );
        });
    }
  };
  const getJointValue = () => {
    const apiUrl = getApiUrl("get_joint_value");
    if (!isConnected || !apiUrl) {
      console.error("Bağlantı hatası veya API URL'si bulunamadı.");
      return;
    }
    try {
      fetch(apiUrl, {
        method: "GET",
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
          handleReduxJointUpdate(data);
        })
        .catch((error) => {
          console.error("Hata:", error);
        });
    } catch (error) {
      console.error("Hata:", error);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      getJointValue();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <Card className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl text-white font-bold">
          Robot Görselleştirme
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
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <div className="h-96 flex flex-col items-center justify-center">
            <div className="text-gray-400 mb-4">
              3D Robot Görselleştirme {axisCount} Eksen
            </div>
            <div className="text-sm text-gray-500">
              (Bu kısma robot modeli gelecek)
            </div>

            <div className="mt-8 bg-gray-800 p-3 rounded-lg w-full max-w-md">
              <h3 className="text-sm text-gray-400 mb-2">
                Mevcut Eksen Değerleri
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {jointValues.map((value, index) => (
                  <div
                    key={index}
                    className="flex justify-between bg-gray-700 p-2 rounded"
                  >
                    <span className="text-xs text-gray-300">
                      Eksen {index + 1}
                    </span>
                    <span className="text-xs text-blue-300 font-mono">
                      {value}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
