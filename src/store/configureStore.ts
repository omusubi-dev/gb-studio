import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "../reducers/rootReducer";
import electronMiddleware from "./features/electron/electronMiddleware";
import buildGameMiddleware from "../middleware/buildGame";
import musicMiddleware from "./features/music/musicMiddleware";
import soundFxMiddleware from "./features/soundfx/soundfxMiddleware";
import warningsMiddleware from "./features/warnings/warningsMiddleware";
import undoMiddleware from "./features/undo/undoMiddleware";
import clipboardMiddleware from "./features/clipboard/clipboardMiddleware";
import loggerMiddleware from "../middleware/logger";

const DEBUG = false;

let middleware = [
  thunk,
  electronMiddleware,
  buildGameMiddleware,
  musicMiddleware,
  soundFxMiddleware,
  warningsMiddleware,
  undoMiddleware,
  clipboardMiddleware
];

if (process.env.NODE_ENV !== "production" && DEBUG) {
  middleware = [...middleware, loggerMiddleware];
}

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export type AppDispatch = typeof store.dispatch;
export default store;