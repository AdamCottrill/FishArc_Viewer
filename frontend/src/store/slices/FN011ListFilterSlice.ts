import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";

//import { isArray } from "../utils";

import { FN011ListFilter } from "../../interfaces";

const initialState: FN011ListFilter = {};

export const FN011ListFilterSlice = createSlice({
  name: "FN011List-filter",
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

    append: (state, action: PayloadAction<{}>) => {
      const [key, value] = Object.entries(action.payload)[0];
      let current: any = { ...state }?.[key] || [];
      current = [...new Set([...current, value])];
      return { ...state, [key]: current };
    },

    remove: (state, action: PayloadAction<{}>) => {
      const [key, value] = Object.entries(action.payload)[0];

      const new_state = { ...state };
      const values = new_state[key];

      if (typeof values === "string") {
        delete new_state[key];
      } else {
        new_state[key] = values.filter((val) => val !== value);
      }

      return new_state;
    },
  },
});

export const { update, remove, append } = FN011ListFilterSlice.actions;
export default FN011ListFilterSlice.reducer;
