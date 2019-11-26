import { useMicroReducer, TProduceFunc } from "./index";
import produce from "immer";
import { renderHook, act } from "@testing-library/react-hooks";

const defaultReducer = {
  increment: state => state + 1,
  decrement: state => state - 1,
  set: (state, value) => value,
  multiplySeed: (state, a, b) => a * b
};
const defaultState = 0;

const setupHook = (reducer, initialState?, producer?: TProduceFunc) =>
  renderHook(() => {
    const [state, dispatch] = useMicroReducer(reducer, initialState, producer);
    // Get out state and dispatch in a cleaner fashion
    return {
      state,
      dispatch
    };
  });

test("Initial state: undefined", () => {
  const { result } = setupHook({});
  expect(result.current.state).toBe(undefined);
});

test("Initial state: 0", () => {
  const { result } = setupHook(defaultReducer, defaultState);
  expect(result.current.state).toBe(0);
});

test("Dispatch gets the expected actions", () => {
  const expectedActions = ["decrement", "increment", "multiplySeed", "set"];
  const { result } = setupHook(defaultReducer, defaultState);
  const actualActions = Object.keys(result.current.dispatch);
  actualActions.sort();

  expect(actualActions).toEqual(expectedActions);
});

test("Dispatch with NO arguments work", () => {
  const { result } = setupHook(defaultReducer, defaultState);
  const currentState = result.current.state;
  act(() => {
    result.current.dispatch.increment();
  });
  expect(result.current.state).toBe(currentState + 1);
});

test("Dispatch with ONE arguments work", () => {
  const { result } = setupHook(defaultReducer, defaultState);

  act(() => {
    result.current.dispatch.set(42);
  });
  expect(result.current.state).toBe(42);
});

test("Dispatch with MULTIPLE arguments work", () => {
  const { result } = setupHook(defaultReducer, defaultState);

  act(() => {
    result.current.dispatch.multiplySeed(7, 6);
  });
  expect(result.current.state).toBe(42);
});

// Immer defaults
const immerReducer = {
  search: (draft, query1: string, query2: string) => {
    draft.query = query1 + " " + query2;
  }
};
const immerState = {
  query: ""
};

test("Immer initial state", () => {
  const { result } = setupHook(immerReducer, immerState, produce);
  expect(result.current.state).not.toEqual({
    query: "hi"
  });
  expect(result.current.state).toEqual({
    query: ""
  });
});

test("Immer dispatch", () => {
  const { result } = setupHook(immerReducer, immerState, produce);
  act(() => {
    result.current.dispatch.search("I am", "awesome");
  });
  expect(result.current.state).toEqual({
    query: "I am awesome"
  });
});
