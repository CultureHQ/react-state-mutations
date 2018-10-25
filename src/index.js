export const makeStandaloneMutation = apply => field => {
  const mutation = state => ({ [field]: apply(state[field]) });
  mutation.standalone = true;
  return mutation;
};

export const makeArgumentMutation = apply => field => object => state => ({
  [field]: apply(state[field], object)
});

export const makeCallbackMutation = name => (
  makeArgumentMutation((value, callback) => value[name](callback))
);

export const append = makeArgumentMutation((value, object) => [...value, object]);

export const concat = makeArgumentMutation((value, object) => [...value, ...object]);

export const cycle = makeArgumentMutation((value, object) => (
  object[(object.indexOf(value) + 1) % object.length]
));

export const decrement = makeStandaloneMutation(value => value - 1);

export const direct = makeArgumentMutation((value, object) => object);

export const filter = makeCallbackMutation("filter");

export const increment = makeStandaloneMutation(value => value + 1);

export const map = makeCallbackMutation("map");

export const mutate = makeArgumentMutation((value, object) => ({ ...value, ...object }));

export const prepend = makeArgumentMutation((value, object) => [object, ...value]);

export const toggle = makeStandaloneMutation(value => !value);

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
