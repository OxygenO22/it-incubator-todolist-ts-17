import { setAppStatus } from "app/app-reducer"
import { authAPI, LoginParamsType } from "../../api/todolists-api"
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "app/store"

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  }
})

// thunks
export const loginTC =
  (data: LoginParamsType): AppThunk => (dispatch) => {
    dispatch(setAppStatus({status: "loading"}))
    authAPI
      .login(data)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(setIsLoggedIn({isLoggedIn: true}))
          dispatch(setAppStatus({status: "succeeded"}))
        } else {
          handleServerAppError(res.data, dispatch)
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
export const logoutTC = (): AppThunk => (dispatch) => {
  dispatch(setAppStatus({status: "loading"}))
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedIn({isLoggedIn: false}))
        dispatch(setAppStatus({status: "succeeded"}))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}


export const authReducer = authSlice.reducer
export const { setIsLoggedIn } = authSlice.actions


