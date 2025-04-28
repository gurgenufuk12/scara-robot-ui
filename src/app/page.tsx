"use client";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { emergencyStop } from "@/store/robotSlice";
import Header from "@/components/ui/Header";
import RobotTypeSelector from "@/components/RobotTypeSelector";
import RobotSelector from "@/components/RobotSelector";
import TabMenu from "@/components/ui/TabMenu";
import MotorControl from "@/components/MotorControl";
import { useConnection } from "@/contexts/ConnectionContext"; // Context hook'unu import et
import { ConnectionForm } from "@/components/ui/ConnectionForm"; // Bağlantı formunu import et

// const API_URL = "http://192.168.2.104:8000/api/robot"; // Kaldırıldı

export default function Home() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false); // Acil durdurma için loading state
  const [apiError, setApiError] = useState<string | null>(null); // API hataları için state
  const { robotType, selectedRobotId, robots } = useAppSelector(
    (state) => state.robot
  );
  // Connection context'ten gerekli değerleri ve fonksiyonları al
  const {
    getApiUrl,
    isConnected,
    isLoading: isConnecting,
    error: connectionError,
  } = useConnection();

  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;

  const handleEmergencyStop = async () => {
    const apiUrl = getApiUrl("general-emergency-stop"); // Dinamik URL al
    if (!isConnected || !apiUrl) {
      setApiError(
        "Acil durdurma başarısız: Bağlantı yok veya API URL alınamadı."
      );
      console.error(
        "Emergency stop failed: Not connected or API URL unavailable."
      );
      return;
    }

    setLoading(true);
    setApiError(null); // Önceki API hatalarını temizle

    try {
      const response = await fetch(apiUrl, {
        // Dinamik URL kullan
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Network response was not ok (${response.status}): ${errorBody}`
        );
      }

      const data = await response.json();
      dispatch(emergencyStop()); // Redux state'ini güncelle
      console.log("Genel acil durdurma başarılı:", data);
      // Başarı mesajı gösterebilirsiniz
      // setApiError(null); // Başarılı olunca hatayı temizle (opsiyonel)
    } catch (error: any) {
      console.error("Acil durdurma hatası:", error);
      setApiError(
        `Acil Durdurma Hatası: ${
          error.message || "Bilinmeyen bir hata oluştu."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />

      {/* Ana İçerik Alanı */}
      <div className="flex-1 flex flex-col p-4 gap-4 bg-[#145525] justify-center">
        {/* Bağlantı Formu her zaman en üstte görünsün */}
        <ConnectionForm />

        {/* Bağlantı kurulduysa ana arayüzü veya robot tipi seçiciyi göster */}
        {isConnected ? (
          !robotType ? (
            // Bağlı ama robot tipi seçilmemişse
            <RobotTypeSelector />
          ) : (
            // Bağlı ve robot tipi seçilmişse ana arayüz
            <>
              {/* Aktif Mod ve Acil Durdurma Barı */}
              <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-2 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="px-3 py-1 bg-blue-900 rounded-md text-sm font-medium text-white mr-3">
                    {robotType === "scara"
                      ? "SCARA Robot Modu"
                      : "Endüstriyel Robot Modu"}
                  </div>
                  {/* Bağlantı durumunu context'ten alarak göster */}
                  <div className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      } mr-2 animate-pulse`}
                    ></div>
                    <span className="text-xs text-gray-300">
                      {isConnected ? "Bağlı" : "Bağlantı Yok"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    className={`bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-medium text-white ${
                      !isConnected || loading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleEmergencyStop}
                    disabled={!isConnected || loading} // Bağlantı yoksa veya yükleniyorsa disable et
                  >
                    {loading ? "Durduruluyor..." : "Acil Durdurma"}
                  </button>
                </div>
              </div>
              {/* API Hatası Gösterimi */}
              {apiError && (
                <div className="bg-red-800 border border-red-600 text-red-200 px-3 py-1.5 rounded text-xs text-center">
                  {apiError}
                </div>
              )}

              {/* Ana Kontrol Alanı */}
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                {/* Sol Panel: Robot Seçimi ve Motor Kontrol */}
                <div className="flex flex-col w-full md:w-64 gap-4">
                  {" "}
                  {/* Gap eklendi */}
                  <RobotSelector />
                  <MotorControl />
                </div>
                {/* Sağ Panel: Tab Menü ve İçerikleri */}
                <div className="flex-1">
                  <TabMenu />
                </div>
              </div>
            </>
          )
        ) : (
          // Bağlantı kurulmadıysa (ve yüklenmiyorsa) bir mesaj göster
          !isConnecting &&
          !connectionError && ( // Sadece başlangıçta veya bağlantı kesildiğinde göster
            <div className="text-center text-gray-400 mt-10 bg-gray-800 p-6 rounded-lg">
              <p>
                Robot kontrol arayüzünü kullanmak için lütfen yukarıdaki formdan
                geçerli bir IP adresi girip bağlanın.
              </p>
            </div>
          )
        )}
        {/* Bağlantı hatası varsa göster (ConnectionForm içinde de gösteriliyor ama burada da olabilir) */}
        {/* {connectionError && !isConnecting && (
          <div className="text-center text-red-400 mt-4 bg-red-900 bg-opacity-50 p-3 rounded-lg">
            Bağlantı Hatası: {connectionError}
          </div>
        )} */}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 p-2 flex justify-between items-center text-xs text-gray-400">
        <span>GRASS Robotik Kontrol Paneli v1.0</span>
        {isConnected && robotType && (
          <span>
            {robotType === "scara" ? "SCARA" : "Endüstriyel"} Mod -
            {selectedRobot
              ? ` Robot: ${selectedRobot.name}`
              : " Lütfen robot seçin"}
          </span>
        )}
        <span>© 2025 GRASS Robotics</span> {/* Tarih güncellendi */}
      </footer>
    </div>
  );
}
