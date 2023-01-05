import { RoomType } from "../../types";
import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  currentRoom: RoomType | undefined;
  allRooms: RoomType[];
};

const initialState: InitialStateType = {
  currentRoom: undefined,
  allRooms: [],
};

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    joinRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    updateAllRooms: (state, action) => {
      state.allRooms = action.payload;
    },
    setConnectedUserList: (state, action) => {
      if (state.currentRoom) {
        state.currentRoom = {
          ...state.currentRoom,
          connectedUserList: action.payload,
        };
      }
    },
  },
});

export const { joinRoom, updateAllRooms, setConnectedUserList } =
  roomSlice.actions;

export default roomSlice;
