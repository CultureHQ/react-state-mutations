export const makeStandaloneMutation = apply => field => {
  const mutation = state => ({ [field]: apply(state[field]) });
  mutation.standalone = true;
  return mutation;
};

export const makeArgumentMutation = apply => field => object => state => ({
  [field]: apply(state[field], object)
});

export const combineMutations = (...mutations) => {
  if (mutations.some(mutation => !mutation.standalone)) {
    return (...args) => state => mutation.reduce((nextState, mutation) => {
      mutation.standalone ? mutation(nextState) : mutation(args.shift())(nextState);
    }, state);
  }
  return state => mutation.reduce((nextState, mutation) => mutation(nextState), state);
};

export const append = makeArgumentMutation((value, object) => [...value, object]);

export const decrement = makeStandaloneMutation(value => value - 1);

export const increment = makeStandaloneMutation(value => value + 1);

export const mutate = makeArgumentMutation((value, object) => ({ ...value, ...object }));

export const prepend = makeArgumentMutation((value, object) => [object, ...value]);

export const toggle = makeStandaloneMutation(value => !value);
