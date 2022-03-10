import { createSlice } from "@reduxjs/toolkit";

import { FN121ListFilter } from "../../interfaces";
import { update_filter, append_filter, remove_filter } from "./filter_reducers";

const initialState: FN121ListFilter = {};

export const FN121ListFilterSlice = createSlice({
  name: "FN121List-filter",
  initialState,
  reducers: {
    update: update_filter,
    append: append_filter,
    remove: remove_filter,
  },
});

export const { update, remove, append } = FN121ListFilterSlice.actions;
export default FN121ListFilterSlice.reducer;
