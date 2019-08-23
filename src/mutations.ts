import { useCallback, useState } from "react";

type State = { [key: string]: any };
type Field = keyof State;

type StandaloneApply<T> = (value: T) => T;
type ArgumentApply<T, A> = (argument: A) => StandaloneApply<T>;

const makeStandaloneMutationForField = <T extends any>(apply: StandaloneApply<T>, field: Field) => {
  const mutation = (state: State) => ({ [field]: apply(state[field]) });

  mutation.standalone = true;
  return mutation;
};

export const makeStandaloneMutation = <T extends any>(apply: StandaloneApply<T>) => (field: Field) => (
  makeStandaloneMutationForField<T>(apply, field)
);

export const makeStandaloneHook = <T extends any>(apply: StandaloneApply<T>, defaultValue: T) => (initialValue = defaultValue) => {
  const [value, setValue] = useState<T>(initialValue);
  const onMutate = useCallback(() => setValue(apply), [setValue]);
  return [value, onMutate];
};

export const makeArgumentMutationForField = <T extends any, A extends any>(apply: ArgumentApply<T, A>, field: Field) => {
  const mutation = (argument: A) => {
    const curried = apply(argument);
    return (state: State) => ({ [field]: curried(state[field]) });
  };

  mutation.standalone = false;
  return mutation;
};

export const makeArgumentMutation = <T extends any, A extends any>(apply: ArgumentApply<T, A>) => (field: Field) => (
  makeArgumentMutationForField<T, A>(apply, field)
);

export const makeArgumentHook = <T extends any, A extends any>(apply: ArgumentApply<T, A>, defaultValue: T) => (initialValue = defaultValue) => {
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

export const appendState = <T extends any>(argument: T) => (value: Array<T>) => value.concat(argument);
export const append = makeArgumentMutation(appendState);
export const useAppend = makeArgumentHook(appendState, []);

type ConcatArg<T> = T | Array<T>;

export const concatState = <T extends any>(argument: ConcatArg<T>) => (value: Array<T>) => value.concat(argument);
export const concat = makeArgumentMutation(concatState);
export const useConcat = makeArgumentHook(concatState, []);

export const cycleState = <T extends any>(argument: Array<T>) => (value: T) => argument[(argument.indexOf(value) + 1) % argument.length];
export const cycle = makeArgumentMutation(cycleState);
export const useCycle = <T extends any>(argument: Array<T>) => {
  const [value, setValue] = useState<T>(argument[0]);

  const cycleValue = useCallback(cycleState<T>(argument), [argument]);
  const onCycle = useCallback(() => setValue(cycleValue), [cycleValue]);

  return [value, onCycle];
};

export const directState = <T extends any>(argument: T) => () => argument;
export const direct = makeArgumentMutation(directState);

type FilterArgument<T> = ((value: T) => boolean);

export const filterState = <T extends any>(argument: FilterArgument<T>) => (value: Array<T>) => value.filter(argument);
export const filter = makeArgumentMutation(filterState);
export const useFilter = makeArgumentHook(filterState, []);

type MapArgument<T> = ((value: T) => T);

export const mapState = <T extends any>(argument: MapArgument<T>) => (value: Array<T>) => value.map(argument);
export const map = makeArgumentMutation(mapState);
export const useMap = makeArgumentHook(mapState, []);

export const mutateState = (argument: object) => (value: object) => ({ ...value, ...argument });
export const mutate = makeArgumentMutation(mutateState);

export const prependState = <T extends any>(argument: T) => (value: Array<T>) => [argument].concat(value);
export const prepend = makeArgumentMutation(prependState);
export const usePrepend = makeArgumentHook(prependState, []);

type StandaloneMutation = ReturnType<typeof makeStandaloneMutationForField>;
type ArgumentMutation = ReturnType<typeof makeArgumentMutationForField>;
export type Mutation = StandaloneMutation | ArgumentMutation;

export const combineMutations = (...mutations: Mutation[]) => {
  const normalized = mutations.map(mutation => {
    if (typeof mutation === "function") {
      return mutation;
    }

    const directMutation = () => mutation;
    directMutation.standalone = true;
    return directMutation;
  });

  if (normalized.some(mutation => !mutation.standalone)) {
    return (...args: any[]) => (state: State) => {
      let argIndex = -1;

      return normalized.reduce((nextState, mutation) => {
        if (mutation.standalone) {
          return { ...nextState, ...mutation(nextState) };
        }

        argIndex += 1;
        return { ...nextState, ...(mutation as ArgumentMutation)(args[argIndex])(nextState) };
      }, state);
    };
  }

  return (state: State) => normalized.reduce((nextState, mutation) => ({
    ...nextState,
    ...mutation(nextState)
  }), state);
};
