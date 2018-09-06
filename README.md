# react-state-mutations

[![Build Status](https://travis-ci.com/CultureHQ/react-state-mutations.svg?branch=master)](https://travis-ci.com/CultureHQ/react-state-mutations)
[![Package Version](https://img.shields.io/npm/v/react-state-mutations.svg)](https://www.npmjs.com/package/react-state-mutations)
[![Minified GZipped Size](https://img.shields.io/bundlephobia/minzip/react-state-mutations.svg)](https://www.npmjs.com/package/react-state-mutations)

Modify component state without race conditions.

## Getting started

Install this package through npm:

```
npm install react-state-mutations --save
```

You can now import the mutations that you need into your component, as in the example below:

```javascript
import React, { Component } from "react";
import { increment } from "react-state-mutations";

class Example extends Component {
  incrementCount = increment("count");

  state = { count: 0 };

  handleClick() {
    this.setState(this.incrementCount);
  }

  render() {
    const { count } = this.state;
    return <span onClick={this.handleClick}>{count}</span>;
  }
}
```

## Pre-built mutations

In addition with the ability to create your own mutations, this package ships with some pre-built mutations, listed below.

### `append`

Appends a value to a list, as in the example:

```javascript
import { append } from "react-state-mutations";
const mutation = append("list");

const prevState = { list: [1, 2, 3] };
const nextState = mutation(4)(prevState);
// => { list: [1, 2, 3, 4] }
```

### `decrement`

Decrements a value, as in the example:

```javascript
import { decrement } from "react-state-mutations";
const mutation = decrement("count");

const prevState = { count: 1 };
const nextState = mutation(prevState);
// => { count: 0 }
```

### `filter`

Filters a list, as in the example:

```javascript
import { filter } from "react-state-mutations";
const mutation = filter("list");

const prevState = { list: [1, 2, 3, 4, 5, 6] };
const nextState = mutation(value => value % 2 === 0);
// => { list: [2, 4, 6] }
```

### `increment`

Increments a value, as in the example:

```javascript
import { increment } from "react-state-mutations";
const mutation = increment("count");

const prevState = { count: 1 };
const nextState = mutation(prevState);
// => { count: 2 }
```

### `map`

Maps over a list, as in the example:

```javascript
import { map } from "react-state-mutations";
const mutation = map("list");

const prevState = { list: [1, 2, 3] };
const nextState = mutation(value => value * 2);
// => { list: [2, 4, 6] }
```

### `mutate`

Mutates a value, as in the example:

```javascript
import { mutate } from "react-state-mutations";
const mutation = mutate("object");

const prevState = { object: { foo: "bar" } };
const nextState = mutation({ foo: "baz" })(prevState);
// => { object: { foo: "baz" } }
```

### `prepend`

Prepends a value to a list, as in the example:

```javascript
import { prepend } from "react-state-mutations";
const mutation = mutate("list");

const prevState = { list: [1, 2, 3] };
const nextState = mutation(0)(prevState);
// => { list: [0, 1, 2, 3] }
```

### `toggle`

Toggles a boolean value, as in the example:

```javascript
import { toggle } from "react-state-mutations";
const mutation = toggle("boolean");

const prevState = { boolean: true };
const nextState = mutation(prevState);
// => { boolean: false }
```

## Advanced

There are a couple of advanced functions, both for creating your own mutations, and combining multiple mutations into one function.

### `makeStandaloneMutation`

Creates a mutation that modifies state. Takes as an argument a function that accepts a value and returns the modified value. As in the example:

```javascript
import { makeStandaloneMutation } from "react-state-mutations";
const add = makeStandaloneMutation(value => value + 10);
const mutation = add("count");

const prevState = { count: 5 };
const nextState = mutation(prevState);
// => { count: 15 }
```

### `makeArgumentMutation`

Creates a mutation that is a function that takes one argument, that itself returns a function that modifies state. Takes as an argument a function that accepts both a value and one argument, and returns the modifies value. As in the example:

```javascript
import { makeArgumentMutation } from "react-state-mutations";
const add = makeArgumentMutation((value, adder) => value + adder);
const mutation = add("count");

const prevState = { count: 5 };
const nextState = mutation(10)(prevState);
// => { count: 15 }
```

### `combineMutations`

Combines multiple mutations into a single mutation function. Takes any number of arguments and returns a singular mutation created out of the combination of them all. Can accept either mutations created through `react-state-mutations`, or plain objects that are meant to be directly setting state.

If any "argument" mutations are passed in, `combineMutations` will return a function that accepts any number of arguments, that themselves will be passed to the mutations in the order in which they appear in the list given to `combineMutations`. As in the example:

```javascript
import { append, prepend } from "react-state-mutations";
const mutation = combineMutations(append("list"), prepend("list"));

const prevState = { list: [1, 2, 3] };
const nextState = mutation(4, 0)(prevState);
// => { list: [0, 1, 2, 3, 4] };
```

If all of the mutations that are passed in are "standalone" mutations, then
`combineMutations` will return a function that simply accepts and modifies
the state. As in the example:

```javascript
import { toggle, increment } from "react-state-mutations";
const mutation = combineMutations(
  toggle("boolean"),
  increment("count")
);

const prevState = { boolean: true, count: 1 };
const nextState = mutation(prevState);
// => { boolean: false, count: 2 };
```

You can additionally pass plain objects into `combineMutations` that are
intended to directly set state. In this case they will be folded into the
resultant function and treated as "standalone" mutations that do not accept
arguments. As in the example:

```javascript
import { toggle } from "react-state-mutations";
const mutation = combineMutations(toggle("boolean"), { a: "b" });

const prevState = { boolean: true, a: "a" };
const nextState = mutation(prevState);
// => { boolean: false, a: "b" };
```
