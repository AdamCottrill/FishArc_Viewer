import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {update_filter} from "./filter_reducers";

const initialState = { projectType: "IAIS", table: "FN011", field: "PRJ_CD" };

export const FieldStatsSlice = createSlice({
  name: "field-stats",
  initialState,
  reducers: {
    update: update_filter
  },
});

export const { update } = FieldStatsSlice.actions;
export default FieldStatsSlice.reducer;
