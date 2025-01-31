import { Dispatch } from "redux"
import { authAPI } from "../api/todolists-api"
import { setIsLoggedIn } from "../features/Login/auth-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"



export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

const appSlice = createSlice({
  name: 'app',
  initialState: {
    status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{error: string | null}>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{status: RequestStatusType}>) => {
      state.status = action.payload.status
    },
    setAppInitialized: (state, action: PayloadAction<{isInitialized: boolean}>) => {
      state.isInitialized = action.payload.isInitialized
    },
  }
})

export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn({isLoggedIn: true}))
    } else {
    }

    dispatch(setAppInitialized({isInitialized: true}))
  })
}

export const appReducer = appSlice.reducer
export const { setAppError, setAppStatus, setAppInitialized } = appSlice.actions
export type AppInitialState = ReturnType<typeof appSlice.getInitialState>



