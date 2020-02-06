# react-state-mutations

[![Build Status](https://github.com/CultureHQ/react-state-mutations/workflows/Main/badge.svg)](https://github.com/CultureHQ/react-state-mutations/actions)
[![Package Version](https://img.shields.io/npm/v/react-state-mutations.svg)](https://www.npmjs.com/package/react-state-mutations)

State updates in `React` [may be asynchronous](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous). In the case that you're using the previous state to calculate the next state, you could run into race conditions when `React` attempts to batch your state changes together. The following example demonstrates the problem:

```javascript
// Warning! This is the bad example.
import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = { count: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    const { count } = this.state;
    return (
      <button type="button" onClick={this.handleClick}>
        {count}
      </button>
    );
  }
}

export default Counter;
```

In the example above, since both `setState` calls mutate the same key, those mutations can be merged together, and you may end up with it only incrementing each click by one since the last mutation will win. You can solve this by passing a function to `setState`, as those are executed sequentially and will not run over each other. This is demonstrated in the example below:

```javascript
import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = { count: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(({ count }) => ({ count: count + 1 }));
    this.setState(({ count }) => ({ count: count + 1 }));
  }

  render() {
    const { count } = this.state;
    return (
      <button type="button" onClick={this.handleClick}>
        {count}
      </button>
    );
  }
}

export default Counter;
```

The beauty of this approach is that you can begin to extract out the state mutation into a separate function that can then be reused. As in the following refactor:

```javascript
import React, { Component } from "react";

const incrementCount = ({ count }) => ({ count: count + 1 });

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = { count: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(incrementCount);
    this.setState(incrementCount);
  }

  render() {
    const { count } = this.state;
    return (
      <button type="button" onClick={this.handleClick}>
        {count}
      </button>
    );
  }
}

export default Counter;
```

This is the basis for this library. The `increment` function is already defined for you, as well as various other utilities. This library additionally provides an easy interface for defining your own mutations that read from the previous state so that you never run into race conditions with your state mutations. Using `react-state-mutations`, the final result would look like:

```javascript
import React, { Component } from "react";
import { increment } from "react-state-mutations";

const incrementCount = increment("count");

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = { count: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(incrementCount);
    this.setState(incrementCount);
  }

  render() {
    const { count } = this.state;
    return (
      <button type="button" onClick={this.handleClick}>
        {count}
      </button>
    );
  }
}

export default Counter;
```

You can alternatively use this library in conjunction with the `useState` feature in React. To get the equivalent as the above example working, you can use:

```javascript
import React, { useState } from "react";
import { incrementState } from "react-state-mutations";

const Counter = () => {
  const [count, setCount] = useState(0);
  const onClick = () => {
    setCount(incrementState);
    setCount(incrementState);
  };

  return (
    <button type="button" onClick={onClick}>
      {count}
    </button>
  );
};

export default Counter;
```

Or, you could use the built in `useIncrement` hook, as in:

```javascript
import React from "react";
import { useIncrement } from "react-state-mutations";

const Counter = () => {
  const [count, onIncrement] = useIncrement(0);
  const onClick = () => {
    onIncrement();
    onIncrement();
  };

  return (
    <button type="button" onClick={onClick}>
      {count}
    </button>
  );
};

export default Counter;
```

## Getting started

Install this package through `npm` (`npm install react-state-mutations --save`) or `yarn` (`yarn add react-state-mutations`). You can then import and use the mutations from within your components.

In addition with the ability to create your own mutations, this package ships with some pre-built mutations, listed below.

- [`append`](#append)
- [`concat`](#concat)
- [`cycle`](#cycle)
- [`decrement`](#decrement)
- [`direct`](#direct)
- [`filter`](#filter)
- [`increment`](#increment)
- [`map`](#map)
- [`mutate`](#mutate)
- [`prepend`](#prepend)
- [`toggle`](#toggle)

There is also an equivalent version of each of these mutations that works on standalone values. This can be used in conjunction with React's `useState` to manipulate state in a safe way. The equivalent version is named the same, with `State` appended onto the end. i.e., the equivalent mutation for `toggle` is `toggleState`, which will effectively perform `value => !value`. Finally, there are hooks built in that use those mutations, so in `useToggle` for the above example.

### `append`

Appends a value to a list, as in the example:

```javascript
import { append } from "react-state-mutations";

const appendStudent = append("students");

const prevState = { students: [{ name: "Harry" }, { name: "Hermione" }] };
const nextState = appendStudent({ name: "Ron" })(prevState);
// => { students: [{ name: "Harry" }, { name: "Hermione" }, { name: "Ron" }] }
```

With single values:

```javascript
import { appendState } from "react-state-mutations";

const prevState = [{ name: "Harry" }, { name: "Hermione" }];
const nextState = appendState({ name: "Ron" })(prevState);
// => [{ name: "Harry" }, { name: "Hermione" }, { name: "Ron" }]
```

With hooks:

```javascript
import { useAppend } from "react-state-mutations";

const Students = () => {
  const [students, onAppend] = useAppend([
    { name: "Harry" },
    { name: "Hermione" }
  ]);

  // sometime later...
  onAppend({ name: "Ron" });
};
```

With TypeScript, `append`, `appendState`, and `useAppend` all accept an additional type argument for specifying which type the array will hold, as in:

```typescript
interface Student {
  name: string;
}

append<Student>("students");
```

### `concat`

Concatentate two lists, as in the example:

```javascript
import { concat } from "react-state-mutations";

const concatStudents = concat("students");

const prevState = { students: [{ name: "Harry" }, { name: "Hermione" }] };
const nextState = concatStudents([{ name: "Ron" }, { name: "Ginny" }])(
  prevState
);
// => { students: [{ name: "Harry" }, { name: "Hermione" }, { name: "Ron" }, { name: "Ginny" }] }
```

With single values:

```javascript
import { concatState } from "react-state-mutations";

const prevState = [{ name: "Harry" }, { name: "Hermione" }];
const nextState = concatState([{ name: "Ron" }, { name: "Ginny" }])(prevState);
// => [{ name: "Harry" }, { name: "Hermione" }, { name: "Ron" }, { name: "Ginny" }]
```

With hooks:

```javascript
import { useConcat } from "react-state-mutations";

const Students = () => {
  const [students, onConcat] = useConcat([
    { name: "Harry" },
    { name: "Hermione" }
  ]);

  // sometime later...
  onConcat([{ name: "Ron" }, { name: "Ginny" }]);
};
```

With TypeScript, `concat`, `concatState`, and `useConcat` all accept an additional type argument for specifying which type the array will hold, as in:

```typescript
interface Student {
  name: string;
}

concat<Student>("students");
```

### `cycle`

Cycles through a list of values, as in the example:

```javascript
import { cycle } from "react-state-mutations";

const cycleHouse = cycle("house");
const visitNextHogwartsHouse = cycleHouse([
  "Gryffindor",
  "Hufflepuff",
  "Ravenclaw",
  "Slytherin"
]);

const prevState = { house: "Gryffindor" };
let nextState = visitNextHogwartsHouse(prevState);
// => { house: "Hufflepuff" }

nextState = visitNextHogwartsHouse(nextState);
// => { house: "Ravenclaw" }

nextState = visitNextHogwartsHouse(nextState);
// => { house: "Slytherin" }

nextState = visitNextHogwartsHouse(nextState);
// => { house: "Gryffindor" }
```

With single values:

```javascript
import { cycleState } from "react-state-mutations";

const visitNextHogwartsHouse = cycleState([
  "Gryffindor",
  "Hufflepuff",
  "Ravenclaw",
  "Slytherin"
]);

const prevState = "Gryffindor";
let nextState = visitNextHogwartsHouse(prevState);
// => "Hufflepuff"

nextState = visitNextHogwartsHouse(nextState);
// => "Ravenclaw"

nextState = visitNextHogwartsHouse(nextState);
// => "Slytherin"

nextState = visitNextHogwartsHouse(nextState);
// => "Gryffindor"
```

With hooks:

```javascript
import { useCycle } from "react-state-mutations";

const HogwartsHouses = () => {
  const [house, onCycle] = useCycle([
    "Gryffindor",
    "Hufflepuff",
    "Ravenclaw",
    "Slytherin"
  ]);

  // sometime later...
  onCycle();
};
```

With TypeScript, `cycle`, `cycleState`, and `useCycle` all accept an additional type argument for specifying which type the array will hold, as in:

```typescript
type House = string;

cycle<House>("house");
```

### `decrement`

Decrements a value, as in the example:

```javascript
import { decrement } from "react-state-mutations";

const destroyHorcrux = decrement("horcruxes");

const prevState = { horcruxes: 7 };
const nextState = destroyHorcrux(prevState);
// => { count: 6 }
```

With single values:

```javascript
import { decrementState } from "react-state-mutations";

const prevState = 7;
const nextState = decrementState(prevState);
// => 6
```

With hooks:

```javascript
import { useDecrement } from "react-state-mutations";

const Horcruxes = () => {
  const [count, onDecrement] = useDecrement(7);

  // sometime later...
  onDecrement();
};
```

With TypeScript, `decrement`, `decrementState`, and `useDecrement` enforce the `number` type on arguments.

### `direct`

Directly modifies a value. This is mainly valuable when used with `combineMutations`, as otherwise you could just pass the value to `setState` as normal. The code below uses `combineMutations` with others as an example:

```javascript
import { direct, toggle, combineMutations } from "react-state-mutations";

const getCake = direct("cake");
const becomeAWizard = combineMutations(toggle("wizard"), getCake);

const prevState = { wizard: false, cake: null };
const nextState = becomeAWizard("chocolate")(prevState);
// => { wizard: true, cake: "chocolate" }
```

With single values:

```javascript
import { directState } from "react-state-mutations";

const getCake = directState("cake");

const prevState = null;
const nextState = getCake(prevState);
// => "cake"
```

With TypeScript, `direct` and `directState` each accept an additional type argument for specifying which type of object will be assigned into the state.

### `filter`

Filters a list, as in the example:

```javascript
import { filter } from "react-state-mutations";

const filterStudents = filter("students");
const findGryffindors = filterStudents(({ house }) => house === "Gryffindor");

const prevState = {
  students: [
    { name: "Harry", house: "Gryffindor" },
    { name: "Cedric", house: "Hufflepuff" },
    { name: "Pansy", house: "Slytherin" }
  ]
};

const nextState = findGryffindors(prevState);
// => { students: [{ name: "Harry", house: "Gryffindor" }] }
```

With single values:

```javascript
import { filterState } from "react-state-mutations";

const findGryffindors = filterState(({ house }) => house === "Gryffindor");

const prevState = [
  { name: "Harry", house: "Gryffindor" },
  { name: "Cedric", house: "Hufflepuff" },
  { name: "Pansy", house: "Slytherin" }
];

const nextState = findGryffindors(prevState);
// => [{ name: "Harry", house: "Gryffindor" }]
```

With hooks:

```javascript
import { useFilter } from "react-state-mutations";

const Students = () => {
  const [students, onFilter] = useFilter([
    { name: "Harry", house: "Gryffindor" },
    { name: "Cedric", house: "Hufflepuff" },
    { name: "Pansy", house: "Slytherin" }
  ]);

  // sometime later...
  onFilter(({ house }) => house === "Gryffindor");
};
```

With TypeScript, `filter`, `filterState`, and `useFilter` all accept an additional type argument `T` for specifying which type the array will hold. Additionally the filter function argument is enforced to be of the type `((value: T) => boolean)`, as in:

```typescript
interface Student {
  name: string;
  house: string;
}

filterState<Student>(({ house }) => house === "Gryffindor");
```

### `increment`

Increments a value, as in the example:

```javascript
import { increment } from "react-state-mutations";

const upgradeBroom = increment("Nimbus");

const prevState = { Nimbus: 2000 };
const nextState = upgradeBroom(prevState);
// => { Nimbus: 2001 }
```

With single values:

```javascript
import { incrementState } from "react-state-mutations";

const prevState = 2000;
const nextState = incrementState(prevState);
// => 2001
```

With hooks:

```javascript
import { useIncrement } from "react-state-mutations";

const Nimbus = () => {
  const [version, onIncrement] = useIncrement(2000);

  // sometime later...
  onIncrement();
};
```

With TypeScript, `increment`, `incrementState`, and `useDecrement` enforce the `number` type on arguments.

### `map`

Maps over a list, as in the example:

```javascript
import { map } from "react-state-mutations";

const mapStudents = map("students");
const graduateStudents = mapStudents(({ year, ...rest }) => ({
  year + 1, ...rest
}));

const prevState = {
  students: [
    { name: "Harry", year: 2 },
    { name: "Ginny", year: 1 }
  ]
};

const nextState = graduateStudents(prevState);
// => { students: [{ name: "Harry", year: 3 }, { name: "Ginny", year: 2 }] }
```

With single values:

```javascript
import { mapState } from "react-state-mutations";

const graduateStudents = mapState(({ year, ...rest }) => ({
  year + 1, ...rest
}));

const prevState = [
  { name: "Harry", year: 2 },
  { name: "Ginny", year: 1 }
];

const nextState = graduateStudents(prevState);
// => [{ name: "Harry", year: 3 }, { name: "Ginny", year: 2 }]
```

With hooks:

```javascript
import { useMap } from "react-state-mutations";

const Students = () => {
  const [students, onMap] = useMap([
    { name: "Harry", year: 2 },
    { name: "Ginny", year: 1 }
  ]);

  // sometime later...
  onMap(({ year, ...rest }) => ({ year + 1, ...rest }));
};
```

With TypeScript, `map`, `mapState`, and `useMap` all accept an additional type argument `T` for specifying which type the array will hold. Additionally the map function argument is enforced to be of the type `((value: T) => T)`, as in:

```typescript
interface Student {
  name: string;
  year: number;
}

mapState<Student>(({ year, ...rest }) => ({ year + 1, ...rest }));
```

### `mutate`

Mutates a value, as in the example:

```javascript
import { mutate } from "react-state-mutations";

const mutateLupin = mutate("Lupin");
const fullMoon = mutateLupin({ status: "Wolf" });

const prevState = { Lupin: { status: "Man", role: "Professor" } };
const nextState = fullMoon(prevState);
// => { Lupin: { status: "Wolf", role: "Professor" } }
```

With single values:

```javascript
import { mutateState } from "react-state-mutations";

const fullMoon = mutateState({ status: "Wolf" });

const prevState = { status: "Man", role: "Professor" };
const nextState = fullMoon(prevState);
// => { status: "Wolf", role: "Professor" }
```

With TypeScript, the object being used to mutate is enforced to be of type `object`.

### `prepend`

Prepends a value to a list, as in the example:

```javascript
import { prepend } from "react-state-mutations";

const prependStudent = prepend("students");

const prevState = { students: [{ name: "Harry" }, { name: "Hermione" }] };
const nextState = prependStudent({ name: "Ron" })(prevState);
// => { students: [{ name: "Ron" }, { name: "Harry" }, { name: "Hermione" }] }
```

With single values:

```javascript
import { prependState } from "react-state-mutations";

const prevState = [{ name: "Harry" }, { name: "Hermione" }];
const nextState = prependState({ name: "Ron" })(prevState);
// => [{ name: "Ron" }, { name: "Harry" }, { name: "Hermione" }]
```

With hooks:

```javascript
import { usePrepend } from "react-state-mutations";

const Students = () => {
  const [students, onPrepend] = usePrepend([
    { name: "Harry" },
    { name: "Hermione" }
  ]);

  // sometime later...
  onPrepend({ name: "Ron" });
};
```

With TypeScript, `prepend`, `prependState`, and `usePrepend` all accept an additional type argument for specifying which type the array will hold, as in:

```typescript
interface Student {
  name: string;
}

prepend<Student>("students");
```

### `toggle`

Toggles a boolean value, as in the example:

```javascript
import { toggle } from "react-state-mutations";

const toggleWizard = toggle("wizard");

const prevState = { wizard: false };
const nextState = toggleWizard(prevState);
// => { wizard: true }
```

With single values:

```javascript
import { toggleState } from "react-state-mutations";

const prevState = false;
const nextState = toggleState(prevState);
// => true
```

With hooks:

```javascript
import { useToggle } from "react-state-mutations";

const WizardStatus = () => {
  const [isWizard, onToggle] = useToggle(false);

  // sometime later, with Hagrid...
  onToggle();
};
```

With TypeScript, `toggle`, `toggleState`, and `useToggle` enforce the `boolean` type on arguments.

## Advanced

There are a couple of advanced functions, for creating your own mutations, combining multiple mutations into one function, and creating your own hooks.

### `makeStandaloneMutation`

Creates a mutation that modifies state. Takes as an argument a function that accepts a value and returns the modified value. As in the example:

```javascript
import { makeStandaloneMutation } from "react-state-mutations";

const encrypt = makeStandaloneMutation(value => (
  value.split("").reverse().join("")
));

const encryptName = encrypt("name");

const prevState = { name: "Harry" };
const nextState = encryptName(prevState);
// => { name: "yrraH" }
```

With Typescript, `makeStandaloneMutation` accepts an additional type argument for specifying which type of value will be mutated. For example:

```typescript
const encrypt = makeStandaloneMutation<string>(value => (
  value.split("").reverse().join("")
));
```

### `makeArgumentMutation`

Creates a mutation that is a function that takes one argument, that itself returns a function that modifies state. Takes as a function that accepts a value that returns a return that accepts the state and returns the modifies value. As in the example:

```javascript
import { makeArgumentMutation } from "react-state-mutations";

const add = makeArgumentMutation(increment => value => value + increment);
const flyUp100Feet = add("currentHeight")(100);

const prevState = { currentHeight: 0 };
const nextState = flyUp100Feet(prevState);
// => { currentHeight: 100 }
```

With TypeScript, `makeArgumentMutation` accepts two type arguments, for specifying which type of value will be mutated and for specifying the type of the argument to be passed in. For example:

```typescript
const add = makeArgumentMutation<number, number>(increment => (
  value => value + increment
));
```

### `combineMutations`

Combines multiple mutations into a single mutation function. Takes any number of arguments and returns a singular mutation created out of the combination of them all. Can accept either mutations created through `react-state-mutations`, or plain objects that are meant to be directly setting state.

If any "argument" mutations are passed in, `combineMutations` will return a function that accepts any number of arguments, that themselves will be passed to the mutations in the order in which they appear in the list given to `combineMutations`. As in the example:

```javascript
import { append, increment } from "react-state-mutations";

const addToTeam = combineMutations(append("players"), increment("roster"));

const prevState = {
  players: [{ name: "Angelina" }, { name: "Alicia" }],
  roster: 2
};

const nextState = addToTeam({ name: "Katie" })(prevState);
// => {
//   players: [{ name: "Angelina" }, { name: "Alicia" }, { name: "Katie" }],
//   roster: 3
// };
```

If all of the mutations that are passed in are "standalone" mutations, then
`combineMutations` will return a function that simply accepts and modifies
the state. As in the example:

```javascript
import { toggle, increment } from "react-state-mutations";

const becomeAWizard = combineMutations(toggle("wizard"), increment("wizards"));

const prevState = { wizard: false, wizards: 0 };
const nextState = mutation(prevState);
// => { wizard: true, wizards: 1 };
```

You can additionally pass plain objects into `combineMutations` that are
intended to directly set state. In this case they will be folded into the
resultant function and treated as "standalone" mutations that do not accept
arguments. As in the example:

```javascript
import { combineMutations, makeArgumentMutation } from "react-state-mutations";

const startFlying = combineMutations(
  makeArgumentMutation(height => value => value + height),
  { flying: true }
);

const prevState = { height: 0, flying: false };
const nextState = startFlying(100)(prevState);
// => { height: 100, flying: true };
```

### `makeStandaloneHook`

Creates a reusable hook based on a mutation that requires no further input. `makeStandaloneHook` takes two arguments, the first behind the mutation and the second being the default initial value. For example, if you wanted to create a hook that would always multiply the previous value by 2, you could:

```javascript
import { makeStandaloneHook } from "react-state-mutations";

const useDouble = makeStandaloneHook(value => value * 2, 1);
```

Then, you could use `useDouble` in your components as any other hooks, as in:

```javascript
const DoubleDouble = () => {
  const [value, onDouble] = useDouble();

  return (
    <button type="button" onClick={onDouble}>
      {value}
    </button>
  );
};
```

You can also pass a value to `useDouble` in this example to start at a certain value.

With TypeScript, `makeStandaloneHook` accepts an additional type argument for specifying which kind of value will be stored in state. For example,

```typescript
const useDouble = makeStandaloneHook<number>(value => value * 2, 1);
```

### `makeArgumentHook`

Creates a reusable hook based on a mutation that requires one argument. `makeArgumentHook` takes two arguments (the same as `makeStandaloneHook`), the first behind the mutation and the second being the default initial value. For example, if you wanted to create a hook that would count up values in succession, you could:

```javascript
import { makeArgumentHook } from "react-state-mutations";

const useAdder = makeArgumentHook(object => value => value + object, 0);
```

Then you could use `useAdder` in your components as any other hooks, as in:

```javascript
import { useCallback, useState } from "react";

const Sum = () => {
  const [number, setNumber] = useState("");
  const onChange = useCallback(event => setNumber(event.target.value), []);

  const [value, onAdd] = useAdder();
  const onClick = useCallback(() => onAdd(number), [number]);

  return (
    <>
      <input type="number" value={value} onChange={onChange} />
      <button type="button" onClick={onClick}>
        Add
      </button>
    </>
  );
};
```

With TypeScript, `makeArgumentHook` accepts two additional type arguments for specifying which kind of value will be stored in state, and which kind of value will be accepted as an argument. For example,

```typescript
const useAdder = makeArgumentHook<number, number>(
  object => value => value + object, 0
);
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/CultureHQ/react-state-mutations.

## License

The code is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
