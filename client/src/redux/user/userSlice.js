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
        startLoading: (state) =>
        {
            state.loading = true;
        },
        updateUserSuccess: (state, action) =>
        {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        setErrorMessage: (state, action) =>
        {
            state.error = action.payload;
            state.loading = false;
        },
        clearErrorMessage: (state) =>
        {
            state.error = null
        },
        clearUser: () => initialState,
    }
});


export const { startLoading, updateUserSuccess, setErrorMessage, clearErrorMessage, clearUser } = userSlice.actions;

export default userSlice.reducer;