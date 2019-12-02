# Changelog react-micro-reducer ✅

## 2.0.0

- Added: MicroReducer type export

### BREAKING CHANGE: Improved ease of using typescript and separate reducer logic

- Before:

```js
useMicroReducer({
  increment: (state, value: number) => state + value,
  decrement: (state, value: number) => state - value
});
```

- After:

```js
useMicroReducer(state => ({
  increment: (value: number) => state + value,
  decrement: (value: number) => state - value
}));
```

## 1.1.3

- Immer support: added an optional third argument to pass the produce function

## 1.0.0

- Initial version 🎉
