const reducer = (state, action) => {
  let current, key, value;
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload };
    case "add":
      [key, value] = Object.entries(action.payload)[0];
      current = { ...state }?.[key] || [];
      current = [...new Set([...current, value])];
      return { ...state, [key]: current };
    case "pop":
      [key, value] = Object.entries(action.payload)[0];

      current = { ...state };

      if (current[key]?.filter) {
        current[key] = current[key].filter((val) => val !== value);
      } else {
        delete current[key];
      }

      return current;

    default:
      return state;
  }
};

export default reducer;
