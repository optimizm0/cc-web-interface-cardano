import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: {},
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		addUser: (state, action) => {
			state.value = action.payload;
		},
		updateUser: (state, action) => {
			state.value = { ...state.value, ...action.payload };
		},
		removeUser: (state) => {
			state.value = null;
		},
	},
});

// Action creators are generated for each case reducer function
export const { addUser, updateUser, removeUser } = userSlice.actions;

export const userReducer = userSlice.reducer;
