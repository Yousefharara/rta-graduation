
// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import type { AppDispatch } from "../store";
// import { API_KEY } from "@/config/api";
// import { AID_TYPES_PATHS } from "@/constants/apiPaths";
// import axios from "axios";
// import type { IAidType } from "@/@types/aidType";
// import type { IGovernorate } from "@/@types/governorate";

// interface IGovernorateState {
//     error: string | null,
//   isLoading: boolean,
//   governorates: IGovernorate[],
//   governorate: IGovernorate | null,
// }


// const initialState: IGovernorateState = {
//   error: "",
//   isLoading: false,
//   governorates: [],
//   governorate: null,
// };

// const governorateSlice = createSlice({
//   name: "governorates",
//   initialState,
//   reducers: {
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.isLoading = action.payload;
//     },
//     setError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//     setGovernorates: (state, action: PayloadAction<IGovernorate[]>) => {
//       state.governorates = action.payload;
//     },
//     setGovernorate: (state, action: PayloadAction<IGovernorate>) => {
//       state.governorate = action.payload;
//     }
//   },
// });

// export const {
//   setLoading,
//   setError,
//   setGovernorate,
//   setGovernorates
// } = governorateSlice.actions;

// export default governorateSlice.reducer;

// // ? /////////////////////////////////////////////////
// // ! ///////////////// Action ////////////////////////
// // ? /////////////////////////////////////////////////

// export const getAidTypes = (token?: string) => async (dispatch: AppDispatch) => {
//   dispatch(setLoading(true));
//   dispatch(setError(null));
//   try {
//     const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
//     const { data } = await axios.get<IGovernorate[]>(API_KEY + , headers);
//     dispatch(setGovernorates(data));
//   } catch (err) {
//     if (err instanceof Error) dispatch(setError(err.message));
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// export const getAidType = (id: number, token?: string) => async (dispatch: AppDispatch) => {
//   dispatch(setLoading(true));
//   dispatch(setError(null));
  
//   try {
//     const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
//     const { data } = await axios.get<IGovernorate>(
//       API_KEY + .replace(":id", String(id)),
//       headers
//     );
//     dispatch(setGovernorate(data));
//   } catch (err) {
//     if (err instanceof Error) dispatch(setError(err.message));
//   } finally {
//     dispatch(setLoading(false));
//   }
// };
