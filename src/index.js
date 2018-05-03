/**
 * Creates a mutation that modifies state. Takes as an argument a function that
 * accepts a value and returns the modified value. As in the example:
 *
 *     import { makeStandaloneMutation } from "react-state-mutations";
 *     const add = makeStandaloneMutation(value => value + 10);
 *     const mutation = add("addable");
 *
 *     const prevState = { addable: 5 };
 *     const nextState = mutation(prevState);
 *     // => { addable: 15 }
 */
export const makeStandaloneMutation = apply => field => {
  const mutation = state => ({ [field]: apply(state[field]) });
  mutation.standalone = true;
  return mutation;
};

/**
 * Creates a mutation that is a function that takes one argument, that itself
 * returns a function that modifies state. Takes as an argument a function that
 * accepts both a value and one argument, and returns the modifies value. As in
 * the example:
 *
 *     import { makeArgumentMutation } from "react-state-mutations";
 *     const add = makeArgumentMutation((value, adder) => value + adder);
 *     const mutation = add("addable");
 *
 *     const prevState = { addable: 5 };
 *     const nextState = mutation(10)(prevState);
 *     // => { addable: 15 }
 */
export const makeArgumentMutation = apply => field => object => state => ({
  [field]: apply(state[field], object)
});

/**
 * Appends a value to a list.
 *
 *     import { append } from "react-state-mutations";
 *     const mutation = append("appendable");
 *
 *     const prevState = { appendable: [1, 2, 3] };
 *     const nextState = mutation(4)(prevState);
 *     // => { appendable: [1, 2, 3, 4] }
 */
export const append = makeArgumentMutation((value, object) => [
  ...value,
  object
]);

/**
 * Decrements a value.
 *
 *     import { decrement } from "react-state-mutations";
 *     const mutation = decrement("decrementable");
 *
 *     const prevState = { decrementable: 1 };
 *     const nextState = mutation(prevState);
 *     // => { decrementable: 0 }
 */
export const decrement = makeStandaloneMutation(value => value - 1);

/**
 * Increments a value.
 *
 *     import { increment } from "react-state-mutations";
 *     const mutation = increment("incrementable");
 *
 *     const prevState = { incrementable: 1 };
 *     const nextState = mutation(prevState);
 *     // => { incrementable: 2 }
 */
export const increment = makeStandaloneMutation(value => value + 1);

/**
 * Mutates a value.
 *
 *     import { mutate } from "react-state-mutations";
 *     const mutation = mutate("mutatable");
 *
 *     const prevState = { mutatable: { foo: "bar" } };
 *     const nextState = mutation({ foo: "baz" })(prevState);
 *     // => { mutatable: { foo: "baz" } }
 */
export const mutate = makeArgumentMutation((value, object) => ({
  ...value,
  ...object
}));

/**
 * Prepends a value to a list.
 *
 *     import { prepend } from "react-state-mutations";
 *     const mutation = mutate("prependable");
 *
 *     const prevState = { prependable: [1, 2, 3] };
 *     const nextState = mutation(0)(prevState);
 *     // => { prependable: [0, 1, 2, 3] }
 */
export const prepend = makeArgumentMutation((value, object) => [
  object,
  ...value
]);

/**
 * Toggles a boolean value.
 *
 *     import { toggle } from "react-state-mutations";
 *     const mutation = toggle("toggleable");
 *
 *     const prevState = { toggleable: true };
 *     const nextState = mutation(prevState);
 *     // => { toggleable: false }
 */
export const toggle = makeStandaloneMutation(value => !value);

/**
 * Combines multiple mutations into a single mutation function. Takes any number
 * of arguments and returns a singular mutation created out of the combination
 * of them all. Can accept either mutations created through
 * `react-state-mutations`, or plain objects that are meant to be directly
 * setting state.
 *
 * If any "argument" mutations are passed in, `combineMutations` will return a
 * function that accepts any number of arguments, that themselves will be passed
 * to the mutations in the order in which they appear in the list given to
 * `combineMutations`. As in the example:
 *
 *     import { append, prepend } from "react-state-mutations";
 *     const mutation = combineMutations(append("list"), prepend("list"));
 *
 *     const prevState = { list: [1, 2, 3] };
 *     const nextState = mutation(4, 0)(prevState);
 *     // => { list: [0, 1, 2, 3, 4] };
 *
 * If all of the mutations that are passed in are "standalone" mutations, then
 * `combineMutations` will return a function that simply accepts and modifies
 * the state. As in the example:
 *
 *     import { toggle, increment } from "react-state-mutations";
 *     const mutation = combineMutations(
 *       toggle("toggleable"),
 *       increment("incrementable")
 *     );
 *
 *     const prevState = { toggleable: true, incrementable: 1 };
 *     const nextState = mutation(prevState);
 *     // => { toggleable: false, incrementable: 2 };
 *
 * You can additionally pass plain objects into `combineMutations` that are
 * intended to directly set state. In this case they will be folded into the
 * resultant function and treated as "standalone" mutations that do not accept
 * arguments. As in the example:
 *
 *     import { toggle } from "react-state-mutations";
 *     const mutation = combineMutations(toggle("toggleable"), { a: "b" });
 *
 *     const prevState = { toggleable: true, a: "a" };
 *     const nextState = mutation(prevState);
 *     // => { toggleable: false, a: "b" };
 */
export const combineMutations = (...mutations) => {
  const normalized = mutations.map(mutation => {
    if (typeof mutation === "function") {
      return mutation;
    }

    const directMutation = () => mutation;
    directMutation.standalone = true;
    return directMutation;
  });

  if (normalized.some(mutation => !mutation.standalone)) {
    return (...args) => state => {
      let argIndex = -1;

      return normalized.reduce((nextState, mutation) => {
        if (mutation.standalone) {
          return { ...nextState, ...mutation(nextState) };
        }

        argIndex += 1;
        return { ...nextState, ...mutation(args[argIndex])(nextState) };
      }, state);
    };
  }

  return state => normalized.reduce((nextState, mutation) => ({
    ...nextState,
    ...mutation(nextState)
  }), state);
};
