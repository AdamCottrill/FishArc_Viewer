import queryString from "query-string";
import { useSearchParams} from "react-router-dom";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector



// a custom hook that exends browser-router hook to get and set search parameters
export const useCustomSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()
    const searchAsObject:{} = queryString.parse(searchParams.toString());
  return [searchAsObject, setSearchParams] as const;
};
