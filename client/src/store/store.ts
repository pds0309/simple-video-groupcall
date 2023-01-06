import { combineReducers, configureStore } from "@reduxjs/toolkit";

import mediaUserSlice from "./modules/mediaUserSlice";
import roomSlice from "./modules/roomSlice";

const rootReducer = combineReducers({
  mediaUser: mediaUserSlice.reducer,
  rooms: roomSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
