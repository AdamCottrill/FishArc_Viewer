import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { value: "glarc" };

export const DataSourceSlice = createSlice({
  name: "data-source",
  initialState,
  reducers: {
    // update: (state, action: PayloadAction<{}>) => {
    //   return { ...state, value: action.payload };
      //},
      update: (state, action: PayloadAction<{}>) => {
          const [key, value] = Object.entries(action.payload)[0];
          const new_state = { ...state, ...action.payload };
          if (value === "") {
              delete new_state[key];
          }
          return new_state;
      },
  },
});

export const { update } = DataSourceSlice.actions;
export default DataSourceSlice.reducer;
