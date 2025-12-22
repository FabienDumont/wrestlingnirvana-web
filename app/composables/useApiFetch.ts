// app/composables/useApiFetch.ts
export const useApiFetch = () => {
  const requestFetch = useRequestFetch();

  return requestFetch;
};
