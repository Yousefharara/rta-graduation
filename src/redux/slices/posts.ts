import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import  {type IPost,type IPostState } from "../../@types/post";
import {type AppDispatch } from "../store";
import axios from "axios";
import { API_KEY } from "../../config/api";
import { PSOT_PATHS } from "../../constants/postPaths";

const initialState: IPostState = {
  isLoading: false,
  errorMessage: "",
  posts: [],
  post: null, 
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setPosts: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    setPost: (state, action: PayloadAction<IPost>) => {
      state.post = action.payload;
    },
    addPost: (state, action: PayloadAction<IPost>) => {
      state.posts = [...state.posts, action.payload];
    },
    editPost: (state, action: PayloadAction<IPost>) => {
      state.posts = state.posts.map((post) =>
        post.id === action.payload.id ? action.payload : post,
      );
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setPost,
  setPosts,
  addPost,
  editPost,
  deletePost,
} = postsSlice.actions;

export default postsSlice.reducer;

// ? /////////////////////////////////////////////////
// ! ///////////////// Action ////////////////////////
// ? /////////////////////////////////////////////////

export const getPosts = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axios.get(API_KEY + PSOT_PATHS.GET_POSTS);
    console.log(data);
    dispatch(setPosts(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addPostAction = (body: IPost) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axios.post(
      API_KEY + PSOT_PATHS.ADD_POST,
      body,
    );
    dispatch(addPost(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const editPostAction =
  (body: IPost) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      console.log("Inside editing >>>>>>");
      const { data } = await axios.patch(
        API_KEY + PSOT_PATHS.UPDATE_POST.replace(":id", body.id),
        body,
      );
      console.log("Updating data : ", data);
      dispatch(editPost(data));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deletePostAction =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      await axios.delete(
        API_KEY + PSOT_PATHS.DELETE_POST.replace(":id", id.toString()),
      );
      dispatch(deletePost(id));
    } catch (err) {
      if (err instanceof Error) dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getSinglePost = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const { data } = await axios.get(
      API_KEY + PSOT_PATHS.GET_SINGLE_POST.replace(":id", id),
    );
    dispatch(setPost(data));
  } catch (err) {
    if (err instanceof Error) dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};
