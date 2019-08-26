import { useCallback, useState } from "react";

type State = { [key: string]: any };
type Field = keyof State;

type Apply<T> = (value: T) => T;
type ArgumentApply<T, A> = (argument: A) => Apply<T>;

type StandaloneMutation = Apply<State> & { standalone: true };
type ArgumentMutation<A> = ArgumentApply<State, A> & { standalone: false };

export const makeStandaloneMutation = <T extends any>(apply: Apply<T>) => (
  (field: Field): StandaloneMutation => {
    const mutation: StandaloneMutation = (state: State) => ({ [field]: apply(state[field]) });

    mutation.standalone = true as true;
    return mutation;
  }
);

export const makeStandaloneHook = (
  <T extends any>(apply: Apply<T>, defaultValue: T) => (initialValue = defaultValue) => {
    const [value, setValue] = useState<T>(initialValue);
    const onMutate = useCallback(() => setValue(apply), [setValue]);
    return [value, onMutate];
  }
);

export const makeArgumentMutation = <T extends any, A extends any>(apply: ArgumentApply<T, A>) => (
  (field: Field): ArgumentMutation<A> => {
    const mutation: ArgumentMutation<A> = (argument: A) => {
      const curried = apply(argument);
      return (state: State) => ({ [field]: curried(state[field]) });
    };

    mutation.standalone = false as false;
    return mutation;
  }
);

export const makeArgumentHook = (
  <T extends any, A extends any>(apply: ArgumentApply<T, A>, defaultValue: T) => (
    (initialValue = defaultValue) => {
      const [value, setValue] = useState<T>(initialValue);
      const onMutate = useCallback(argument => setValue(apply(argument)), [
        setValue
      ]);
      return [value, onMutate];
    }
  )
);

export const decrementState = (value: number): number => value - 1;
export const decrement = makeStandaloneMutation<number>(decrementState);
export const useDecrement = makeStandaloneHook<number>(decrementState, 0);

export const incrementState = (value: number): number => value + 1;
export const increment = makeStandaloneMutation<number>(incrementState);
export const useIncrement = makeStandaloneHook<number>(incrementState, 0);

export const toggleState = (value: boolean): boolean => !value;
export const toggle = makeStandaloneMutation<boolean>(toggleState);
export const useToggle = makeStandaloneHook<boolean>(toggleState, true);

export const appendState = <T extends any>(argument: T) => (value: T[]) => (
  value.concat(argument)
);

export const append = makeArgumentMutation(appendState);
export const useAppend = makeArgumentHook(appendState, []);

export const concatState = <T extends any>(argument: T | T[]) => (value: T[]) => (
  value.concat(argument)
);

export const concat = makeArgumentMutation(concatState);
export const useConcat = makeArgumentHook(concatState, []);

export const cycleState = <T extends any>(argument: T[]) => (value: T) => (
  argument[(argument.indexOf(value) + 1) % argument.length]
);

export const cycle = makeArgumentMutation(cycleState);
export const useCycle = <T extends any>(argument: T[]): [T, ReturnType<typeof useCallback>] => {
  const [value, setValue] = useState<T>(argument[0]);

  const cycleValue = useCallback(cycleState<T>(argument), [argument]);
  const onCycle = useCallback(() => setValue(cycleValue), [cycleValue]);

  return [value, onCycle];
};

export const directState = <T extends any>(argument: T) => () => argument;
export const direct = makeArgumentMutation(directState);

type FilterArgument<T> = ((value: T) => boolean);

export const filterState = <T extends any>(argument: FilterArgument<T>) => (value: T[]) => (
  value.filter(argument)
);

export const filter = makeArgumentMutation(filterState);
export const useFilter = makeArgumentHook(filterState, []);

type MapArgument<T> = ((value: T) => T);

export const mapState = <T extends any>(argument: MapArgument<T>) => (value: T[]) => (
  value.map(argument)
);

export const map = makeArgumentMutation(mapState);
export const useMap = makeArgumentHook(mapState, []);

export const mutateState = (argument: object) => (value: object) => ({ ...value, ...argument });
export const mutate = makeArgumentMutation(mutateState);

export const prependState = <T extends any>(argument: T) => (value: T[]) => (
  [argument].concat(value)
);

export const prepend = makeArgumentMutation(prependState);
export const usePrepend = makeArgumentHook(prependState, []);

type CombineMutation = StandaloneMutation | ArgumentMutation<any>;

const normalizeMutation = (mutation: (CombineMutation | State)): CombineMutation => {
  if (typeof mutation !== "object") {
    return mutation;
  }

  const directMutation: StandaloneMutation = () => mutation;

  directMutation.standalone = true as true;
  return directMutation;
};

export const combineMutations = (...mutations: (CombineMutation | State)[]): Apply<State> => {
  const normalized = mutations.map(normalizeMutation);

  if (normalized.some(mutation => !mutation.standalone)) {
    return (...args: any[]) => (state: State) => {
      let argIndex = -1;

      return normalized.reduce((nextState, mutation) => {
        let apply: Apply<State>;

        if (mutation.standalone) {
          apply = mutation;
        } else {
          argIndex += 1;
          apply = (mutation as ArgumentMutation<any>)(args[argIndex]);
        }

        return { ...nextState, ...apply(nextState) };
      }, state);
    };
  }

  return (state: State) => normalized.reduce(
    (nextState, mutation) => ({ ...nextState, ...mutation(nextState) }),
    state
  );
};
