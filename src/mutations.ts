import { useCallback, useState } from "react";

type State = { [key: string]: StateValue };
type StateValue = any;
type StateField = keyof State;

interface Mutation {
  (state: State): State;
}

type StandaloneApply<T> = (value: T) => T;
type StandaloneMutation = StandaloneApply<State>;

type Argument = any;
type ArgumentApply<T, A> = (argument: A) => StandaloneApply<T>;
type ArgumentMutation<A> = ArgumentApply<State, A>;

export const makeStandaloneMutation = <T extends StateValue>(apply: StandaloneApply<T>) => (field: StateField): StandaloneMutation => {
  const mutation = (state: State) => ({ [field]: apply(state[field]) });
  mutation.standalone = true;
  return mutation;
};

export const makeStandaloneHook = <T extends StateValue>(apply: StandaloneApply<T>, defaultValue: T) => (initialValue = defaultValue) => {
  const [value, setValue] = useState<T>(initialValue);
  const onMutate = useCallback(() => setValue(apply), [setValue]);
  return [value, onMutate];
};

export const makeArgumentMutation = <T extends StateValue, A extends Argument>(apply: ArgumentApply<T, A>) => (field: StateField): ArgumentMutation<A> => {
  return (argument: A) => {
    const mutation = apply(argument);
    return (state: State) => ({ [field]: mutation(state[field]) });
  }
};

export const makeArgumentHook = <T extends StateValue, A extends Argument>(apply: ArgumentApply<T, A>, defaultValue: T) => (initialValue = defaultValue) => {
  const [value, setValue] = useState<T>(initialValue);
  const onMutate = useCallback(argument => setValue(apply(argument)), [setValue]);
  return [value, onMutate];
};

export const decrementState = (value: number) => value - 1;
export const decrement = makeStandaloneMutation<number>(decrementState);
export const useDecrement = makeStandaloneHook<number>(decrementState, 0);

export const incrementState = (value: number) => value + 1;
export const increment = makeStandaloneMutation<number>(incrementState);
export const useIncrement = makeStandaloneHook<number>(incrementState, 0);

export const toggleState = (value: boolean) => !value;
export const toggle = makeStandaloneMutation<boolean>(toggleState);
export const useToggle = makeStandaloneHook<boolean>(toggleState, true);

export const appendState = <T extends StateValue>(argument: T) => (value: Array<T>) => value.concat(argument);
export const append = makeArgumentMutation(appendState);
export const useAppend = makeArgumentHook(appendState, []);

type ConcatArg<T> = T | Array<T>;

export const concatState = <T extends StateValue>(argument: ConcatArg<T>) => (value: Array<T>) => value.concat(argument);
export const concat = makeArgumentMutation(concatState);
export const useConcat = makeArgumentHook(concatState, []);

export const cycleState = <T extends StateValue>(argument: Array<T>) => (value: T) => argument[(argument.indexOf(value) + 1) % argument.length];
export const cycle = makeArgumentMutation(cycleState);
export const useCycle = <T extends StateValue>(argument: Array<T>) => {
  const [value, setValue] = useState<T>(argument[0]);

  const cycleValue = useCallback(cycleState<T>(argument), [argument]);
  const onCycle = useCallback(() => setValue(cycleValue), [cycleValue]);

  return [value, onCycle];
};

export const directState = <T extends StateValue>(argument: T) => () => argument;
export const direct = makeArgumentMutation(directState);

type FilterArgument<T> = ((value: T) => boolean);

export const filterState = <T extends StateValue>(argument: FilterArgument<T>) => (value: Array<T>) => value.filter(argument);
export const filter = makeArgumentMutation(filterState);
export const useFilter = makeArgumentHook(filterState, []);

type MapArgument<T> = ((value: T) => T);

export const mapState = <T extends StateValue>(argument: MapArgument<T>) => (value: Array<T>) => value.map(argument);
export const map = makeArgumentMutation(mapState);
export const useMap = makeArgumentHook(mapState, []);

export const mutateState = (argument: object) => (value: object) => ({ ...value, ...argument });
export const mutate = makeArgumentMutation(mutateState);

export const prependState = <T extends StateValue>(argument: T) => (value: Array<T>) => [argument].concat(value);
export const prepend = makeArgumentMutation(prependState);
export const usePrepend = makeArgumentHook(prependState, []);

/*
export const combineMutations = (...mutations: (StandaloneMutation | ArgumentMutation)[]) => {
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
};*/
