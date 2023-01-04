import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Socket } from "socket.io-client";

type InitialStateType = {
  userId: number | undefined;
  userNickname: string;
  socket: Socket | undefined;
};

const initialState: InitialStateType = {
  userId: undefined,
  userNickname: "",
  socket: undefined,
};

const mediaUserSlice = createSlice({
  name: "mediaUser",
  initialState,
  reducers: {
    initSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { initSocket } = mediaUserSlice.actions;

export default mediaUserSlice;
