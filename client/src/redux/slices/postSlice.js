import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getUserProfile = createAsyncThunk(
    "user/getUserProfile",
    async (body) => {
        try {
            const response = await axiosClient.post(
                "/user/getUserProfile",
                body
            );
            // console.log("userProfile", response);
            return response?.result;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

export const likeAndUnlikePost = createAsyncThunk(
    "post/likeAndUnlike",
    async (body) => {
        try {
        
            const response = await axiosClient.post("/posts/like", body);
            // console.log("post", response);
            return response.result?.post;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

const postSlice = createSlice({
    name: "postSlice",
    initialState: {
        userProfile: {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.userProfile = action.payload;
            })
            .addCase(likeAndUnlikePost.fulfilled, (state, action) => {
                const post = action.payload;
                const index = state?.userProfile?.posts?.findIndex(
                    (item) => item._id === post._id
                );
                // console.log("post slice :", post , index);
                if (index != undefined && index != -1) {
                    state.userProfile.posts[index] = post;
                }
            });
    },
});

export default postSlice.reducer;
