import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import JointControl from "@/components/ui/JointControl";
import CartesianControl from "@/components/ui/CartesianControl";
import RobotViewer from "@/components/ui/RobotViewer";

export default function TabMenu() {
  const { robotType, selectedRobotId, robots } = useAppSelector(
    (state) => state.robot
  );
  const [activeTab, setActiveTab] = useState("joint");

  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;

  const scaraTabs = [
    { id: "joint", label: "Eksen Kontrol", icon: "🔄" },
    { id: "cartesian", label: "Kartezyen Kontrol", icon: "📐" },
    { id: "view", label: "Görselleştirme", icon: "👁️" },
    { id: "settings", label: "Ayarlar", icon: "⚙️" },
    { id: "logs", label: "Loglar", icon: "📋" },
  ];

  const industrialTabs = [
    { id: "joint", label: "Eksen Kontrol", icon: "🔄" },
    { id: "cartesian", label: "Kartezyen Kontrol", icon: "📐" },
    { id: "view", label: "Görselleştirme", icon: "👁️" },
    { id: "trajectory", label: "Yörünge Planlama", icon: "🛣️" },
    { id: "program", label: "Program Modu", icon: "📝" },
    { id: "settings", label: "Ayarlar", icon: "⚙️" },
    { id: "logs", label: "Loglar", icon: "📋" },
  ];

  const tabs = robotType === "industrial" ? industrialTabs : scaraTabs;

  if (!selectedRobotId) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 flex items-center justify-center">
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
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
      <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 flex items-center transition-colors duration-200 whitespace-nowrap
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

      <div className="p-1 bg-gray-800">
        {activeTab === "joint" && <JointControl />}

        {activeTab === "cartesian" && <CartesianControl />}

        {activeTab === "view" && <RobotViewer />}

        {activeTab === "trajectory" && axisCount === 6 && (
          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl text-white font-bold mb-4">
              Yörünge Planlama
            </h2>
            <p className="text-gray-300 mb-4">
              6 eksenli robot için yörünge planlama ve hareket sekansı oluşturma
              arayüzü.
            </p>
            <div className="bg-gray-800 p-4 rounded border border-gray-600">
              <div className="text-center text-gray-400 py-10">
                Yörünge planlama modülü geliştirme aşamasında
              </div>
            </div>
          </div>
        )}

        {activeTab === "program" && axisCount === 6 && (
          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl text-white font-bold mb-4">Program Modu</h2>
            <p className="text-gray-300 mb-4">
              6 eksenli robotunuz için program oluşturma ve düzenleme arayüzü.
            </p>
            <div className="bg-gray-800 p-4 rounded border border-gray-600">
              <div className="text-center text-gray-400 py-10">
                Program editörü modülü geliştirme aşamasında
              </div>
            </div>
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
            <h2 className="text-xl text-white font-bold mb-4">
              Sistem Logları
            </h2>
            {/* Log içeriği */}
          </div>
        )}
      </div>
    </div>
  );
}
