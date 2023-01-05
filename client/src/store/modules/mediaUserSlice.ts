import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Socket } from "socket.io-client";

type InitialStateType = {
  userId: string | undefined;
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
    setUserInfo: (state, action) => {
      state.userId = action.payload.userId;
      state.userNickname = action.payload.userNickname;
    },
  },
});

export const { initSocket, setUserInfo } = mediaUserSlice.actions;

export default mediaUserSlice;
