import {
  makeStandaloneMutation,
  makeArgumentMutation,
  makeCallbackMutation,
  append,
  cycle,
  decrement,
  filter,
  increment,
  map,
  mutate,
  prepend,
  toggle,
  combineMutations
} from "../src/index";

test("makeStandaloneMutation", () => {
  const mutation = makeStandaloneMutation(value => value + 50)("object");
  const prevState = { object: 1 };
  const nextState = mutation(prevState);

  expect(nextState.object).toEqual(51);
  expect(prevState.object).toEqual(1);
});

test("makeArgumentMutation", () => {
  const mutation = makeArgumentMutation((value, object) => value + object)("object")(50);
  const prevState = { object: 1 };
  const nextState = mutation(prevState);

  expect(nextState.object).toEqual(51);
  expect(prevState.object).toEqual(1);
});

test("makeCallbackMutation", () => {
  const mutation = makeCallbackMutation("map")("objects")(value => value * 3);
  const prevState = { objects: [1, 2, 3] };
  const nextState = mutation(prevState);

  expect(nextState.objects).toEqual([3, 6, 9]);
  expect(prevState.objects).toEqual([1, 2, 3]);
});

test("append", () => {
  const mutation = append("objects")(4);
  const prevState = { objects: [1, 2, 3] };
  const nextState = mutation(prevState);

  expect(nextState.objects[nextState.objects.length - 1]).toEqual(4);
  expect(prevState.objects.length).toEqual(3);
});

test("cycle", () => {
  const mutation = cycle("object")(["foo", "bar", "baz"]);
  const prevState = { object: "foo" };

  let nextState = mutation(prevState);
  expect(nextState.object).toEqual("bar");
  expect(prevState.object).toEqual("foo");

  nextState = mutation(nextState);
  expect(nextState.object).toEqual("baz");

  nextState = mutation(nextState);
  expect(nextState.object).toEqual("foo");
});

test("decrement", () => {
  const mutation = decrement("object");
  const prevState = { object: 1 };
  const nextState = mutation(prevState);

  expect(nextState.object).toEqual(0);
  expect(prevState.object).toEqual(1);
});

test("filter", () => {
  const mutation = filter("objects")(value => value % 2 === 0);
  const prevState = { objects: [1, 2, 3, 4, 5, 6] };
  const nextState = mutation(prevState);

  expect(nextState.objects).toEqual([2, 4, 6]);
  expect(prevState.objects).toEqual([1, 2, 3, 4, 5, 6]);
});

test("increment", () => {
  const mutation = increment("object");
  const prevState = { object: 1 };
  const nextState = mutation(prevState);

  expect(nextState.object).toEqual(2);
  expect(prevState.object).toEqual(1);
});

test("map", () => {
  const mutation = map("objects")(value => value * 2);
  const prevState = { objects: [1, 2, 3] };
  const nextState = mutation(prevState);

  expect(nextState.objects).toEqual([2, 4, 6]);
  expect(prevState.objects).toEqual([1, 2, 3]);
});

test("mutate", () => {
  const mutation = mutate("object")({ a: "c" });
  const prevState = { object: { a: "b" } };
  const nextState = mutation(prevState);

  expect(nextState.object.a).toEqual("c");
  expect(prevState.object.a).toEqual("b");
});

test("prepend", () => {
  const mutation = prepend("objects")(0);
  const prevState = { objects: [1, 2, 3] };
  const nextState = mutation(prevState);

  expect(nextState.objects[0]).toEqual(0);
  expect(prevState.objects.length).toEqual(3);
});

test("toggle", () => {
  const mutation = toggle("object");
  const prevState = { object: true };
  const nextState = mutation(prevState);

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

test("combineMutations with arguments works when called multiple times", () => {
  const mutation = combineMutations(append("appendable"), { a: "b" })(1);

  const prevState = { appendable: [1], a: "a" };
  const nextState = mutation(prevState);

  expect(nextState).toEqual({ appendable: [1, 1], a: "b" });
  expect(mutation(nextState)).toEqual({ appendable: [1, 1, 1], a: "b" });
});
