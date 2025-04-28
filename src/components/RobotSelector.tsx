import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectRobot,
  updateMotorStatuses,
  setRobotStatus,
  setRobotConnection,
} from "@/store/robotSlice";
import { useConnection } from "@/contexts/ConnectionContext";



export default function RobotSelector() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { robotType, selectedRobotId, robots } = useAppSelector(
    (state) => state.robot
  );
  const { getApiUrl, isConnected } = useConnection(); // Context'ten al

  const handleSelect = (robotId: string) => {
    const apiUrl = getApiUrl("choose-active-robot"); // Dinamik URL al
    if (!isConnected || !apiUrl) {
      console.error("Robot seçilemedi: Bağlantı yok veya API URL alınamadı.");
      setApiError("Robot seçilemedi: Lütfen önce bağlanın."); // Hata state'ini ayarla
      return; // İşlemi durdur
    }

    setApiError(null);
    try {
      fetch(apiUrl, {

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
            return response.text().then((text) => {
              throw new Error(
                `Network response was not ok (${response.status}): ${text}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          dispatch(selectRobot(robotId));
          dispatch(setRobotStatus({ robotId, status: "moving" })); // Orijinal kodda 'moving' idi
          dispatch(setRobotConnection({ robotId, isConnected: true })); // Orijinal kodda vardı
          return getMotorStatusForRobot(robotId); // Bu fonksiyon isConnected kontrolü yapıyor
        })
        .catch((error) => {
          console.error("Robot seçimi hatası:", error);
          setApiError(`Robot seçimi hatası: ${error.message}`); // Hata state'ini ayarla
        })
        .finally(() => {
          // Orijinal kodda finally boştu. setLoading burada yönetilebilir.
          // setLoading(false);
        });
    } catch (error: any) {
      // Hata tipini any olarak belirttik
      console.error("Hata:", error);
      setApiError(`Beklenmedik hata: ${error.message}`); // Hata state'ini ayarla
    }
  };

  const getMotorStatusForRobot = async (robotId: string) => {
    const apiUrl = getApiUrl("get_motor_status"); // Dinamik URL al
    if (!isConnected || !apiUrl) {
      console.error(
        "Motor durumu alınamadı: Bağlantı yok veya API URL alınamadı."
      );
      setApiError("Motor durumu alınamadı: Bağlantı yok."); // Hata state'ini ayarla
      // setLoading(false) burada da çağrılmalı ki yükleme durumu takılı kalmasın
      setLoading(false);
      return Promise.reject(new Error("Bağlantı yok veya API URL alınamadı."));
    }
    if (!robotId) {
      setLoading(false); // robotId yoksa da yüklemeyi durdur
      return Promise.reject(new Error("Robot ID belirtilmedi"));
    }

    setLoading(true);
    setApiError(null); // Yeni istek öncesi hatayı temizle
    try {
      // GET isteği için robotId'yi query parametresi olarak eklemek daha standarttır
      const response = await fetch(`${apiUrl}?robotId=${robotId}`, {
        method: "GET", // Orijinal kodda GET idi
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
      console.log(`Robot ${robotId} için motor durumu:`, data);
      const motorStatuses = data.motors || {};
      dispatch(
        updateMotorStatuses({
          robotId,
          motors: motorStatuses,
        })
      );
      return data; // Başarılı veriyi döndür
    } catch (error: any) {
      console.error("Motor durumu alma hatası:", error);
      setApiError(`Motor durumu alınamadı: ${error.message}`); // Hata state'ini ayarla
      throw error; // Hatanın yukarıya (handleSelect'e) iletilmesi için tekrar fırlat
    } finally {
      setLoading(false); // İşlem bitince yüklemeyi durdur
    }
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

    // 6 eksenli robot için bağlantı durumunu context'ten al
    const isIndustrialConnected =
      isConnected && selectedRobotId === industrialRobot.id;

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
              {/* Bağlantı durumunu context'ten gelen isConnected ile kontrol et */}
              <div
                className={`h-3 w-3 rounded-full ${
                  isIndustrialConnected ? "bg-green-500" : "bg-red-500"
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
      <div className="flex items-center justify-between mb-3">
        {" "}
        {/* mb eklendi */}
        <h2 className="text-sm text-gray-300 font-medium">Robot Seçimi</h2>
        <div className="px-2 py-0.5 bg-blue-900 rounded text-xs text-blue-200">
          SCARA
        </div>
      </div>

      {/* API Hata Gösterimi */}
      {apiError && (
        <div className="mb-3 p-2 bg-red-900 border border-red-700 text-red-200 rounded-md text-xs text-center">
          {apiError}
        </div>
      )}
      {/* Yükleme Göstergesi */}
      {loading && (
        <div className="mb-3 text-center text-xs text-gray-400">
          Motor durumu alınıyor...
        </div>
      )}

      {/* Bağlantı yoksa uyarı */}
      {!isConnected && (
        <div className="mb-3 text-center text-xs text-yellow-400">
          Robot seçmek için lütfen önce bağlanın.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {" "}
        {/* Orijinal gap-6 idi, 3 yapıldı */}
        {scaraRobots.map((robot) => {
          // Her bir SCARA robotu için bağlantı durumunu context'ten al
          const isCurrentRobotConnected =
            isConnected && selectedRobotId === robot.id;

          return (
            <button
              key={robot.id}
              onClick={() => handleSelect(robot.id)}
              // Bağlantı yoksa veya yükleniyorsa butonu disable et
              disabled={!isConnected || loading}
              className={`
                relative p-3 rounded-lg border transition duration-200 w-full px-4 text-left  // w-fit yerine w-full, text-left eklendi
                ${
                  selectedRobotId === robot.id
                    ? "bg-blue-900 border-blue-500 shadow-inner shadow-blue-900/50"
                    : "bg-gray-700 border-gray-600 hover:bg-gray-650"
                }
                ${
                  !isConnected || loading ? "opacity-50 cursor-not-allowed" : ""
                } // Disable stili
              `}
            >
              <div className="absolute top-2 right-2">
                {/* Bağlantı durumunu context'ten gelen isConnected ile kontrol et */}
                <div
                  className={`
                  h-2 w-2 rounded-full 
                  ${
                    isCurrentRobotConnected // isConnected && selectedRobotId === robot.id yerine
                      ? "bg-green-500"
                      : "bg-red-500" // Bağlı değilse veya seçili değilse kırmızı
                  }
                `}
                ></div>
              </div>

              <div className="flex items-center mb-1">
                {" "}
                {/* mb-2 yerine mb-1 */}
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
                    selectedRobotId === robot.id
                      ? "text-white"
                      : "text-gray-300"
                  }`}
                >
                  {robot.name}
                </span>
              </div>

              <div
                className={`text-xs px-2 py-0.5 rounded inline-block ${
                  // text-center kaldırıldı, inline-block eklendi
                  selectedRobotId === robot.id
                    ? "bg-blue-700 text-blue-100"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                2 Eksenli
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
