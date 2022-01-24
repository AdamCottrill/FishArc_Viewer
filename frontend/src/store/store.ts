import { configureStore } from "@reduxjs/toolkit";

import DataSource from "./slices/DataSourceSlice";
import FN011ListFilter from "./slices/FN011ListFilterSlice";
import FN121ListFilter from "./slices/FN121ListFilterSlice";
import FN123ListFilter from "./slices/FN123ListFilterSlice";
import FN125ListFilter from "./slices/FN125ListFilterSlice";

export const store = configureStore({
  reducer: {
    DataSource: DataSource,
    FN011List: FN011ListFilter,
    FN121List: FN121ListFilter,
    FN123List: FN123ListFilter,
    FN125List: FN125ListFilter,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
