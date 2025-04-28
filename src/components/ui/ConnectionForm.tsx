import React, { useState } from "react";
import { useConnection } from "@/contexts/ConnectionContext"; // Context hook'unu import et
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
// Input component'iniz varsa

export const ConnectionForm = () => {
  const [inputIp, setInputIp] = useState("");
  const { connect, disconnect, isLoading, error, isConnected, ipAddress } =
    useConnection();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputIp.trim()) {
      const success = await connect(inputIp.trim());
      if (success) {
        // Bağlantı başarılı olduktan sonra input'u temizleyebilir veya başka bir işlem yapabilirsiniz
        // setInputIp(''); // İsteğe bağlı
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setInputIp(""); // Bağlantı kesildiğinde input'u temizle
  };

  // Zaten bağlıysa, bağlantı bilgisini ve kesme butonunu göster
  if (isConnected && ipAddress) {
    return (
      <Card className="bg-gray-900 p-4 rounded-lg shadow border border-green-700 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-green-300">
            <span className="font-semibold">Bağlandı:</span> {ipAddress}
          </p>
          <Button onClick={handleDisconnect} disabled={isLoading}>
            Bağlantıyı Kes
          </Button>
        </div>
      </Card>
    );
  }

  // Bağlı değilse, bağlantı formunu göster
  return (
    <Card className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-700 mb-6">
      <h2 className="text-xl text-white font-bold mb-4">Robot Bağlantısı</h2>
      <form onSubmit={handleConnect}>
        <div className="mb-4">
          <label
            htmlFor="ipAddressInput"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Robot IP Adresi
          </label>
          <input // Kendi Input component'inizi kullanın veya standart input
            id="ipAddressInput"
            type="text"
            value={inputIp}
            onChange={(e) => setInputIp(e.target.value)}
            placeholder="Örn: 192.168.1.100"
            className="w-full bg-gray-600" // Stilleri ayarlayın
            disabled={isLoading}
            required
          />
        </div>
        <Button disabled={isLoading || !inputIp.trim()} className="w-full">
          {isLoading ? "Bağlanılıyor..." : "Bağlan"}
        </Button>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </form>
    </Card>
  );
};
