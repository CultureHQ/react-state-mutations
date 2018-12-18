export const makeStandaloneMutation = apply => field => {
  const mutation = state => ({ [field]: apply(state[field]) });
  mutation.standalone = true;
  return mutation;
};

export const makeArgumentMutation = apply => field => object => {
  const mutation = apply(object);
  return state => ({ [field]: mutation(state[field]) });
};

export const decrementState = value => value - 1;
export const incrementState = value => value + 1;
export const toggleState = value => !value;

export const decrement = makeStandaloneMutation(decrementState);
export const increment = makeStandaloneMutation(incrementState);
export const toggle = makeStandaloneMutation(toggleState);

export const appendState = object => value => [...value, object];
export const concatState = object => value => [...value, ...object];
export const cycleState = object => value => object[(object.indexOf(value) + 1) % object.length];
export const directState = object => () => object;
export const filterState = callback => value => value.filter(callback);
export const mapState = callback => value => value.map(callback);
export const mutateState = object => value => ({ ...value, ...object });
export const prependState = object => value => [object, ...value];

export const append = makeArgumentMutation(appendState);
export const concat = makeArgumentMutation(concatState);
export const cycle = makeArgumentMutation(cycleState);
export const direct = makeArgumentMutation(directState);
export const filter = makeArgumentMutation(filterState);
export const map = makeArgumentMutation(mapState);
export const mutate = makeArgumentMutation(mutateState);
export const prepend = makeArgumentMutation(prependState);

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
