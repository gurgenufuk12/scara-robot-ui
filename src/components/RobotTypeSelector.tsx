import { useAppDispatch } from "../store/hooks";
import { setRobotType } from "@/store/robotSlice";

const API_URL = "http://localhost:8000/api/robot";

export default function RobotTypeSelector() {
  const dispatch = useAppDispatch();

  const handleSelectRobot = (type: "scara" | "industrial") => {
    try {
      // create POST request to API EBNDPOINT "choose_robot_axis"
      // with body { type }
      fetch(`${API_URL}/choose_robot_axis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          dispatch(setRobotType(type));
          console.log("Robot seçimi başarılı:", data);
        })
        .catch((error) => {
          console.error("Robot seçimi hatası:", error);
        });
    } catch (error) {
      console.error("Hata:", error);
    }
  };
  return (
    <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl text-white font-bold mb-6 text-center">
        Robot Tipi Seçin
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => handleSelectRobot("scara")}
          className="flex flex-col items-center p-6 bg-gray-700 hover:bg-blue-800 transition-colors rounded-lg border border-gray-600 group"
        >
          <div className="w-24 h-24 mb-4 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-blue-900">
            <svg
              className="w-16 h-16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V20"
                stroke="#90CAF9"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 4L20 8"
                stroke="#90CAF9"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 10L20 14"
                stroke="#90CAF9"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="4" r="2" fill="#64B5F6" />
              <circle cx="12" cy="10" r="2" fill="#64B5F6" />
              <circle cx="20" cy="8" r="2" fill="#64B5F6" />
              <circle cx="20" cy="14" r="2" fill="#64B5F6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">SCARA Robot</h3>
          <p className="text-gray-300 text-center text-sm mb-3">
            2 Eksenli, yüksek hızlı ve hassas hareket kabiliyetine sahip
            robotlar
          </p>
          <div className="bg-blue-900 px-3 py-1 rounded-full text-xs text-blue-200">
            2 Robot Mevcut
          </div>
        </button>

        <button
          onClick={() => handleSelectRobot("industrial")}
          className="flex flex-col items-center p-6 bg-gray-700 hover:bg-blue-800 transition-colors rounded-lg border border-gray-600 group"
        >
          <div className="w-24 h-24 mb-4 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-blue-900">
            <svg
              className="w-16 h-16"
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
              <circle cx="4" cy="4" r="2" fill="#64B5F6" />
              <circle cx="8" cy="8" r="2" fill="#64B5F6" />
              <circle cx="12" cy="4" r="2" fill="#64B5F6" />
              <circle cx="16" cy="8" r="2" fill="#64B5F6" />
              <circle cx="20" cy="4" r="2" fill="#64B5F6" />
              <circle cx="12" cy="16" r="2" fill="#64B5F6" />
              <circle cx="16" cy="20" r="2" fill="#64B5F6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Endüstriyel Robot
          </h3>
          <p className="text-gray-300 text-center text-sm mb-3">
            6 Eksenli, maksimum hareket serbestliği sunan çok yönlü robotlar
          </p>
          <div className="bg-blue-900 px-3 py-1 rounded-full text-xs text-blue-200">
            1 Robot Mevcut
          </div>
        </button>
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        Kontrol etmek istediğiniz robot tipini seçin
      </div>
    </div>
  );
}
