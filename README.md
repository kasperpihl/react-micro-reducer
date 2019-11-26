# react-micro-reducer

A React reducer hook, with a "micro"-reducer style, made for a Typescript world 💙

Split your reducer into micro reducers based on actions, and avoid having one large reducer function with a switch statement

useMicroReducer uses the standard useReducer under the hook 🎉

Ohh, and it supports Immer 🎂


<p>
    <a href="https://bundlephobia.com/result?p=react-micro-reducer"><img src="https://badgen.net/bundlephobia/min/react-micro-reducer" /></a>
    <a href="https://bundlephobia.com/result?p=react-micro-reducer"><img src="https://badgen.net/bundlephobia/minzip/react-micro-reducer" /></a>
</p>

## Installation

```shell
npm i react-micro-reducer
```

## Demo

I've made a couple of Codesandboxes to play around with useMicroReducer

- [Codesandbox](https://codesandbox.io/s/friendly-swartz-5hyyt)
- [Codesandbox w/ immer](https://codesandbox.io/s/great-wind-5tfzk)

## Usage

```js
import React from "react";
import { useMicroReducer } from "react-micro-reducer";

export default function App() {
  const [state, dispatch] = useMicroReducer(
    {
      reset: () => 0,
      increment: (state, value: number) => state + value,
      decrement: (state, value: number) => state - value,
      multiply: (state, value: number) => state * value
    },
    0
  );

  return (
    <div>
      <h1>{state}</h1>
      <button onClick={() => dispatch.decrement(5)}>Decrement with 5</button>
      <button onClick={() => dispatch.increment(5)}>Increment with 5</button>
      <button onClick={() => dispatch.multiply(5)}>Multiply with 5</button>
      <button onClick={() => dispatch.reset()}>Reset</button>
    </div>
  );
}
```

## Usage with Immer

Just pass the produce function as a third argument to useMicroReducer, and your state will be a draft object 💪

```js
import React from "react";
import { useMicroReducer } from "react-micro-reducer";
import produce from "immer";

export default function App() {
  const [state, dispatch] = useMicroReducer(
    {
      search: (draft, query: string) => {
        // Draft is an immer draft object 🎉
        draft.query = query;
      }
    },
    {
      query: ""
    },
    produce
  );
  // Return render stuff
}
```

## Credits

Thanks to [Maciej Sikora](https://stackoverflow.com/a/59002901/1168927) for helping with the type definitions, and to [Jeppe Hasseris](https://github.com/cenobitedk) for helping with the naming/API! 🙌
