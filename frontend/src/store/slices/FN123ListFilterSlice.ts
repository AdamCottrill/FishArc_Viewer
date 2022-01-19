import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";

//import { isArray } from "../utils";

//import { FN123ListFilter } from "../../interfaces";

const initialState: FN123ListFilter = {};

export const FN123ListFilterSlice = createSlice({
  name: "FN123List-filter",
  initialState,
  reducers: {
    update: (state, action: PayloadAction<{}>) => {
      const new_state = { ...state, ...action.payload };
      return Object.fromEntries(
        Object.entries(new_state).filter(([key, value]) => value !== "")
      );
    },

    append: (state, action: PayloadAction<{}>) => {
      const [key, value] = Object.entries(action.payload)[0];
      let current = { ...state }?.[key] || [];
      current = [...new Set([...current, value])];
      return { ...state, [key]: current };
    },

    remove: (state, action: PayloadAction<{}>) => {
      const [key, value] = Object.entries(action.payload)[0];

      const new_state = { ...state };

      if (new_state[key]?.filter) {
        new_state[key] = new_state[key].filter((val) => val !== value);
      } else {
        delete new_state[key];
      }

      return new_state;
    },
  },
});

export const { update, remove, append } = FN123ListFilterSlice.actions;
export default FN123ListFilterSlice.reducer;