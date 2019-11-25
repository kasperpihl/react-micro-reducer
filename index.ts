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

type TMicroReducer<State, ReturnType> = {
  [key: string]: (state: State, ...args: any[]) => ReturnType;
};
type TMicroReducerReturn<
  State,
  ReturnType,
  R extends TMicroReducer<State, ReturnType>
> = [
  State,
  {
    [Key in keyof R]: (...x: Tail<Parameters<R[Key]>>) => ReturnType;
  }
];

function useMicroReducer<State, R extends TMicroReducer<State, State>>(
  actionReducers: R,
  initialState?: State
): TMicroReducerReturn<State, State, R>;

function useMicroReducer<State, R extends TMicroReducer<State, void>>(
  actionReducers: R,
  initialState: State,
  producer: TProduceFunc
): TMicroReducerReturn<State, void, R>;

// introduced generic R to allow proper infering
function useMicroReducer(actionReducers, initialState, producer?): any {
  const [state, _dispatch] = useReducer((state, action) => {
    const reducer = actionReducers[action.type];

    if (producer) {
      return producer(state, draft => reducer(draft, ...action.payload));
    }

    return reducer(state, ...action.payload);
  }, initialState);

  const dispatch: any = {};

  for (let key in actionReducers) {
    dispatch[key] = (...args: any[]) => _dispatch({ type: key, payload: args });
  }

  return [state, dispatch];
}

export default useMicroReducer;
