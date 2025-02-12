import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { chainCribApi, userReducer } from "./slices";
import storage from "redux-persist/lib/storage";
import {
	persistReducer,
	persistStore,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["user"],
};

const rootReducer = combineReducers({
	user: userReducer,
	[chainCribApi.reducerPath]: chainCribApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: import.meta.env.NODE_ENV !== "production",
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}).concat(chainCribApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
