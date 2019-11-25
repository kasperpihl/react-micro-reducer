import { useReducer, useMemo } from "react";

export type TMicroDispatch<R extends TMicroReducer<any, any>> = {
  [Key in keyof R]: (...x: Tail<Parameters<R[Key]>>) => void;
};

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

type TMicroReducer<State, ReturnType = State> = {
  [key: string]: (state: State, ...args: any[]) => ReturnType;
};
type TMicroReducerReturn<
  State,
  ReturnType,
  R extends TMicroReducer<State, ReturnType>
> = [State, TMicroDispatch<R>];

export function useMicroReducer<State, R extends TMicroReducer<State, State>>(
  actionReducers: R,
  initialState?: State
): TMicroReducerReturn<State, State, R>;

export function useMicroReducer<State, R extends TMicroReducer<State, void>>(
  actionReducers: R,
  initialState: State,
  producer: TProduceFunc
): TMicroReducerReturn<State, void, R>;

// introduced generic R to allow proper infering
export function useMicroReducer(actionReducers, initialState, producer?): any {
  const [state, _dispatch] = useReducer((state, action) => {
    const reducer = actionReducers[action.type];

    if (producer) {
      return producer(state, draft => reducer(draft, ...action.payload));
    }

    return reducer(state, ...action.payload);
  }, initialState);

  const dispatch = useMemo(() => {
    const dispatch: any = {};

    for (let key in actionReducers) {
      dispatch[key] = (...args: any[]) =>
        _dispatch({ type: key, payload: args });
    }

    return dispatch;
  }, [_dispatch]);

  return [state, dispatch];
}
