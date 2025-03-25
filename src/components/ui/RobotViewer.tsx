import React from "react";
interface RobotViewerProps {
  selectedRobot: string;
}
export const RobotViewer: React.FC<RobotViewerProps> = ({ selectedRobot }) => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg h-64 flex items-center justify-center">
      <p>SCARA Robot {selectedRobot} Görselleştirme Alanı </p>
    </div>
  );
};
