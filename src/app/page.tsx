"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { emergencyStop } from "@/store/robotSlice";
import Header from "@/components/ui/Header";
import RobotTypeSelector from "@/components/RobotTypeSelector";
import RobotSelector from "@/components/RobotSelector";
import TabMenu from "@/components/ui/TabMenu";
import MotorControl from "@/components/MotorControl";
const API_URL = "http://localhost:8000/api/robot";
export default function Home() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { robotType, selectedRobotId, robots } = useAppSelector(
    (state) => state.robot
  );

  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const handleEmergencyStop = () => {
    setLoading(true);
    try {
      fetch(`${API_URL}/general-emergency-stop`, {
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
          dispatch(emergencyStop());
          console.log("Tüm motorlar kapandı", data);
        })
        .catch((error) => {
          console.error("Motor kapatma hatası:", error);
        });
    } finally {
      setLoading(false);
    }
  };
  // const handleChangeRobotType = () => {
  //   const response = checkIfChangeRobotType();

  //   console.log(response);

  //   // try {
  //   //   let isMotorActive = false;
  //   //   for (const motorId in motors) {
  //   //     if (motors[motorId]) {
  //   //       isMotorActive = true;
  //   //       break;
  //   //     }
  //   //   }
  //   //   if (isMotorActive) {
  //   //     return alert(
  //   //       "Robot tipini değiştirebilmek için önce motorları durdurun."
  //   //     );
  //   //   }
  //   //   dispatch(setRobotType(null));
  //   // } catch (error) {
  //   //   console.log(error);
  //   // }
  // };
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col p-4 gap-4 bg-[#145525] justify-center">
        {!robotType ? (
          <RobotTypeSelector />
        ) : (
          <>
            <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-2 flex items-center justify-between">
              <div className="flex items-center">
                <div className="px-3 py-1 bg-blue-900 rounded-md text-sm font-medium text-white mr-3">
                  {robotType === "scara"
                    ? "SCARA Robot Modu"
                    : "Endüstriyel Robot Modu"}
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-300">Sistem Aktif</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* <button
                  onClick={() => handleChangeRobotType()}
                  className="text-xs text-gray-400 hover:text-white border border-gray-700 rounded px-2 py-1 hover:bg-gray-700"
                >
                  Robot Tipini Değiştir
                </button> */}
                <button
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-medium text-white"
                  onClick={() => handleEmergencyStop()}
                >
                  Acil Durdurma
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="flex flex-col w-full md:w-64">
                <RobotSelector />
                <MotorControl />
              </div>
              <div className="flex-1">
                <TabMenu />
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="bg-gray-800 border-t border-gray-700 p-2 flex justify-between items-center text-xs text-gray-400">
        <span>GRASS Robotik Kontrol Paneli v1.0</span>
        {robotType && (
          <span>
            {robotType === "scara" ? "SCARA" : "Endüstriyel"} Mod -
            {selectedRobot
              ? ` Robot: ${selectedRobot.name}`
              : " Lütfen robot seçin"}
          </span>
        )}
        <span>© 2023 GRASS Robotics</span>
      </footer>
    </div>
  );
}
