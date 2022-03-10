import { createSlice } from "@reduxjs/toolkit";

import { FN011ListFilter } from "../../interfaces";

import { update_filter, append_filter, remove_filter } from "./filter_reducers";

const initialState: FN011ListFilter = {};

export const FN011ListFilterSlice = createSlice({
  name: "FN011List-filter",
  initialState,
  reducers: {
    update: update_filter,
    append: append_filter,
    remove: remove_filter,
  },
});

export const { update, remove, append } = FN011ListFilterSlice.actions;
export default FN011ListFilterSlice.reducer;
