import { createSlice } from "@reduxjs/toolkit";

import { update_filter, append_filter, remove_filter } from "./filter_reducers";

const initialState = {};

export const FN125ListFilterSlice = createSlice({
  name: "FN125List-filter",
  initialState,
  reducers: {
    update: update_filter,
    append: append_filter,
    remove: remove_filter,
  },
});

export const { update, remove, append } = FN125ListFilterSlice.actions;
export default FN125ListFilterSlice.reducer;
