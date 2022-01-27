import React from 'react';

import { Radio, RadioGroup, Stack } from '@chakra-ui/react';

const FieldsRadioButtons = (props) => {
  const { name, items, selectedItem, setSelectedItem } = props;

  return (
    <RadioGroup
      name={name}
      onChange={setSelectedItem}
      defaultValue={selectedItem}
    >
      <Stack px={2}>
        {items.map((item, i) => {
          return (
            <Radio key={i} mt={1} size="sm" value={item}>
              {item}
            </Radio>
          );
        })}
      </Stack>
    </RadioGroup>
  );
};

export default FieldsRadioButtons;
