import { Providers } from "./providers";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <ConnectionProvider>
          <Providers>{children}</Providers>
        </ConnectionProvider>
      </body>
    </html>
  );
}
