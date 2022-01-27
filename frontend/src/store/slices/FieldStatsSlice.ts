import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { projectType: "IAIS", table: "FN011", field:'PRJ_CD'};

export const FieldStatsSlice = createSlice({
  name: "field-stats",
  initialState,
    reducers: {
        update: (state, action: PayloadAction<{}>) => {
      const new_state = { ...state, ...action.payload };
      return Object.fromEntries(
        Object.entries(new_state).filter(([key, value]) => value !== "")
      );
    },
  },
});

export const { update } = FieldStatsSlice.actions;
export default FieldStatsSlice.reducer;
