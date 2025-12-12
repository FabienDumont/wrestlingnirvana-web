// app/plugins/exception.ts
import { defineNuxtPlugin } from '#app';
import type { FetchError } from 'ofetch';
import type { ApiErrorData } from '#shared/types/error';

export default defineNuxtPlugin(() => {
  const toast = useToast();

  const log = (message: string, error: unknown): void => {
    if (import.meta.dev) {
      console.error(`[Exception] ${message}`, error);
    }
  };

  /**
   * Helper to extract the specific error message from the nested structure
   */
  function getErrorMessage(error: unknown): string {
    if (isFetchError(error)) {
      const payload = error.response?._data;

      if (payload && typeof payload === 'object' && 'data' in payload) {
        const innerData = (payload as { data: ApiErrorData }).data;
        if (innerData?.message) return innerData.message;
      }

      return (payload as { message?: string })?.message || error.statusMessage || 'Request failed';
    }

    if (error instanceof Error) return error.message;

    return 'An unexpected error occurred';
  }

  // Type guard for FetchError
  function isFetchError(error: unknown): error is FetchError {
    return typeof error === 'object' && error !== null && 'statusCode' in error;
  }

  return {
    provide: {
      exception: {
        log,
        raise: (title: string, error: unknown): void => {
          log(title, error);

          toast.add({
            title,
            description: getErrorMessage(error),
            color: 'error',
            icon: 'i-heroicons-exclamation-circle',
            duration: 5000,
          });
        },
      },
    },
  };
});
