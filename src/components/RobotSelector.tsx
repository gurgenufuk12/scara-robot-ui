import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectRobot,
  updateMotorStatuses,
  setRobotStatus,
  setRobotConnection,
} from "@/store/robotSlice";
const API_URL = "http://localhost:8000/api/robot";

export default function RobotSelector() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { robotType, selectedRobotId, robots } = useAppSelector(
    (state) => state.robot
  );

  const handleSelect = (robotId: string) => {
    try {
      fetch(`${API_URL}/choose-active-robot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: robotId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          dispatch(selectRobot(robotId));
          dispatch(setRobotStatus({ robotId, status: "moving" }));
          dispatch(setRobotConnection({ robotId, isConnected: true }));
          return getMotorStatusForRobot(robotId);
        })
        .catch((error) => {
          console.error("Robot seçimi hatası:", error);
        })
        .finally(() => {});
    } catch (error) {
      console.error("Hata:", error);
    }
  };
  const getMotorStatusForRobot = async (robotId: string) => {
    if (!robotId) return Promise.reject(new Error("Robot ID belirtilmedi"));
    setLoading(true);
    const response = await fetch(`${API_URL}/get_motor_status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(`Robot ${robotId} için motor durumu:`, data);
    // API'dan gelen motor durumları
    const motorStatuses = data.motors || {};
    // Redux store'u güncellemek için tüm motor durumlarını bir kerede gönder
    dispatch(
      updateMotorStatuses({
        robotId,
        motors: motorStatuses,
      })
    );
    setLoading(false);
    return data;
  };
  // 6 eksenli robot seçilmiş ise otomatik seçim yapılır, kullanıcı arayüzü gösterilmez
  if (robotType === "industrial") {
    const industrialRobot = Object.values(robots).find(
      (robot) => robot.axisCount === 6
    );

    if (!industrialRobot) {
      return (
        <div className="bg-red-800 p-4 rounded-lg text-white">
          6 Eksenli robot bulunamadı!
        </div>
      );
    }

    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-gray-300 font-medium">Seçili Robot</h2>
          <div className="px-2 py-0.5 bg-blue-900 rounded text-xs text-blue-200">
            6 Eksenli
          </div>
        </div>

        <div className="mt-3 bg-blue-900/30 border border-blue-800 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4L8 8L12 4L16 8L20 4"
                  stroke="#90CAF9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 4V16"
                  stroke="#90CAF9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 16L16 20"
                  stroke="#90CAF9"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium">
                {industrialRobot.name}
              </div>
              <div className="text-xs text-gray-400">
                Endüstriyel, 6 Eksenli
              </div>
            </div>
            <div className="ml-auto">
              <div
                className={`h-3 w-3 rounded-full ${
                  industrialRobot.isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-400 text-center">
          6 Eksenli robot otomatik olarak seçildi
        </div>
      </div>
    );
  }

  // SCARA robotlar için seçim arayüzü
  const scaraRobots = Object.values(robots).filter(
    (robot) => robot.axisCount === 2
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-gray-300 font-medium">Robot Seçimi</h2>
        <div className="px-2 py-0.5 bg-blue-900 rounded text-xs text-blue-200">
          SCARA
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-3">
        {scaraRobots.map((robot) => (
          <button
            key={robot.id}
            onClick={() => handleSelect(robot.id)}
            className={`
              relative p-3 rounded-lg border transition duration-200 w-fit px-4
              ${
                selectedRobotId === robot.id
                  ? "bg-blue-900 border-blue-500 shadow-inner shadow-blue-900/50"
                  : "bg-gray-700 border-gray-600 hover:bg-gray-650"
              }
            `}
          >
            <div className="absolute top-2 right-2">
              <div
                className={`
                h-2 w-2 rounded-full 
                ${
                  robot.isConnected
                    ? selectedRobotId === robot.id
                      ? "bg-green-500"
                      : "bg-green-700"
                    : "bg-red-500"
                }
              `}
              ></div>
            </div>

            <div className="flex items-center mb-2">
              <div className="bg-gray-900 rounded-full p-1.5 mr-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4V20"
                    stroke={
                      selectedRobotId === robot.id ? "#90CAF9" : "#6B7280"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 4L20 8"
                    stroke={
                      selectedRobotId === robot.id ? "#90CAF9" : "#6B7280"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 10L20 14"
                    stroke={
                      selectedRobotId === robot.id ? "#90CAF9" : "#6B7280"
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span
                className={`font-medium ${
                  selectedRobotId === robot.id ? "text-white" : "text-gray-300"
                }`}
              >
                {robot.name}
              </span>
            </div>

            <div
              className={`text-xs px-2 py-1 rounded text-center ${
                selectedRobotId === robot.id
                  ? "bg-blue-700 text-blue-100"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              2 Eksenli
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
