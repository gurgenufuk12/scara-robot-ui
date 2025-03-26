import { useState } from "react";
import JointControl from "./JointControl";
import CartesianControl from "./CartesianControl";
import { RobotViewer } from "./RobotViewer";

export default function TabMenu({ selectedRobot }: { selectedRobot: string }) {
  const [activeTab, setActiveTab] = useState("joint");

  const tabs = [
    { id: "joint", label: "Eksen Kontrol", icon: "🔄" },
    { id: "cartesian", label: "Kartezyen Kontrol", icon: "📐" },
    { id: "view", label: "Görünüm", icon: "👁️" },
    { id: "settings", label: "Ayarlar", icon: "⚙️" },
    { id: "logs", label: "Loglar", icon: "📋" },
  ];

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
      {/* Tab Header */}
      <div className="flex bg-gray-800 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 flex items-center transition-colors duration-200
              ${
                activeTab === tab.id
                  ? "bg-blue-900 text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              }
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-1 bg-gray-800">
        {activeTab === "joint" && (
          <JointControl selectedRobot={selectedRobot} />
        )}
        {activeTab === "cartesian" && (
          <CartesianControl selectedRobot={selectedRobot} />
        )}
        {activeTab === "view" && <RobotViewer selectedRobot={selectedRobot} />}
        {activeTab === "settings" && <div>Settings</div>}
        {activeTab === "logs" && <div>Logs</div>}
      </div>
    </div>
  );
}
