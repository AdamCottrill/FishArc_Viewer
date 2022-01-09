import React, { useState } from "react";

import { Checkbox, Input } from "@chakra-ui/react";

import { contains } from "../utils";

interface Props {
  name: string;
  values: {
    value: string;
    label: string;
  }[];
  checked: string[];

  showFilterInput?: boolean;
  placeholder?: string;
  handleCheck: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

//TODOs - placeholder, option for filtering, move contains to a utils file.

export const CheckBoxGroup = ({
  name,
  values,
  checked,

  handleCheck,
  showFilterInput,
  placeholder,
}: Props): JSX.Element => {
  const [itemFilter, setItemFilter] = useState("");

  const filterInput = showFilterInput || false;

  return (
    <>
      {filterInput && (
        <Input
          value={itemFilter}
          data-testid="checkbox-filter-input"
          type="text"
          size="sm"
          margin={1}
          rounded="full"
          placeholder={placeholder ? placeholder : "Filter..."}
          onChange={(e) => setItemFilter(e.currentTarget.value)}
        />
      )}
      {values.map((item) => {
        if (contains(item.label, itemFilter)) {
          return (
            <Checkbox
              name={name}
              key={item.value}
              value={item.value}
              isChecked={checked.includes(item.value)}
              onChange={handleCheck}
              size="sm"
            >
              {item.label}
            </Checkbox>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};
