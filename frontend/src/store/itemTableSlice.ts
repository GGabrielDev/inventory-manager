import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type ColumnVisibilityState = Record<string, boolean>;

const initialState: ColumnVisibilityState = {
  id: true,
  name: true,
  quantity: true,
  unit: true,
  category: true,
  department: true,
  observations: false,
  characteristics: false,
  creationDate: true,
  updatedOn: true,
}

const itemTableSlice = createSlice({
  name: 'itemTable',
  initialState,
  reducers: {
    setColumnVisibility(
      state,
      action: PayloadAction<{ column: string; visible: boolean }>
    ) {
      state[action.payload.column] = action.payload.visible
    },
    loadState(state, action: PayloadAction<ColumnVisibilityState>) {
      return { ...state, ...action.payload }
    },
  },
})

export const { setColumnVisibility, loadState } = itemTableSlice.actions
export default itemTableSlice.reducer