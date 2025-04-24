import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppSelector } from "@/store/hooks";
import VelocityLimits from "./VelocityLimits";
import { useConnection } from "@/contexts/ConnectionContext";

const API_URL = "http://192.168.2.104:8000/api/robot";

interface VelocityData {
  [key: string]: number;
}

interface MaxVelocityData {
  [key: string]: number;
}

interface ValidationErrorData {
  [key: string]: string | null;
}

export default function VelocityDiagram() {
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);
  const { getApiUrl, connection } = useConnection(); // ConnectionContext'ten bağlantı bilgilerini al
  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;

  const [velocities, setVelocities] = useState<VelocityData>({});
  const [maxVelocities, setMaxVelocities] = useState<MaxVelocityData>({}); // Maksimum limitleri tutacak state
  const [validationErrors, setValidationErrors] = useState<ValidationErrorData>(
    {}
  ); // Doğrulama hatalarını tutacak state
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );
  const [limitFetchError, setLimitFetchError] = useState<string | null>(null); // Limit alma hatası

  // Eksenler için etiketler
  const getAxisLabels = () => {
    return Array.from({ length: axisCount }, (_, i) => `J${i + 1}`);
  };

  // Jog hız değerlerini API'den al (MOCK DATA İLE)
  const fetchJointVelocities = async () => {
    // ... (Bu fonksiyon aynı kalıyor, mock data veya gerçek API çağrısı ile) ...
    if (!selectedRobotId) return;
    setLoading(true);
    setMessage(null);
    setValidationErrors({}); // Hataları temizle

    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      let mockVelocities: VelocityData = {};
      if (axisCount === 2) {
        mockVelocities = { j1: 50.5, j2: 45.0 };
      } else if (axisCount === 6) {
        mockVelocities = {
          j1: 60.0,
          j2: 55.5,
          j3: 70.2,
          j4: 40.0,
          j5: 35.8,
          j6: 50.0,
        };
      } else {
        for (let i = 1; i <= axisCount; i++) {
          mockVelocities[`j${i}`] = 30.0 + i * 5;
        }
      }
      setVelocities(mockVelocities);
      // setMessage({ type: "success", text: "Hız değerleri başarıyla alındı (Mock)" }); // İsteğe bağlı mesaj
    } catch (error) {
      console.error("Hız değerleri alınamadı (Mock):", error);
      setMessage({ type: "error", text: "Hız değerleri alınamadı (Mock)." });
    } finally {
      setLoading(false);
    }
  };

  // VelocityLimits component'inden gelen maksimum limitleri state'e kaydet
  const handleLimitsFetched = (limits: MaxVelocityData) => {
    setMaxVelocities(limits);
    setValidationErrors({}); // Yeni limitler geldiğinde eski hataları temizle
  };

  // Limit alma sırasında hata olursa state'e kaydet
  const handleLimitFetchError = (errorMessage: string | null) => {
    setLimitFetchError(errorMessage);
    if (errorMessage) {
      setMessage({ type: "error", text: errorMessage }); // Genel mesaj olarak da göster
    }
  };

  // Robot değiştiğinde veya eksen sayısı değiştiğinde hız değerlerini al
  useEffect(() => {
    if (selectedRobotId) {
      fetchJointVelocities();
      // Maksimum limitler VelocityLimits component'i tarafından otomatik alınacak
    } else {
      setVelocities({});
      setMaxVelocities({});
      setMessage(null);
      setValidationErrors({});
      setLimitFetchError(null);
    }
  }, [selectedRobotId, axisCount]);

  // Formun gönderilmesi - hız değerlerinin güncellenmesi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRobotId) return;

    // Göndermeden önce son bir doğrulama yap
    let hasError = false;
    const currentValidationErrors: ValidationErrorData = {};
    Object.keys(velocities).forEach((jointKey) => {
      const currentVel = velocities[jointKey];
      const maxVel = maxVelocities[jointKey];
      if (maxVel !== undefined && currentVel > maxVel) {
        currentValidationErrors[jointKey] = `Max velocity reached (${maxVel})`;
        hasError = true;
      } else {
        currentValidationErrors[jointKey] = null; // Hata yoksa temizle
      }
    });

    setValidationErrors(currentValidationErrors);

    if (hasError) {
      setMessage({
        type: "error",
        text: "Lütfen hız limitlerini kontrol edin.",
      });
      return; // Hata varsa gönderme
    }

    setSaveLoading(true);
    setMessage(null); // Önceki mesajları temizle

    console.log("Kaydedilecek hız değerleri:", velocities);
    // USE post-velocities API çağrısı yap
    try {
      // Gerçek API çağrısı (şimdilik yorum satırı)
      /* ... */
      await new Promise((resolve) => setTimeout(resolve, 700));
      setMessage({
        type: "success",
        text: "Jog hız değerleri başarıyla güncellendi (Mock)",
      });
    } catch (error) {
      console.error("Hız değerleri güncellenemedi (Mock):", error);
      setMessage({
        type: "error",
        text: "Hız değerleri güncellenemedi (Mock).",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // Input değerlerinin değişimini yakala ve doğrula
  const handleVelocityChange = (joint: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value) || 0;
    const maxVel = maxVelocities[joint];

    // Doğrulama yap
    if (maxVel !== undefined && numValue > maxVel) {
      // Limit aşıldıysa hata mesajı göster ve state'i güncelleme
      setValidationErrors((prev) => ({
        ...prev,
        [joint]: `Max velocity reached (${maxVel})`,
      }));
      // İsteğe bağlı: Kullanıcının girdiği değeri state'e yansıt ama hata ile birlikte
      // setVelocities((prev) => ({ ...prev, [joint]: numValue }));
      // VEYA state'i hiç güncelleme:
      setMessage({
        type: "warning",
        text: `${
          getAxisLabels()[parseInt(joint.substring(1)) - 1]
        } için maksimum hız aşıldı!`,
      });
      // Geçici olarak state'i güncelleyelim ki kullanıcı ne girdiğini görsün ama kaydetmesin
      setVelocities((prev) => ({ ...prev, [joint]: numValue }));
    } else {
      // Limit aşılmadıysa hata mesajını temizle ve state'i güncelle
      setValidationErrors((prev) => ({
        ...prev,
        [joint]: null,
      }));
      setMessage(null); // Genel uyarıyı temizle
      setVelocities((prev) => ({
        ...prev,
        [joint]: numValue,
      }));
    }
  };

  // Axis etiketlerini al
  const axisLabels = getAxisLabels();

  return (
    <Card className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700">
      {/* VelocityLimits component'ini render et ve callback'leri bağla */}
      <VelocityLimits
        onLimitsFetched={handleLimitsFetched}
        onError={handleLimitFetchError}
      />

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl text-white font-bold">
          Jog Hız Ayarları
          {axisCount > 0 && (
            <span className="ml-2 bg-blue-900 px-2 py-0.5 text-xs rounded-full">
              {axisCount} Eksen
            </span>
          )}
        </h2>
        {selectedRobotId && (
          <div className="bg-blue-900 px-3 py-1 rounded-md text-blue-200">
            Robot: {selectedRobot?.name || selectedRobotId}
          </div>
        )}
      </div>

      {!selectedRobotId ? (
        <div className="text-center text-gray-400 py-8">
          Lütfen bir robot seçin
        </div>
      ) : loading ? (
        <div className="text-center text-gray-400 py-8">
          Hız değerleri yükleniyor...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div
            className={`grid ${
              axisCount > 3 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            } gap-4 mb-4`}
          >
            {axisLabels.map((label, index) => {
              const jointKey = `j${index + 1}`;
              const maxVel = maxVelocities[jointKey];
              const error = validationErrors[jointKey];
              return (
                <div
                  key={jointKey}
                  className="mb-2 bg-gray-700 rounded-lg p-4 shadow-inner"
                >
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor={jointKey}
                      className="text-white font-medium"
                    >
                      {label} Ekseni Hızı
                    </label>
                    {/* Maksimum limiti göster (varsa) */}
                    {maxVel !== undefined && !limitFetchError && (
                      <span className="text-xs text-gray-400">
                        Max: {maxVel}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      id={jointKey}
                      type="number"
                      min="0"
                      step="1"
                      value={
                        velocities[jointKey] !== undefined
                          ? velocities[jointKey]
                          : 0
                      }
                      onChange={(e) =>
                        handleVelocityChange(jointKey, e.target.value)
                      }
                      className={`w-full bg-gray-600 text-white border rounded-md py-2 px-3 focus:outline-none focus:ring-2 ${
                        error
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-500 focus:ring-blue-500"
                      }`}
                      disabled={loading || saveLoading}
                      aria-invalid={!!error} // Erişilebilirlik için
                      aria-describedby={error ? `${jointKey}-error` : undefined}
                    />
                    <span className="ml-2 text-gray-300">°/s</span>
                  </div>
                  {/* Hata mesajını göster */}
                  {error && (
                    <p
                      id={`${jointKey}-error`}
                      className="mt-1 text-xs text-red-400"
                    >
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Genel Mesaj Alanı */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-800 text-green-200"
                  : message.type === "warning"
                  ? "bg-yellow-800 text-yellow-200"
                  : "bg-red-800 text-red-200" // error veya diğerleri
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={fetchJointVelocities} // Sadece jog hızlarını yenile
              className="bg-gray-600 hover:bg-gray-700"
              disabled={loading || saveLoading || !selectedRobotId}
            >
              Yenile
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={
                loading ||
                saveLoading ||
                !selectedRobotId ||
                Object.values(validationErrors).some((err) => err !== null)
              } // Hata varsa kaydetmeyi engelle
            >
              {saveLoading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
