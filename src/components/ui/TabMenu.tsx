import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import JointControl from "@/components/ui/JointControl";
import CartesianControl from "@/components/ui/CartesianControl";
import RobotViewer from "@/components/ui/RobotViewer";
import ProgramMode from "@/components/ui/ProgramMode";
import VelocityDiagram from "@/components/ui/VelocityDiagram";

export default function TabMenu() {
  const { robotType, selectedRobotId, robots } = useAppSelector(
    (state) => state.robot
  );
  const [activeTab, setActiveTab] = useState("joint");

  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;

  // Tab verileri
  const scaraTabs = [
    { id: "joint", label: "Eksen Kontrol" },
    { id: "cartesian", label: "Kartezyen Kontrol" },
    { id: "velocities", label: "Hız Kontrolü" },
    { id: "view", label: "Görselleştirme" },
    { id: "program", label: "Program Modu" },
    { id: "settings", label: "Ayarlar" },
    { id: "logs", label: "Loglar" },
  ];

  const industrialTabs = [
    { id: "joint", label: "Eksen Kontrol" },
    { id: "cartesian", label: "Kartezyen Kontrol" },
    { id: "velocities", label: "Hız Kontrolü" },
    { id: "view", label: "Görselleştirme" },
    { id: "trajectory", label: "Yörünge Planlama" },
    { id: "program", label: "Program Modu" },
    { id: "settings", label: "Ayarlar" },
    { id: "logs", label: "Loglar" },
  ];

  const tabs = robotType === "industrial" ? industrialTabs : scaraTabs;
  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || "Sekme Seç";


  // Select dropdown'ı için change handler
  const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveTab(event.target.value);
  };

  // Robot seçilmemişse bilgi mesajı göster
  if (!selectedRobotId) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-xl text-gray-400 font-medium mb-3">
            Lütfen Bir Robot Seçin
          </h3>
          <p className="text-gray-500">
            Kontrol panelini görüntülemek için bir robot seçmelisiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-xl flex flex-col h-full">
      {/* Tab Header - Select Dropdown Sağda */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 flex justify-between items-center flex-shrink-0">
        {/* Sol tarafa başlık ekleyebiliriz */}
        <span className="text-lg font-semibold text-gray-300 hidden sm:inline">
          {activeTabLabel}
        </span>
        <span className="text-lg font-semibold text-gray-300 sm:hidden">
          Kontrol Paneli
        </span>

        {/* Sağ taraftaki Select */}
        <select
          value={activeTab}
          onChange={handleTabChange}
          className="w-auto max-w-[200px] sm:max-w-[250px] px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
          // appearance-none tarayıcı varsayılan okunu gizler, isterseniz özel ok ekleyebilirsiniz
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tab İçeriği - Kalan alanı doldurması için flex-1 */}
      <div className="p-1 md:p-4 bg-gray-800 flex-1 overflow-y-auto">
        {/* İçerik renderlama kısmı aynı kalır */}
        {activeTab === "joint" && <JointControl />}
        {activeTab === "cartesian" && <CartesianControl />}
        {activeTab === "velocities" && (
          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl text-white font-bold mb-4">Hız Kontrolü</h2>
            <VelocityDiagram />
          </div>
        )}
        {activeTab === "view" && <RobotViewer />}
        {activeTab === "program" && <ProgramMode />}
        {activeTab === "trajectory" && axisCount === 6 && (
          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl text-white font-bold mb-4">
              Yörünge Planlama
            </h2>
            {/* ... içerik */}
          </div>
        )}
        {activeTab === "settings" && (
          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl text-white font-bold mb-4">Ayarlar</h2>
            {/* Ayarlar içeriği */}
          </div>
        )}
        {activeTab === "logs" && (
          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl text-white font-bold mb-4">Sistem Logları</h2>
            {/* Log içeriği */}
          </div>
        )}
      </div>
    </div>
  );
}