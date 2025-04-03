import Image from "next/image";
import logo from "../../../public/grass_logo.png";
// import MotorControl from "@/components/MotorControl";

export default function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="Grass Logo" width={120} height={50} />
        <h1 className="text-2xl font-bold text-black">
          SCARA Robot Arayüzü
        </h1>
      </div>
      {/* <MotorControl /> */}
    </header>
  );
}
