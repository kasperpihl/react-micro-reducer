import { useReducer } from "react";

export type TProduceFunc = <State>(
  currentState: State,
  producer: (draftState: State) => void
) => State;

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
  initialState?: State,
  producer?: TProduceFunc
) {
  const [state, _dispatch] = useReducer(
    (
      state: State,
      action: { type: keyof typeof actionReducers; payload: any[] }
    ) => {
      const reducer = actionReducers[action.type];

      if (producer) {
        return producer(state, draft => reducer(draft, ...action.payload));
      }

      return reducer(state, ...action.payload);
    },
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
