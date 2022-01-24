import React from "react";

import { useNavigate } from "react-router-dom";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { update } from "../store/slices/DataSourceSlice";

export default function DataSourceRadioButtons() {
  const datasource = useAppSelector((state) => state.DataSource);
  const appDispatch = useAppDispatch();

  const navigate = useNavigate();

  const onChange = (value: string): void => {
    appDispatch(update(value));
    const nextUrl = `/${value}`;
    navigate(nextUrl);
  };

  return (
    <RadioGroup onChange={onChange} value={datasource.value}>
      <Stack direction="row">
        <Radio value="glarc">Great Lakes</Radio>
        <Radio value="fisharc">Fish Arc</Radio>
      </Stack>
    </RadioGroup>
  );
}
