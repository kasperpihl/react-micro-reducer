import { useReducer } from "react";

// utility type constructor - remove first element of the array/tuple
type Tail<T extends any[]> = ((...args: T) => void) extends (
  head: any,
  ...tail: infer U
) => any
  ? U
  : never;

// I removed second generic, not needed at this level
type TMicroReducer<State> = {
  [key: string]: (state: State, ...args: any[]) => State;
};

// introduced generic R to allow proper infering
export default function useMicroReducer<State, R extends TMicroReducer<State>>(
  actionReducers: R,
  initialState?: State
) {
  const [state, _dispatch] = useReducer(
    (
      state: State,
      action: { type: keyof typeof actionReducers; payload: any[] }
    ) => actionReducers[action.type](state, ...action.payload),
    initialState
  );

  const dispatch: {
    [Key in keyof R]: (...x: Tail<Parameters<R[Key]>>) => void;
  } = {} as any;

  for (let key in actionReducers) {
    const reducer = actionReducers[key];
    dispatch[key] = (...args: Parameters<typeof reducer>[1]) =>
      _dispatch({ type: key, payload: args });
  }

  return [state, dispatch] as [State, typeof dispatch];
}
