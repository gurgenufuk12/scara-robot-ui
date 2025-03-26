import { useState, useEffect } from "react";

export default function RobotSelector({
  setSelectedRobot,
}: {
  setSelectedRobot: (robot: string) => void;
}) {
  const [robot, setRobot] = useState("robot1");

  const handleSelect = (robotName: string) => {
    setRobot(robotName);
    setSelectedRobot(robotName);
  };

  useEffect(() => {
    setSelectedRobot("robot1");
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg mb-4">
      <h2 className="text-sm text-gray-300 mb-3 font-medium">Robot Seçimi</h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSelect("robot1")}
          className={`
            relative p-3 rounded-lg border transition duration-200 
            ${
              robot === "robot1"
                ? "bg-blue-900 border-blue-500 shadow-inner shadow-blue-900/50"
                : "bg-gray-700 border-gray-600 hover:bg-gray-650"
            }
          `}
        >
          <div className="absolute top-2 right-2">
            <div
              className={`
              h-2 w-2 rounded-full 
              ${robot === "robot1" ? "bg-green-500" : "bg-gray-500"}
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
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                  stroke={robot === "robot1" ? "#90CAF9" : "#6B7280"}
                  strokeWidth="2"
                />
                <path
                  d="M8 12L16 12"
                  stroke={robot === "robot1" ? "#90CAF9" : "#6B7280"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 8L12 16"
                  stroke={robot === "robot1" ? "#90CAF9" : "#6B7280"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              className={`font-medium ${
                robot === "robot1" ? "text-white" : "text-gray-300"
              }`}
            >
              Robot 1
            </span>
          </div>

          <div
            className={`text-xs px-2 py-1 rounded text-center ${
              robot === "robot1"
                ? "bg-blue-700 text-blue-100"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            SCARA Model
          </div>
        </button>

        <button
          onClick={() => handleSelect("robot2")}
          className={`
            relative p-3 rounded-lg border transition duration-200 
            ${
              robot === "robot2"
                ? "bg-blue-900 border-blue-500 shadow-inner shadow-blue-900/50"
                : "bg-gray-700 border-gray-600 hover:bg-gray-650"
            }
          `}
        >
          <div className="absolute top-2 right-2">
            <div
              className={`
              h-2 w-2 rounded-full 
              ${robot === "robot2" ? "bg-green-500" : "bg-gray-500"}
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
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                  stroke={robot === "robot2" ? "#90CAF9" : "#6B7280"}
                  strokeWidth="2"
                />
                <path
                  d="M8 12L16 12"
                  stroke={robot === "robot2" ? "#90CAF9" : "#6B7280"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 8L12 16"
                  stroke={robot === "robot2" ? "#90CAF9" : "#6B7280"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              className={`font-medium ${
                robot === "robot2" ? "text-white" : "text-gray-300"
              }`}
            >
              Robot 2
            </span>
          </div>

          <div
            className={`text-xs px-2 py-1 rounded text-center ${
              robot === "robot2"
                ? "bg-blue-700 text-blue-100"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            SCARA Model
          </div>
        </button>
      </div>

      <div className="text-xs text-gray-400 mt-3 text-center">
        Seçili Robot: {robot === "robot1" ? "Robot 1" : "Robot 2"}
      </div>
    </div>
  );
}
