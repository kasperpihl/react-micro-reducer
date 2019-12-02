import { useReducer, useMemo } from "react";

type TMicroActions<ReturnType> = {
  [key: string]: (...args: any[]) => ReturnType;
};
type TMicroDispatch<R extends TMicroActions<any>> = {
  [Key in keyof R]: (...x: Parameters<R[Key]>) => void;
};

export type ProduceFunc = <State>(
  currentState: State,
  producer: (draftState: State) => void
) => State;

export type MicroReducer<State, ReturnType = State> = (
  state: State
) => TMicroActions<ReturnType>;

export function useMicroReducer<State, R extends TMicroActions<State>>(
  microReducer: (state: State) => R,
  initialState?: State
): [State, TMicroDispatch<R>];

export function useMicroReducer<State, R extends TMicroActions<void>>(
  microReducer: (state: State) => R,
  initialState: State,
  producer: ProduceFunc
): [State, TMicroDispatch<R>];

// introduced generic R to allow proper infering
export function useMicroReducer(microReducer, initialState, producer?): any {
  const [state, _dispatch] = useReducer((state, action) => {
    if (producer) {
      return producer(state, draft =>
        microReducer(draft)[action.type](...action.payload)
      );
    }

    return microReducer(state)[action.type](...action.payload);
  }, initialState);

  const dispatch = useMemo(() => {
    const dispatch: any = {};

    for (let key in microReducer()) {
      dispatch[key] = (...args: any[]) =>
        _dispatch({ type: key, payload: args });
    }

    return dispatch;
  }, [_dispatch]);

  return [state, dispatch];
}
