import {
  makeStandaloneMutation,
  makeArgumentMutation,
  append,
  decrement,
  increment,
  mutate,
  prepend,
  toggle,
  combineMutations
} from "../src/index";

test("makeStandaloneMutation", () => {
  const mutation = makeStandaloneMutation(value => value + 50);
  const prevState = { object: 1 };
  const nextState = mutation("object")(prevState);

  expect(nextState.object).toEqual(51);
  expect(prevState.object).toEqual(1);
});

test("makeArgumentMutation", () => {
  const mutation = makeArgumentMutation((value, object) => value + object);
  const prevState = { object: 1 };
  const nextState = mutation("object")(50)(prevState);

  expect(nextState.object).toEqual(51);
  expect(prevState.object).toEqual(1);
});

test("append", () => {
  const prevState = { objects: [1, 2, 3] };
  const nextState = append("objects")(4)(prevState);

  expect(nextState.objects[nextState.objects.length - 1]).toEqual(4);
  expect(prevState.objects.length).toEqual(3);
});

test("decrement", () => {
  const prevState = { object: 1 };
  const nextState = decrement("object")(prevState);

  expect(nextState.object).toEqual(0);
  expect(prevState.object).toEqual(1);
});

test("increment", () => {
  const prevState = { object: 1 };
  const nextState = increment("object")(prevState);

  expect(nextState.object).toEqual(2);
  expect(prevState.object).toEqual(1);
});

test("mutate", () => {
  const prevState = { object: { a: "b" } };
  const nextState = mutate("object")({ a: "c" })(prevState);

  expect(nextState.object.a).toEqual("c");
  expect(prevState.object.a).toEqual("b");
});

test("prepend", () => {
  const prevState = { objects: [1, 2, 3] };
  const nextState = prepend("objects")(0)(prevState);

  expect(nextState.objects[0]).toEqual(0);
  expect(prevState.objects.length).toEqual(3);
});

test("toggle", () => {
  const prevState = { object: true };
  const nextState = toggle("object")(prevState);

  expect(nextState.object).toBe(false);
  expect(prevState.object).toBe(true);
});

test("combineMutations", () => {
  const mutation = combineMutations(
    append("appendable"),
    decrement("decrementable"),
    increment("incrementable"),
    mutate("mutatable"),
    prepend("prependable"),
    toggle("toggleable")
  );

  const prevState = {
    appendable: [1, 2, 3],
    decrementable: 1,
    incrementable: 1,
    mutatable: { a: "b" },
    prependable: [1, 2, 3],
    toggleable: true
  };

  expect(mutation(4, { a: "c" }, 0)(prevState)).toEqual({
    appendable: [1, 2, 3, 4],
    decrementable: 0,
    incrementable: 2,
    mutatable: { a: "c" },
    prependable: [0, 1, 2, 3],
    toggleable: false
  });
});

test("combineMutations with all standalones", () => {
  const mutation = combineMutations(
    decrement("decrementable"),
    increment("incrementable"),
    toggle("toggleable")
  );

  const prevState = {
    decrementable: 1,
    incrementable: 1,
    toggleable: true
  };

  expect(mutation(prevState)).toEqual({
    decrementable: 0,
    incrementable: 2,
    toggleable: false
  });
});

test("combineMutations with plain objects", () => {
  const mutation = combineMutations(
    append("appendable"),
    { a: "a" },
    toggle("toggleable"),
    { b: "b", c: "c" }
  );

  const prevState = {
    appendable: [1, 2, 3],
    a: "b",
    toggleable: true,
    b: "c",
    c: "d"
  };

  expect(mutation(4)(prevState)).toEqual({
    appendable: [1, 2, 3, 4],
    a: "a",
    toggleable: false,
    b: "b",
    c: "c"
  });
});

test("combineMutations with plain objects with all standalones", () => {
  const mutation = combineMutations(
    increment("incrementable"),
    { a: "a" },
    toggle("toggleable"),
    { b: "b", c: "c" }
  );

  const prevState = {
    incrementable: 1,
    a: "b",
    toggleable: true,
    b: "c",
    c: "d"
  };

  expect(mutation(prevState)).toEqual({
    incrementable: 2,
    a: "a",
    toggleable: false,
    b: "b",
    c: "c"
  });
});
