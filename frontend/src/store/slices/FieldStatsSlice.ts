import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { projectType: "IAIS", table: "FN011", field: "PRJ_CD" };

export const FieldStatsSlice = createSlice({
  name: "field-stats",
  initialState,
  reducers: {
    //     update: (state, action: PayloadAction<{}>) => {
    //   const new_state = { ...state, ...action.payload };
    //   return Object.fromEntries(
    //     Object.entries(new_state).filter(([key, value]) => value !== "")
    //   );
    // },
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

export const { update } = FieldStatsSlice.actions;
export default FieldStatsSlice.reducer;
