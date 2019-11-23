# react-micro-reducer

A React reducer hook, with a "micro"-reducer style, made for a Typescript world 💙

Split your reducer into micro reducers based on actions, and avoid having one large reducer function with a switch statement

useMicroReducer uses the standard useReducer under the hook 🎉

## Installation

```shell
npm i react-micro-reducer
```

## Demo

I've made a Codesandbox to play around with useMicroReducer

- [Codesandbox](https://codesandbox.io/s/pedantic-sky-6se4w)

## Usage

```js
import React from "react";
import useMicroReducer from "react-micro-reducer";

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

## Credits

Thanks to [Maciej Sikora](https://stackoverflow.com/a/59002901/1168927) for helping with the type definitions! 🙌
