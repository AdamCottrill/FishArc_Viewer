import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { projectType: "IAIS", table: "FN011", field: "PRJ_CD" };

export const FieldStatsSlice = createSlice({
  name: "field-stats",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<{}>) => {
      const new_state = { ...state, ...action.payload };
      const item = Object.entries(action.payload);
      if (item.hasOwnProperty("length")) {
        if (item.length === 1) {
          const [key, value] = item[0];
          if (value === "") {
            delete new_state[key];
          }
        }
      }
      return new_state;
    },
  },
});

export const { update } = FieldStatsSlice.actions;
export default FieldStatsSlice.reducer;
