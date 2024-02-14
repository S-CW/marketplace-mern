import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInLoad: (state) =>
        {
            state.error = null
        },
        signInStart: (state) =>
        {
            state.loading = true;
        },
        signInSuccess: (state, action) =>
        {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) =>
        {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserLoad: (state) =>
        {
            state.error = null
        },
        updateUserStart: (state) =>
        {
            state.loading = true;
        },
        updateUserSuccess: (state, action) =>
        {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) =>
        {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) =>
        {
            state.loading = true
        },
        deleteUserSuccess: () => initialState,
        deleteUserFailure: (state, action) =>
        {
            state.error = action.payload;
            state.loading = false;
        },
        signOutUserStart: (state) =>
        {
            state.loading = true
        },
        signOutUserSuccess: () => initialState,
        signOutUserFailure: (state, action) =>
        {
            state.error = action.payload;
            state.loading = false;
        }
    }
});


export const { signInLoad, signInStart, signInSuccess, signInFailure, updateUserLoad, updateUserFailure, updateUserSuccess, updateUserStart, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } = userSlice.actions;

export default userSlice.reducer;