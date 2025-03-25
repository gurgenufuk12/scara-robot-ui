import Image from "next/image";
import logo from "../../../public/grass_logo.png"; // Logonun bulunduğu path

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-white text-white p-4 shadow-lg">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Grass Logo" width={120} height={50} />
        <h1 className="text-2xl font-bold text-black">SCARA Robot Arayüzü</h1>
      </div>
    </header>
  );
}
