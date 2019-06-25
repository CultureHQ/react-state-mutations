import { act, renderHook } from "@testing-library/react-hooks";

import {
  makeStandaloneMutation,
  makeArgumentMutation,
  makeStandaloneHook,
  makeArgumentHook,
  append, useAppend,
  concat, useConcat,
  cycle, useCycle,
  decrement, useDecrement,
  direct,
  filter, useFilter,
  increment, useIncrement,
  map, useMap,
  mutate,
  prepend, usePrepend,
  toggle, useToggle,
  combineMutations
} from "../mutations";

describe("factories", () => {
  test("makeStandaloneMutation", () => {
    const mutation = makeStandaloneMutation(value => value + 50)("object");
    const prevState = { object: 1 };
    const nextState = mutation(prevState);

    expect(nextState.object).toEqual(51);
    expect(prevState.object).toEqual(1);
  });

  test("makeArgumentMutation", () => {
    const mutation = makeArgumentMutation(object => value => value + object)("object")(50);
    const prevState = { object: 1 };
    const nextState = mutation(prevState);

    expect(nextState.object).toEqual(51);
    expect(prevState.object).toEqual(1);
  });

  test("makeStandaloneHook", () => {
    const useDouble = makeStandaloneHook(value => value * 2);

    let count;
    let onDouble;

    renderHook(() => {
      ([count, onDouble] = useDouble(1));
    });

    expect(count).toBe(1);

    act(() => onDouble());
    expect(count).toBe(2);

    act(() => onDouble());
    expect(count).toBe(4);
  });

  test("makeArgumentHook", () => {
    const useAddHook = makeArgumentHook(object => value => value + object);

    let count;
    let onAdd;

    renderHook(() => {
      ([count, onAdd] = useAddHook(0));
    });

    expect(count).toBe(0);

    act(() => onAdd(10));
    expect(count).toBe(10);

    act(() => onAdd(20));
    expect(count).toBe(30);
  });
});

describe("appending", () => {
  test("append", () => {
    const mutation = append("objects")(4);
    const prevState = { objects: [1, 2, 3] };
    const nextState = mutation(prevState);

    expect(nextState.objects[nextState.objects.length - 1]).toEqual(4);
    expect(prevState.objects.length).toEqual(3);
  });

  test("useAppend", () => {
    let value;
    let onAppend;

    renderHook(() => {
      ([value, onAppend] = useAppend([1]));
    });

    expect(value).toEqual([1]);

    act(() => onAppend(2));
    expect(value).toEqual([1, 2]);

    act(() => onAppend(3));
    expect(value).toEqual([1, 2, 3]);
  });
});

describe("concat-ing", () => {
  test("concat", () => {
    const mutation = concat("objects")([4, 5, 6]);
    const prevState = { objects: [1, 2, 3] };
    const nextState = mutation(prevState);

    expect(nextState.objects.length).toEqual(6);
    expect(nextState.objects[nextState.objects.length - 1]).toEqual(6);
    expect(prevState.objects.length).toEqual(3);
  });

  test("useConcat", () => {
    let value;
    let onConcat;

    renderHook(() => {
      ([value, onConcat] = useConcat([1]));
    });

    expect(value).toEqual([1]);

    act(() => onConcat([2, 3]));
    expect(value).toEqual([1, 2, 3]);

    act(() => onConcat([4, 5]));
    expect(value).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("prepending", () => {
  test("prepend", () => {
    const mutation = prepend("objects")(0);
    const prevState = { objects: [1, 2, 3] };
    const nextState = mutation(prevState);

    expect(nextState.objects[0]).toEqual(0);
    expect(prevState.objects.length).toEqual(3);
  });

  test("usePrepend", () => {
    let value;
    let onPrepend;

    renderHook(() => {
      ([value, onPrepend] = usePrepend([3]));
    });

    expect(value).toEqual([3]);

    act(() => onPrepend(2));
    expect(value).toEqual([2, 3]);

    act(() => onPrepend(1));
    expect(value).toEqual([1, 2, 3]);
  });
});

describe("cycling", () => {
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

  test("useCycle", () => {
    let value;
    let onCycle;

    renderHook(() => {
      ([value, onCycle] = useCycle([1, 2, 3]));
    });

    expect(value).toEqual(1);

    act(() => onCycle());
    expect(value).toEqual(2);

    act(() => onCycle());
    expect(value).toEqual(3);

    act(() => onCycle());
    expect(value).toEqual(1);
  });
});

describe("decrementing", () => {
  test("decrement", () => {
    const mutation = decrement("object");
    const prevState = { object: 1 };
    const nextState = mutation(prevState);

    expect(nextState.object).toEqual(0);
    expect(prevState.object).toEqual(1);
  });

  test("useDecrement", () => {
    let count;
    let onDecrement;

    renderHook(() => {
      ([count, onDecrement] = useDecrement(0));
    });

    expect(count).toBe(0);

    act(() => onDecrement());
    expect(count).toBe(-1);

    act(() => onDecrement());
    expect(count).toBe(-2);
  });

  test("useDecrement default", () => {
    let count;

    renderHook(() => {
      ([count] = useDecrement());
    });

    expect(count).toBe(0);
  });
});

describe("incrementing", () => {
  test("increment", () => {
    const mutation = increment("object");
    const prevState = { object: 1 };
    const nextState = mutation(prevState);

    expect(nextState.object).toEqual(2);
    expect(prevState.object).toEqual(1);
  });

  test("useIncrement", () => {
    let count;
    let onIncrement;

    renderHook(() => {
      ([count, onIncrement] = useIncrement(0));
    });

    expect(count).toBe(0);

    act(() => onIncrement());
    expect(count).toBe(1);

    act(() => onIncrement());
    expect(count).toBe(2);
  });

  test("useIncrement default", () => {
    let count;

    renderHook(() => {
      ([count] = useIncrement());
    });

    expect(count).toBe(0);
  });
});

describe("toggling", () => {
  test("toggle", () => {
    const mutation = toggle("object");
    const prevState = { object: true };
    const nextState = mutation(prevState);

    expect(nextState.object).toBe(false);
    expect(prevState.object).toBe(true);
  });

  test("useToggle", () => {
    let value;
    let onToggle;

    renderHook(() => {
      ([value, onToggle] = useToggle(false));
    });

    expect(value).toBe(false);

    act(() => onToggle());
    expect(value).toBe(true);

    act(() => onToggle());
    expect(value).toBe(false);
  });

  test("useToggle default", () => {
    let count;

    renderHook(() => {
      ([count] = useToggle());
    });

    expect(count).toBe(true);
  });
});

describe("filtering", () => {
  test("filter", () => {
    const mutation = filter("objects")(value => value % 2 === 0);
    const prevState = { objects: [1, 2, 3, 4, 5, 6] };
    const nextState = mutation(prevState);

    expect(nextState.objects).toEqual([2, 4, 6]);
    expect(prevState.objects).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test("useFilter", () => {
    let value;
    let onFilter;

    renderHook(() => {
      ([value, onFilter] = useFilter([1, 2, 3, 4, 5, 6, 7, 8]));
    });

    expect(value).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

    act(() => onFilter((current, index) => index < (value.length / 2)));
    expect(value).toEqual([1, 2, 3, 4]);

    act(() => onFilter((current, index) => index < (value.length / 2)));
    expect(value).toEqual([1, 2]);
  });

  test("useFilter default", () => {
    let count;

    renderHook(() => {
      ([count] = useFilter());
    });

    expect(count).toEqual([]);
  });
});

describe("mapping", () => {
  test("map", () => {
    const mutation = map("objects")(value => value * 2);
    const prevState = { objects: [1, 2, 3] };
    const nextState = mutation(prevState);

    expect(nextState.objects).toEqual([2, 4, 6]);
    expect(prevState.objects).toEqual([1, 2, 3]);
  });

  test("useMap", () => {
    let value;
    let onMap;

    renderHook(() => {
      ([value, onMap] = useMap([1, 2, 3]));
    });

    expect(value).toEqual([1, 2, 3]);

    act(() => onMap(item => item * 2));
    expect(value).toEqual([2, 4, 6]);

    act(() => onMap(item => item * 4));
    expect(value).toEqual([8, 16, 24]);
  });

  test("useMap default", () => {
    let count;

    renderHook(() => {
      ([count] = useMap());
    });

    expect(count).toEqual([]);
  });
});

describe("other mutations", () => {
  test("direct", () => {
    const mutation = direct("object")("bar");
    const prevState = { object: "foo" };
    const nextState = mutation(prevState);

    expect(nextState.object).toEqual("bar");
    expect(prevState.object).toEqual("foo");
  });

  test("mutate", () => {
    const mutation = mutate("object")({ a: "c" });
    const prevState = { object: { a: "b" } };
    const nextState = mutation(prevState);

    expect(nextState.object.a).toEqual("c");
    expect(prevState.object.a).toEqual("b");
  });
});

describe("combineMutations", () => {
  test("basic", () => {
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

  test("with all standalones", () => {
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

  test("with plain objects", () => {
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

  test("with plain objects with all standalones", () => {
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

  test("with arguments works when called multiple times", () => {
    const mutation = combineMutations(append("appendable"), { a: "b" })(1);

    const prevState = { appendable: [1], a: "a" };
    const nextState = mutation(prevState);

    expect(nextState).toEqual({ appendable: [1, 1], a: "b" });
    expect(mutation(nextState)).toEqual({ appendable: [1, 1, 1], a: "b" });
  });
});
