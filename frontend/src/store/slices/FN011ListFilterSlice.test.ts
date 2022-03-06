import { FilterInterface } from "../../interfaces";
import reducer, { update, remove, append } from "./FN011ListFilterSlice";

// test("It should return initial state", () => {
//   // empty array
//   expect(reducer(undefined, {})).toEqual({});
// });

test("Update should change property value", () => {
    const previousState:FilterInterface = {};

  expect(reducer(previousState, update({ prj_cd__like: "006" }))).toEqual({
    prj_cd__like: "006",
  });
});

test("Append should add value to empty array of values", () => {
  const previousState = {};

  expect(reducer(previousState, append({ project_type: "red" }))).toEqual({
    project_type: ["red"],
  });
});

test("Append should add value to existing array of values", () => {
  const previousState = {
    project_type: ["red"],
  };

  const observed = reducer(previousState, append({ project_type: "yellow" }));
  const expected = ["red", "yellow"];

  expect(observed["project_type"]).toEqual(expected);
});

test("Append should not duplicate values", () => {
  const previousState = {
    project_type: ["red"],
  };

  const observed = reducer(previousState, append({ project_type: "red" }));

  expect(observed).toEqual(previousState);
});

test("Remove value should remove the property from state", () => {
  const previousState = { prj_cd__like: "006" };

  expect(reducer(previousState, remove({ prj_cd__like: "" }))).toEqual({});
});

test("Remove value should remove the value from the array if the property is a array", () => {
  const previousState = {
    project_type: ["red", "yellow"],
  };

  const observed = reducer(previousState, remove({ project_type: "yellow" }));
  const expected = ["red"];

  expect(observed["project_type"]).toEqual(expected);
});

test("Remove will result in an empty array it there are not other elements ", () => {
  const previousState = {
    project_type: ["red"],
  };

  const observed = reducer(previousState, remove({ project_type: "red" }));
  const expected = [];

  expect(observed['project_type']).toEqual(expected);
});
