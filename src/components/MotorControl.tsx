import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleMotor, setAllMotors, toggleAllMotors } from "@/store/robotSlice";
import { useConnection } from "@/contexts/ConnectionContext";


export default function MotorControl() {
  const dispatch = useAppDispatch();
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);
  const { getApiUrl, isConnected } = useConnection();

  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const motorStatus = selectedRobot ? selectedRobot.motors : {};
  const motors = selectedRobot ? selectedRobot.motors : {};

  const [blink, setBlink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleToggleMotor = (motorId: string) => {
    const apiUrl = getApiUrl(`toggle_${selectedRobotId}_${motorId}`);
    if (!isConnected || !apiUrl || !selectedRobotId) {
      console.error(
        "Motor durumu değiştirilemedi: Bağlantı yok, API URL alınamadı veya Robot seçili değil."
      );
      setApiError(
        "Motor durumu değiştirilemedi: Bağlantı yok veya Robot seçili değil."
      ); // Hata state'ini ayarla
      return; // İşlemi durdur
    }

    setLoading(true);
    setApiError(null); // Önceki hatayı temizle
    try {
      fetch(apiUrl, {
        // Dinamik URL kullan
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedRobotId, motorId }), // Body içeriği orijinaldeki gibi bırakıldı
      })
        .then((response) => {
          if (!response.ok) {
            // Hata detayını almaya çalış
            return response.text().then((text) => {
              throw new Error(
                `Network response was not ok (${response.status}): ${text}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          dispatch(
            toggleMotor({
              robotId: selectedRobotId,
              motorId,
            })
          );
          console.log(`Motor ${motorId} durumu değiştirildi:`, data); // Başarı logu eklendi
        })
        .catch((error) => {
          console.error("Motor toggle hatası:", error);
          setApiError(`Motor ${motorId} değiştirilemedi: ${error.message}`); // Hata state'ini ayarla
        });
    } finally {
      // finally bloğu fetch promise zincirinin tamamlanmasını beklemez.
      // setLoading(false) işlemini .then ve .catch içine taşımak daha doğru olur.
      // Ancak isteğiniz üzerine mantık değiştirilmedi.
      // Doğru kullanım:
      // fetch(...)
      //   .then(...)
      //   .catch(...)
      //   .finally(() => setLoading(false));
      // Mevcut kodda setLoading(false) hemen çalışır.
      setLoading(false); // Orijinal kodda buradaydı
    }
  };

  const handleTurnAllMotorsOn = () => {
    const apiUrl = getApiUrl("toggle-all-motors-on"); // Dinamik URL al
    if (!isConnected || !apiUrl || !selectedRobotId) {
      console.error(
        "Tüm motorlar açılamadı: Bağlantı yok, API URL alınamadı veya Robot seçili değil."
      );
      setApiError(
        "Tüm motorlar açılamadı: Bağlantı yok veya Robot seçili değil."
      );
      return; // İşlemi durdur
    }

    setLoading(true);
    setApiError(null);
    try {
      fetch(apiUrl, {
        // Dinamik URL kullan
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Body gerekliyse eklenmeli, orijinal kodda yoktu
        // body: JSON.stringify({ robotId: selectedRobotId })
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
          dispatch(
            setAllMotors({
              robotId: selectedRobotId,
              status: true,
            })
          );
          console.log("Tüm motorlar açıldı:", data);
        })
        .catch((error) => {
          console.error("Motor açma hatası:", error);
          setApiError(`Tüm motorlar açılamadı: ${error.message}`);
        });
    } finally {
      setLoading(false); // Orijinal kodda buradaydı
    }
  };

  const handleEmergencyStop = () => {
    const apiUrl = getApiUrl("emergency-stop"); // Dinamik URL al
    // Acil durumda bağlantı kontrolü yapılıp yapılmayacağı tartışmalı,
    // belki bağlantı olmasa bile denemek istenir? Şimdilik kontrol ekleniyor.
    if (!isConnected || !apiUrl) {
      console.error(
        "Acil durdurma yapılamadı: Bağlantı yok veya API URL alınamadı."
      );
      setApiError("Acil durdurma yapılamadı: Bağlantı yok.");
      return; // İşlemi durdur
    }

    setLoading(true);
    setApiError(null);
    try {
      fetch(apiUrl, {
        // Dinamik URL kullan
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Body gerekliyse eklenmeli, orijinal kodda yoktu
        // body: JSON.stringify({ robotId: selectedRobotId })
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
          // Orijinal kodda toggleAllMotors kullanılmış, setAllMotors(false) daha mantıklı olabilir
          dispatch(
            toggleAllMotors({
              // Orijinaldeki gibi bırakıldı
              robotId: selectedRobotId, // selectedRobotId null olabilir, kontrol eklenmeli
              status: false,
            })
          );
          // Veya:
          // if (selectedRobotId) {
          //   dispatch(setAllMotors({ robotId: selectedRobotId, status: false }));
          // }
          console.log("Acil stop aktif edildi (tüm motorlar kapandı?)", data);
        })
        .catch((error) => {
          console.error("Acil durdurma hatası:", error);
          setApiError(`Acil durdurma hatası: ${error.message}`);
        });
    } finally {
      setLoading(false); // Orijinal kodda buradaydı
    }
  };

  const StatusIndicator = ({ isActive }: { isActive: boolean }) => {
    const blinkingClass = !isActive && blink ? "opacity-30" : "opacity-100";

    return (
      <div
        className={`h-2 w-2 rounded-full mr-1 transition-opacity ${
          isActive ? "bg-green-500" : `bg-red-500 ${blinkingClass}`
        }`}
      ></div>
    );
  };

  // Component adıyla çakışmaması için yeniden adlandırıldı
  const MotorSwitch = ({
    motorId,
    label,
  }: {
    motorId: string;
    label: string;
  }) => {
    const isActive = motorStatus[motorId] || false;

    return (
      // Orijinal kodda flex-row idi, UI'a göre ayarlanabilir
      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-gray-300 mr-3">{label}</span>
        <div className="flex items-center">
          <StatusIndicator isActive={isActive} />
          <Switch
            checked={isActive}
            onCheckedChange={() => handleToggleMotor(motorId)}
            // Bağlantı yoksa veya yükleniyorsa disable et
            disabled={!isConnected || loading}
          />
        </div>
      </div>
    );
  };

  // Robot seçili değilse bir mesaj gösterilebilir
  if (!selectedRobot) {
    return (
      <div className="bg-gray-700 p-3 rounded-md border border-gray-600 shadow-inner text-center text-gray-400 text-sm">
        Motor kontrolü için bir robot seçin.
      </div>
    );
  }

  return (
    // Bağlantı yoksa görünümü soluklaştır ve tıklamayı engelle
    <div
      className={`relative flex flex-col gap-3 bg-gray-700 p-3 rounded-md border border-gray-600 shadow-inner ${
        !isConnected ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Bağlantı yoksa overlay göster */}
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 rounded-md z-10">
          <p className="text-white font-semibold text-sm">
            Bağlantı bekleniyor...
          </p>
        </div>
      )}
      {/* Yükleme göstergesi */}
      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 rounded">
          <div className="bg-gray-800 px-4 py-2 rounded text-sm text-white">
            İşlem yapılıyor...
          </div>
        </div>
      )}

      {/* Robot Adı ve Bağlantı Durumu */}
      <div className="mb-2 pb-2 border-b border-gray-600">
        {" "}
        {/* Orijinal mr-3 pr-3 kaldırıldı, mb eklendi */}
        <div className="text-sm font-medium text-white mb-1">
          {selectedRobot.name}
        </div>
        <div className="flex items-center">
          {/* Bağlantı durumunu context'ten al */}
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            } mr-1`}
          ></div>
          <span className="text-xs text-gray-300">
            {/* Bağlantı durumunu context'ten al */}
            {isConnected ? "Bağlı" : "Bağlantı Yok"}
          </span>
        </div>
      </div>

      {/* API Hata Gösterimi */}
      {apiError && (
        <div className="mb-2 p-2 bg-red-900 border border-red-700 text-red-200 rounded-md text-xs text-center">
          {apiError}
        </div>
      )}

      {/* Motor Switchleri */}
      {/* Orijinal kodda flex-wrap gap-3 vardı, dikey liste daha uygun olabilir */}
      <div className="flex flex-col gap-1 mb-3">
        {Object.keys(motors).map((motorId) => (
          <MotorSwitch // Yeniden adlandırılmış component kullanıldı
            key={motorId}
            motorId={motorId}
            label={`J${motorId.slice(-1)}`} // J1, J2 gibi etiketler
          />
        ))}
      </div>

      {/* Aksiyon Butonları */}
      <div className="flex items-center justify-between gap-2">
        {" "}
        {/* justify-between eklendi */}
        <Button
          onClick={handleTurnAllMotorsOn}
          className="bg-green-600 hover:bg-green-700 py-1 px-2 text-xs flex-1" // flex-1 eklendi
          // Bağlantı yoksa veya yükleniyorsa disable et
          disabled={!isConnected || loading}
        >
          Tümünü Aç
        </Button>
        <Button
          onClick={handleEmergencyStop}
          className="bg-red-600 hover:bg-red-700 py-1 px-2 text-xs border border-yellow-500 flex-1" // flex-1 eklendi
          // Bağlantı yoksa veya yükleniyorsa disable et
          disabled={!isConnected || loading}
        >
          Acil Stop
        </Button>
      </div>
    </div>
  );
}
