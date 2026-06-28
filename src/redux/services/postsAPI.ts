// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { type IPost } from "../../@types/post";
// import { PSOT_PATHS } from "../../constants/postPaths";
// import { API_KEY } from "../../config/api";

// export const postsApi = createApi({
//   reducerPath: "postsApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_KEY,
//   }),
//   tagTypes: ["Posts"],
//   endpoints: (builder) => ({
//     getPosts: builder.query<IPost[], void>({
//       query: () => PSOT_PATHS.GET_POSTS,
//       providesTags: ["Posts"],
//     }),
//     getPostById: builder.query<IPost, Partial<string>>({
//       query: (id: string) => PSOT_PATHS.GET_SINGLE_POST.replace(":id", id),
//       providesTags: ["Posts"],
//     }),
//     newPost: builder.mutation<IPost, Partial<IPost>>({
//       query: (body: IPost) => ({
//         url: PSOT_PATHS.ADD_POST,
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Posts"],
//     }),
//     deletePostApi: builder.mutation<{ success: boolean; id: string }, string>({
//       query: (id: string) => ({
//         url: PSOT_PATHS.DELETE_POST.replace(":id", id),
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Posts"],
//     }),
//     updatePostApi: builder.mutation<
//       IPost,
//       { id: string; data: Partial<IPost> }
//     >({
//       query: ({ id, data }: { id: string; data: Partial<IPost> }) => ({
//         url: PSOT_PATHS.UPDATE_POST.replace(":id", id),
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ["Posts"],
//     }),
//   }),
// });

// export const {
//   useGetPostsQuery,
//   useNewPostMutation,
//   useGetPostByIdQuery,
//   useUpdatePostApiMutation,
//   useDeletePostApiMutation,
// } = postsApi;

// // import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// // import { IPost } from "../../@types/post";
// // import { PSOT_PATHS } from "../../constants/postPaths";
// // import { API_KEY_DUMMY } from "../../config/api";

// // export const postsApi = createApi({
// //   reducerPath: "postsApi",
// //   baseQuery: fetchBaseQuery({
// //     baseUrl: API_KEY_DUMMY,
// //   }),
// //   tagTypes: ["Posts"],
// //   endpoints: (builder) => ({
// //     getPosts: builder.query<IPost[], void>({
// //       query: () => PSOT_PATHS.GET_POSTS,
// //     }),
// //     getPostById: builder.query<IPost, Partial<string>>({
// //       query: (id: string) => PSOT_PATHS.GET_SINGLE_POST.replace(":id", id),
// //     }),
// //     newPost: builder.mutation<IPost, Partial<IPost>>({
// //       query: (body: IPost) => ({
// //         url: PSOT_PATHS.ADD_POST,
// //         method: "POST",
// //         body,
// //       }),
// //     }),
// //     deletePostApi: builder.mutation<{ success: boolean; id: string }, string>({
// //       query: (id) => ({
// //         url: PSOT_PATHS.DELETE_POST.replace(":id", id),
// //         method: "DELETE",
// //       }),
// //       // async onQueryStarted(id, { dispatch, queryFulfilled }) {
// //       //   const patchResult = dispatch(
// //       //     postsApi.util.updateQueryData(
// //       //       "getPosts",
// //       //       undefined,
// //       //       (draft: IPost[]) => {
// //       //         return draft.filter((post) => post.id !== id);
// //       //       },
// //       //     ),
// //       //   );
// //       //   try {
// //       //     await queryFulfilled;
// //       //   } catch {
// //       //     patchResult.undo(); // back is fail
// //       //   }
// //       // },
// //     }),
// //     // ! Explain what is happend here please !!<<<<<<<<<<
// //     // updatePostApi: builder.mutation<IPost, Partial<IPost> & Pick<IPost, 'id'>>({
// //     updatePostApi: builder.mutation<
// //       IPost,
// //       { id: string; data: Partial<IPost> }
// //     >({
// //       query: ({ id, data }) => ({
// //         url: PSOT_PATHS.UPDATE_POST.replace(":id", id),
// //         method: "PATCH",
// //         body: data,
// //       }),
// //       // onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
// //       //   const patchResult = dispatch(
// //       //     postsApi.util.updateQueryData(
// //       //       "getPosts",
// //       //       undefined,
// //       //       (draft: IPost[]) => {
// //       //         const post = draft.find((p) => p.id === id);
// //       //         if (post) Object.assign(post, data);
// //       //       },
// //       //     ),
// //       //   );
// //       //   queryFulfilled.catch(() => patchResult.undo());
// //       // },
// //       invalidatesTags: ["Posts"],

// //       // async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
// //       //   try {
// //       //     const { data: updatedPost } = await queryFulfilled;
// //       //     dispatch(
// //       //       postsApi.util.updateQueryData(
// //       //         "getPosts",
// //       //         undefined,
// //       //         (draft: IPost[]) => {
// //       //           const post = draft.find((p) => p.id === id);
// //       //           if (post) {
// //       //             Object.assign(post, updatedPost);
// //       //           }
// //       //         },
// //       //       ),
// //       //     );
// //       //   } catch {}
// //       // },
// //       // ! Explain what is happen here please !!>>>>>>>>>>
// //     }),
// //   }),
// // });

// // export const {
// //   useGetPostsQuery,
// //   useNewPostMutation,
// //   useGetPostByIdQuery,
// //   useUpdatePostApiMutation,
// //   useDeletePostApiMutation,
// // } = postsApi;
