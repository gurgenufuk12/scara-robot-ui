import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

const API_URL = "http://localhost:8000/api/robot";

interface MaxVelocityData {
  [key: string]: number;
}

interface VelocityLimitsProps {
  onLimitsFetched: (limits: MaxVelocityData) => void; // Callback prop
  onError: (message: string | null) => void; // Hata mesajı için callback
}

export default function VelocityLimits({
  onLimitsFetched,
  onError,
}: VelocityLimitsProps) {
  const { selectedRobotId, robots } = useAppSelector((state) => state.robot);
  const [loading, setLoading] = useState<boolean>(false);
  const selectedRobot = selectedRobotId ? robots[selectedRobotId] : null;
  const axisCount = selectedRobot ? selectedRobot.axisCount : 0;

  // Maksimum hız limitlerini API'den al
  const fetchMaximumVelocities = async () => {
    if (!selectedRobotId) {
      onLimitsFetched({}); // Robot seçili değilse limitleri temizle
      onError(null);
      return;
    }

    setLoading(true);
    onError(null); // Önceki hataları temizle

    // --- MOCK DATA BAŞLANGICI ---
    // Gerçek API çağrısı yerine mock data kullanıyoruz
    await new Promise((resolve) => setTimeout(resolve, 400)); // Simüle bekleme
    let mockMaxVelocities: MaxVelocityData = {};
    try {
      // Örnek limitler (Eksen sayısına göre ayarlanabilir)
      // Gerçek API'den gelen yanıta göre bu yapıyı güncelleyin
      if (axisCount === 2) {
        mockMaxVelocities = { j1: 100, j2: 90 };
      } else if (axisCount === 6) {
        mockMaxVelocities = {
          j1: 120,
          j2: 110,
          j3: 130,
          j4: 80,
          j5: 75,
          j6: 100,
        };
      } else {
        for (let i = 1; i <= axisCount; i++) {
          mockMaxVelocities[`j${i}`] = 100 + i * 10; // Örnek limitler
        }
      }
      // --- MOCK DATA SONU ---

      console.log("Alınan Maksimum Hız Limitleri (Mock):", mockMaxVelocities);
      onLimitsFetched(mockMaxVelocities); // Alınan limitleri parent component'e gönder
    } catch (error) {
      console.error("Maksimum hız limitleri alınamadı (Mock):", error);
      onError("Maksimum hız limitleri alınamadı.");
      onLimitsFetched({}); // Hata durumunda limitleri temizle
    } finally {
      setLoading(false);
    }

    /* // --- GERÇEK API ÇAĞRISI (YORUM SATIRI) ---
    try {
      const response = await fetch(
        `${API_URL}/get-maximum-velocities?robotId=${selectedRobotId}`
      );
      
      if (!response.ok) {
        throw new Error("Maksimum hız limitleri alınamadı");
      }
      
      const data = await response.json();
      const fetchedLimits = data.maxVelocities || {}; // API yanıtına göre ayarlayın
      console.log("Alınan Maksimum Hız Limitleri:", fetchedLimits);
      onLimitsFetched(fetchedLimits); // Alınan limitleri parent component'e gönder
      
    } catch (error) {
      console.error("Maksimum hız limitleri alınamadı:", error);
      onError("Maksimum hız limitleri alınamadı. Lütfen daha sonra tekrar deneyin.");
      onLimitsFetched({}); // Hata durumunda limitleri temizle
    } finally {
      setLoading(false);
    }
    */
  };

  // Robot ID değiştiğinde limitleri yeniden al
  useEffect(() => {
    fetchMaximumVelocities();
  }, [selectedRobotId]);

  // Bu component'in kendisi bir UI render etmiyor, sadece veri alıp iletiyor.
  // İsterseniz yükleme durumunu veya limitleri burada gösterebilirsiniz.
  // Örneğin:
  // if (loading) return <div className="text-xs text-gray-400">Maksimum limitler yükleniyor...</div>;

  return null; // Veya isteğe bağlı olarak limitleri gösteren bir UI
}
