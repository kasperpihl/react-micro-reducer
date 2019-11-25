import React from "react";
import { useMicroReducer } from "./index";
import produce from "immer";
import { create, act } from "react-test-renderer";

function Tester({ reducer, initialState, producer }) {
  const [state, dispatch] = useMicroReducer(reducer, initialState, producer);
  function ResultInspect({ state, dispatch }) {
    return null;
  }

  return <ResultInspect state={state} dispatch={dispatch} />;
}

function createTester(
  reducer: Parameters<typeof useMicroReducer>[0],
  initialState?: Parameters<typeof useMicroReducer>[1],
  producer?: Parameters<typeof useMicroReducer>[2]
) {
  const testRenderer = create(
    <Tester reducer={reducer} initialState={initialState} producer={producer} />
  );

  return {
    getState: () => testRenderer.toTree().rendered.props.state,
    dispatch: testRenderer.toTree().rendered.props.dispatch
  };
}

const getDefaultTester = () =>
  createTester(
    {
      increment: state => state + 1,
      decrement: state => state - 1,
      set: (state, value) => value,
      multiplySeed: (state, a, b) => a * b
    },
    0
  );

test("Initial state: undefined", () => {
  const { getState } = createTester({});
  expect(getState()).toBe(undefined);
});

test("Initial state: 0", () => {
  const { getState } = getDefaultTester();
  expect(getState()).toBe(0);
});

test("Dispatch gets the expected actions", () => {
  const expectedActions = ["decrement", "increment", "multiplySeed", "set"];
  const { dispatch } = getDefaultTester();
  const actualActions = Object.keys(dispatch);
  actualActions.sort();

  expect(actualActions).toEqual(expectedActions);
});

test("Dispatch with NO arguments work", () => {
  const { getState, dispatch } = getDefaultTester();
  const currentState = getState();
  act(() => {
    dispatch.increment();
  });
  expect(getState()).toBe(currentState + 1);
});

test("Dispatch with ONE arguments work", () => {
  const { getState, dispatch } = getDefaultTester();

  act(() => {
    dispatch.set(42);
  });
  expect(getState()).toBe(42);
});

test("Dispatch with MULTIPLE arguments work", () => {
  const { getState, dispatch } = getDefaultTester();

  act(() => {
    dispatch.multiplySeed(7, 6);
  });
  expect(getState()).toBe(42);
});

// Immer tests
const getImmerTester = () =>
  createTester(
    {
      search: (draft, query1: string, query2: string) => {
        draft.query = query1 + " " + query2;
      }
    },
    {
      query: ""
    },
    produce
  );

test("Immer initial state", () => {
  const { getState } = getImmerTester();
  expect(getState()).not.toEqual({
    query: "hi"
  });
  expect(getState()).toEqual({
    query: ""
  });
});

test("Immer dispatch", () => {
  const { getState, dispatch } = getImmerTester();
  act(() => {
    dispatch.search("I am", "awesome");
  });
  expect(getState()).toEqual({
    query: "I am awesome"
  });
});
