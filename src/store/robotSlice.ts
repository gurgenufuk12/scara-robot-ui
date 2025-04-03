import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RobotState } from "./types";

const initialState: RobotState = {
  robotType: null,
  selectedRobotId: "",
  robots: {
    robot1: {
      id: "robot1",
      name: "SCARA Robot 1",
      axisCount: 2,
      type: "SCARA",
      jointValues: [0, 0],
      motors: {
        motor1: false,
        motor2: false,
      },
      isConnected: false,
      status: "idle",
    },
    robot2: {
      id: "robot2",
      name: "SCARA Robot 2",
      axisCount: 2,
      type: "SCARA",
      jointValues: [0, 0],
      motors: {
        motor1: false,
        motor2: false,
      },
      isConnected: false,
      status: "idle",
    },
    robot3: {
      id: "robot3",
      name: "Endüstriyel Robot",
      axisCount: 6,
      type: "Industrial",
      jointValues: [0, 0, 0, 0, 0, 0],
      motors: {
        motor1: false,
        motor2: false,
        motor3: false,
        motor4: false,
        motor5: false,
        motor6: false,
      },
      isConnected: false,
      status: "idle",
    },
  },
};

const robotSlice = createSlice({
  name: "robot",
  initialState,
  reducers: {
    setRobotType: (
      state,
      action: PayloadAction<"scara" | "industrial" | null>
    ) => {
      state.robotType = action.payload;

      state.selectedRobotId = "";

      if (action.payload === "industrial") {
        state.selectedRobotId = "robot3";
      }
    },

    selectRobot: (state, action: PayloadAction<string>) => {
      state.selectedRobotId = action.payload;
    },

    updateJointValue: (
      state,
      action: PayloadAction<{
        robotId: string;
        jointIndex: number;
        value: number;
      }>
    ) => {
      const { robotId, jointIndex, value } = action.payload;
      if (state.robots[robotId]) {
        state.robots[robotId].jointValues[jointIndex] = value;
      }
    },

    resetJoints: (state, action: PayloadAction<string>) => {
      const robotId = action.payload;
      if (state.robots[robotId]) {
        const axisCount = state.robots[robotId].axisCount;
        state.robots[robotId].jointValues = Array(axisCount).fill(0);
      }
    },

    toggleMotor: (
      state,
      action: PayloadAction<{
        robotId: string;
        motorId: string;
        status?: boolean;
      }>
    ) => {
      const { robotId, motorId, status } = action.payload;

      if (state.robots[robotId] && motorId in state.robots[robotId].motors) {
        if (status !== undefined) {
          state.robots[robotId].motors[motorId] = status;
        } else {
          state.robots[robotId].motors[motorId] =
            !state.robots[robotId].motors[motorId];
        }
      }
    },

    setAllMotors: (
      state,
      action: PayloadAction<{
        robotId: string;
        status: boolean;
      }>
    ) => {
      const { robotId, status } = action.payload;
      if (state.robots[robotId]) {
        for (const motorId in state.robots[robotId].motors) {
          state.robots[robotId].motors[motorId] = status;
        }
      }
    },

    emergencyStop: (state) => {
      for (const robotId in state.robots) {
        for (const motorId in state.robots[robotId].motors) {
          state.robots[robotId].motors[motorId] = false;
        }
        state.robots[robotId].status = "idle";
      }
    },
    // write me another to toggle motors false with robotId
    toggleAllMotors: (
      state,
      action: PayloadAction<{
        robotId: string;
        status?: boolean;
      }>
    ) => {
      const { robotId, status } = action.payload;
      if (state.robots[robotId]) {
        for (const motorId in state.robots[robotId].motors) {
          state.robots[robotId].motors[motorId] =
            status !== undefined ? status : !state.robots[robotId].motors[motorId];
        }
      }
    },

    setRobotStatus: (
      state,
      action: PayloadAction<{
        robotId: string;
        status: "idle" | "moving" | "error";
      }>
    ) => {
      const { robotId, status } = action.payload;
      if (state.robots[robotId]) {
        state.robots[robotId].status = status;
      }
    },

    setRobotConnection: (
      state,
      action: PayloadAction<{
        robotId: string;
        isConnected: boolean;
      }>
    ) => {
      const { robotId, isConnected } = action.payload;
      if (state.robots[robotId]) {
        state.robots[robotId].isConnected = isConnected;
      }
    },
  },
});

export const {
  setRobotType,
  selectRobot,
  updateJointValue,
  resetJoints,
  toggleMotor,
  setAllMotors,
  emergencyStop,
  setRobotStatus,
  setRobotConnection,
  toggleAllMotors,
} = robotSlice.actions;

export default robotSlice.reducer;
