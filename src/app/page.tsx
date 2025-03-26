"use client";
import { useState } from "react";
import Header from "@/components/ui/Header";
import RobotSelector from "@/components/RobotSelector";
import TabMenu from "@/components/ui/TabMenu";

export default function Home() {
  const [selectedRobot, setSelectedRobot] = useState("");
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="w-full md:w-64">
            <RobotSelector setSelectedRobot={setSelectedRobot} />
          </div>
          <div className="flex-1">
            <TabMenu selectedRobot={selectedRobot} />
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 border-t border-gray-700 p-2 flex justify-between items-center text-xs text-gray-400">
        <span>GRASS Robotik Kontrol Paneli v1.0</span>
        <span>© 2023 GRASS Robotics</span>
      </footer>
    </div>
  );
}
