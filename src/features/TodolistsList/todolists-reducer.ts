import { todolistsAPI, TodolistType } from "../../api/todolists-api"
import { Dispatch } from "redux"
import { RequestStatusType, setAppStatus } from "../../app/app-reducer"
import { handleServerNetworkError } from "../../utils/error-utils"
import { AppThunk } from "../../app/store"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodolist: (state, action: PayloadAction<{id: string}>) => {
      const index = state.findIndex(todo => todo.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    },
    addTodolist: (state, action: PayloadAction<{todolist: TodolistType}>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
    changeTodolistTitle: (state, action: PayloadAction<{id: string, title: string}>) => {
      const index = state.findIndex(todo => todo.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    },
    changeTodolistFilter: (state, action: PayloadAction<{id: string, filter: FilterValuesType}>) => {
      const index = state.findIndex(todo => todo.id === action.payload.id)
      if (index !== -1) {
        state[index].filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{id: string, entityStatus: RequestStatusType}>) => {
      const index = state.findIndex(todo => todo.id === action.payload.id)
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus
      }
    },
    setTodolists: (state, action: PayloadAction<{todolists: TodolistType[]}>) => {
      //return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
      action.payload.todolists.forEach(tl => {
        state.push({ ...tl, filter: "all", entityStatus: "idle" })
      })
      
    },
  }
})

export const todolistsReducer = todolistsSlice.reducer
export const { removeTodolist, addTodolist, changeTodolistTitle, changeTodolistFilter, changeTodolistEntityStatus, setTodolists } = todolistsSlice.actions

// actions


export const setTodolistsAC = (todolists: Array<TodolistType>) => ({ type: "SET-TODOLISTS", todolists }) as const

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatus({status: "loading"}))
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatus({status: "succeeded"}))
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatus({status: "loading"}))
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatus({id: todolistId, entityStatus: "loading"}))
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolist({id: todolistId}))
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(setAppStatus({status: "succeeded"}))
    })
  }
}
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatus({status: "loading"}))
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(addTodolist({todolist: res.data.data.item}))
      dispatch(setAppStatus({status: "succeeded"}))
    })
  }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    todolistsAPI.updateTodolist(id, title).then((res) => {
      dispatch(changeTodolistTitle({id: id, title: title}))
    })
  }
}


export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
