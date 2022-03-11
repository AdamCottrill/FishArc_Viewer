import { PayloadAction, current } from "@reduxjs/toolkit";




export const append_filter = (state, action: PayloadAction<{}>) => {
  const [key, value] = Object.entries(action.payload)[0];
  let current: any = { ...state }?.[key] || [];
  current = [...new Set([...current, value])];
  return { ...state, [key]: current };
};

export const remove_filter = (state, action: PayloadAction<{}>) => {
  const [key, value] = Object.entries(action.payload)[0];

  const new_state = { ...state };
  const values = new_state[key];

  if (typeof values === "string") {
    delete new_state[key];
  } else {
    new_state[key] = values.filter((val) => val !== value);
  }

  return new_state;
};

export const update_filter = (state, action: PayloadAction<{}>) => {
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
};
