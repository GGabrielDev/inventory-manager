import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type ColumnVisibilityState = Record<string, boolean>;

export const initialState: ColumnVisibilityState = {
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
  },
})

export const { setColumnVisibility } = itemTableSlice.actions
export default itemTableSlice.reducer