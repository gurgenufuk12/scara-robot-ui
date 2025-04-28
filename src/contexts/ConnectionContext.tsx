"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";

interface ConnectionState {
  ipAddress: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: (ip: string) => Promise<boolean>; // Bağlantı başarılı olursa true döner
  disconnect: () => void;
  getApiUrl: (endpoint: string) => string | null; // Tam API URL'i oluşturur
}

// Default state or undefined for initial check
const ConnectionContext = createContext<ConnectionState | undefined>(undefined);

export const ConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Bağlantı testi ve durum güncelleme fonksiyonu
  const connect = useCallback(async (ip: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsConnected(false);
    setIpAddress(null); // Doğrulayana kadar IP'yi null yap

    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ip)) {
      setError("Geçersiz IP adresi formatı.");
      setIsLoading(false);
      return false;
    }

    // Backend'de basit bir 'ping' veya 'status' endpoint'i olduğunu varsayalım
    const testUrl = `http://${ip}:8000/api/robot/ping`;

    try {
      const response = await fetch(testUrl, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        // Backend özel bir durum kodu veya mesaj gönderiyorsa burada kontrol edilebilir
        throw new Error(
          `Bağlantı testi başarısız: ${response.statusText} (${response.status})`
        );
      }

      setIpAddress(ip);
      setIsConnected(true);
      setError(null);
      console.log(`Başarıyla bağlandı: ${ip}`);
      setIsLoading(false);
      return true; // Başarılı olduğunu belirt
    } catch (err: any) {
      console.error("Bağlantı hatası:", err);
      let errorMessage = "Robota bağlanılamadı.";
      if (err.name === "AbortError") {
        errorMessage = "Bağlantı zaman aşımına uğradı.";
      } else if (err instanceof TypeError) {
        // Genellikle Network Error veya CORS
        errorMessage = "Ağ hatası veya sunucu erişilemez durumda.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsConnected(false);
      setIpAddress(null);
      setIsLoading(false);
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    setIpAddress(null);
    setIsConnected(false);
    setError(null);
    console.log("Bağlantı kesildi.");
  }, []);

  const getApiUrl = useCallback(
    (endpoint: string): string | null => {
      if (isConnected && ipAddress) {
        // Endpoint başında '/' yoksa ekle
        const formattedEndpoint = endpoint.startsWith("/")
          ? endpoint
          : `/${endpoint}`;
        return `http://${ipAddress}:8000/api/robot${formattedEndpoint}`;
      }
      return null;
    },
    [isConnected, ipAddress]
  );

  return (
    <ConnectionContext.Provider
      value={{
        ipAddress,
        isConnected,
        isLoading,
        error,
        connect,
        disconnect,
        getApiUrl,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

// Context'i kullanmak için özel hook
export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error(
      "useConnection hook, ConnectionProvider içinde kullanılmalıdır"
    );
  }
  return context;
};
