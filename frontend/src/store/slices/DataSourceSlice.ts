import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface PayloadInterface {
    value: string;
}

const initialState:PayloadInterface = { value: "glarc" };

export const DataSourceSlice = createSlice({
  name: "data-source",
  initialState,
  reducers: {
     update: (state, action: PayloadAction<string>) => {
       return { ...state, value: action.payload };
    },
  },
});

export const { update } = DataSourceSlice.actions;
export default DataSourceSlice.reducer;
