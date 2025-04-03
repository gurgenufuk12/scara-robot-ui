export interface RobotDetails {
  id: string;
  name: string;
  axisCount: number;
  type: string;
  jointValues: number[];
  motors: { [key: string]: boolean };
  isConnected: boolean;
  status: "idle" | "moving" | "error";
}

export interface RobotState {
  robotType: "scara" | "industrial" | null;
  selectedRobotId: string;
  robots: {
    [key: string]: RobotDetails;
  };
}
