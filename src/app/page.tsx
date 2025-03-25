"use client";
import { useState } from "react";
import Header from "@/components/ui/Header";
import RobotSelector from "@/components/RobotSelector";
import TabMenu from "@/components/ui/TabMenu";

export default function Home() {
  const [selectedRobot, setSelectedRobot] = useState("");

  return (
    <div className="min-h-screen bg-green-800 text-white">
      <Header />
      <div className="p-6">
        <RobotSelector setSelectedRobot={setSelectedRobot} />
        <TabMenu selectedRobot={selectedRobot} />
      </div>
    </div>
  );
}
