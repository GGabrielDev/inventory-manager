import { configureStore } from '@reduxjs/toolkit'

import authReducer from './authSlice.ts'
import itemTableReducer, {
  loadState as loadItemTableState,
} from './itemTableSlice.ts'
import themeReducer from './themeSlice.ts'

const itemTableState = localStorage.getItem('itemTableState')
const preloadedItemTableState = itemTableState ? JSON.parse(itemTableState) : {}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    itemTable: itemTableReducer,
  },
  preloadedState: {
    itemTable: preloadedItemTableState,
  },
})

store.dispatch(loadItemTableState(preloadedItemTableState))

store.subscribe(() => {
  localStorage.setItem(
    'itemTableState',
    JSON.stringify(store.getState().itemTable)
  )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
