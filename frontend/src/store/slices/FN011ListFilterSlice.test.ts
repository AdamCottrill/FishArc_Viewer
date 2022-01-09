import reducer, { update, remove, append } from "./fn011FilterSlice";

test("It should return initial state", () => {
  // empty array
  expect(reducer(undefined, {})).toEqual({});
});

test("Update should change property value", () => {
  const previousState = {};

  expect(reducer(previousState, update({ prj_cd_like: "006" }))).toEqual({
    prj_cd_like: "006",
  });
});

test("Append should add value to empty array of values", () => {
  const previousState = {};

  expect(reducer(previousState, append({ color: "red" }))).toEqual({
    color: ["red"],
  });
});

test("Append should add value to existing array of values", () => {
  const previousState = {
    color: ["red"],
  };

  const observed = reducer(previousState, append({ color: "yellow" }));
  const expected = ["red", "yellow"];

  expect(observed.color).toEqual(expected);
});

test("Append should not duplicate values", () => {
  const previousState = {
    color: ["red"],
  };

  const observed = reducer(previousState, append({ color: "red" }));
  const expected = ["red"];
  expect(observed).toEqual(previousState);
});

test("Remove value should remove the property from state", () => {
  const previousState = { prj_cd_like: "006" };

  expect(reducer(previousState, remove({ prj_cd_like: "" }))).toEqual({});
});

test("Remove value should remove the value from the array if the property is a array", () => {
  const previousState = {
    color: ["red", "yellow"],
  };

  const observed = reducer(previousState, remove({ color: "yellow" }));
  const expected = ["red"];

  expect(observed.color).toEqual(expected);
});

test("Remove will result in an empty array it there are not other elements ", () => {
  const previousState = {
    color: ["red"],
  };

  const observed = reducer(previousState, remove({ color: "red" }));
  const expected = [];

  expect(observed.color).toEqual(expected);
});
