import {FilterInterface, filterType } from "./interfaces"

const isArray = (x: any): boolean => {
  return Object.prototype.toString.call(x) === "[object Array]" ? true : false;
};



export const flattenFilters = (filters:FilterInterface):string[][] => {
    let filterList:string[][] = [];

    //type ValueType = string | string[];

    Object.entries(filters).map(([key, value]):void => {
    if (isArray(value)) {
      value.map((x: string) => filterList.push([key, x]));
    } else {
      filterList.push([key, value]);
    }
  });
  return filterList;
};



/**
 * A little wrapper function around .includes() - returns true if
 * filter is in val, otherwise false.  Used by form widgets to filter
 * long option lists.
 *
 * @param {val} string  -
 * @param {filter} any
 * @returns {boolean}
 */

export const contains = (val: string, filter: string): boolean => {
  filter = filter ? filter.toUpperCase() : "";
  val = val ? val.toUpperCase() : "";
  if (filter === "") {
    return true;
  } else {
    return val.includes(filter) ? true : false;
  }
};


// used by sidebar filters to add a value to state
export const addFilter = (values, setValues, key, value) => {
  let current = { ...values }?.[key] || [];
  current = [...new Set([...current, value])];
  setValues({ ...values, [key]: current });
};

// used by sidebar filters to remove a value from state
export const popFilter = (values, setValues, key, value) => {
  const current = { ...values };
  if (values[key]?.filter) {
    current[key] = current[key].filter((val) => val !== value);
  } else {
    delete current[key];
  }
  setValues({ ...current });
};


export const projectTypes = [
  ["CFCD", "Catch Sampling"],
  ["IAIS", "Netting"],
  ["IM", "Fishway"],
  ["SC", "Creels"],
  ["SD", "Sport Diary"],
  ["SF", "Sport Fish"],
];
