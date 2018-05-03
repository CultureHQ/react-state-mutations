import {
  makeStandaloneMutation,
  makeArgumentMutation,
  combineMutations,
  append,
  decrement,
  increment,
  mutate,
  prepend,
  toggle
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
