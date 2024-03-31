import { configureStore } from "@reduxjs/toolkit";
import nodeReducer from "./features/nodeSlice";
import fileDataReducer from "./features/fileDataSlice";
// import { userApi } from "./services/userApi";
// import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
  reducer: {
    node: nodeReducer,
    fileData: fileDataReducer,
    // [userApi.reducerPath]: userApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat(),
});

// setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
