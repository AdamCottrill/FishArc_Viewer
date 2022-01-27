import React, { useState } from 'react';
import { Input } from '@chakra-ui/react';
import RadioButtons from './RadioButtons';

export default function SidebarRadioInput(props) {
  const { name, items, placeholder, selectedItem, setSelectedItem } = props;

  const [itemFilter, setItemFilter] = useState('');

  const contains = (val, filter) => {
    filter = filter ? filter.toUpperCase() : '';
    val = val ? val.toUpperCase() : '';
    if (filter === '') {
      return true;
    } else {
      return val.includes(filter) ? true : false;
    }
  };

  return (
    <div>
      <Input
        value={itemFilter}
        type="text"
        size="sm"
        margin={1}
        rounded="full"
        placeholder={placeholder ? placeholder : 'Filter fields...'}
        onChange={(e) => setItemFilter(e.target.value)}
      />

      <div>
        <RadioButtons
          name={name}
          items={items.filter((item) => contains(item, itemFilter))}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </div>
    </div>
  );
}
