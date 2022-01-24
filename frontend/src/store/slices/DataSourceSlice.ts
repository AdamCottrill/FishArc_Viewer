import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { value: "glarc" };

export const DataSourceSlice = createSlice({
  name: "data-source",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<{}>) => {
      return { ...state, value: action.payload };
    },
  },
});

export const { update } = DataSourceSlice.actions;
export default DataSourceSlice.reducer;
