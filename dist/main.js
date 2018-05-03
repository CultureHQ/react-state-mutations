"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
var makeStandaloneMutation = exports.makeStandaloneMutation = function makeStandaloneMutation(apply) {
  return function (field) {
    var mutation = function mutation(state) {
      return _defineProperty({}, field, apply(state[field]));
    };
    mutation.standalone = true;
    return mutation;
  };
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
var makeArgumentMutation = exports.makeArgumentMutation = function makeArgumentMutation(apply) {
  return function (field) {
    return function (object) {
      return function (state) {
        return _defineProperty({}, field, apply(state[field], object));
      };
    };
  };
};

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
var append = exports.append = makeArgumentMutation(function (value, object) {
  return [].concat(_toConsumableArray(value), [object]);
});

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
var decrement = exports.decrement = makeStandaloneMutation(function (value) {
  return value - 1;
});

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
var increment = exports.increment = makeStandaloneMutation(function (value) {
  return value + 1;
});

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
var mutate = exports.mutate = makeArgumentMutation(function (value, object) {
  return _extends({}, value, object);
});

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
var prepend = exports.prepend = makeArgumentMutation(function (value, object) {
  return [object].concat(_toConsumableArray(value));
});

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
var toggle = exports.toggle = makeStandaloneMutation(function (value) {
  return !value;
});

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
var combineMutations = exports.combineMutations = function combineMutations() {
  for (var _len = arguments.length, mutations = Array(_len), _key = 0; _key < _len; _key++) {
    mutations[_key] = arguments[_key];
  }

  var normalized = mutations.map(function (mutation) {
    if (typeof mutation === "function") {
      return mutation;
    }

    var directMutation = function directMutation() {
      return mutation;
    };
    directMutation.standalone = true;
    return directMutation;
  });

  if (normalized.some(function (mutation) {
    return !mutation.standalone;
  })) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return function (state) {
        var argIndex = -1;

        return normalized.reduce(function (nextState, mutation) {
          if (mutation.standalone) {
            return _extends({}, nextState, mutation(nextState));
          }

          argIndex += 1;
          return _extends({}, nextState, mutation(args[argIndex])(nextState));
        }, state);
      };
    };
  }

  return function (state) {
    return normalized.reduce(function (nextState, mutation) {
      return _extends({}, nextState, mutation(nextState));
    }, state);
  };
};
