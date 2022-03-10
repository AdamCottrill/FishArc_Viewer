import { createSlice  } from "@reduxjs/toolkit";

import { update_filter, append_filter, remove_filter } from "./filter_reducers";

const initialState = {};

export const FN123ListFilterSlice = createSlice({
  name: "FN123List-filter",
  initialState,
  reducers: {
    update: update_filter,
    append: append_filter,
    remove: remove_filter,
  },
});

export const { update, remove, append } = FN123ListFilterSlice.actions;
export default FN123ListFilterSlice.reducer;
