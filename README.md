# useActionReducer

A React hook reducer made for a Typescript world 💙
Avoid having one large reducer function with a switch statement, but split it into small action reducers.

## Installation

```shell
npm i use-action-reducer
```

## Demo

I've made a Codesandbox to play around with use-action-reducer

- [Codesandbox](https://codesandbox.io/s/pedantic-sky-6se4w)

## Usage

```js
import React from "react";
import useActionReducer from "use-action-reducer";

export default function App() {
  const [state, dispatch] = useActionReducer(
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
