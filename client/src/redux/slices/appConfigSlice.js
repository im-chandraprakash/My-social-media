import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk("user/getMyInfo", async (body) => {
    try {
        const response = await axiosClient.get("/user/getMyInfo");
        console.log("api called data", response.result.user);
        return response?.result?.user;
    } catch (error) {
        return Promise.reject(error);
    }
});

export const updateMyProfile = createAsyncThunk(
    "user/updateMyProfile",
    async (body) => {
        try {
            const response = await axiosClient.put("/user/", body);
            return response?.result;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

const appConfigSlice = createSlice({
    name: "appConfigSlice",
    initialState: {
        isLoading: false,
        myProfile: {},
        toastData: {},
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        showToast: (state, action) => {
            state.toastData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyInfo.fulfilled, (state, action) => {
                state.myProfile = action?.payload;
            })
            .addCase(updateMyProfile.fulfilled, (state, action) => {
                state.myProfile = action?.payload?.user;
            });
    },
});

export default appConfigSlice.reducer;

export const { setLoading, showToast } = appConfigSlice.actions;
