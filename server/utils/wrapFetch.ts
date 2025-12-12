import type { H3Event } from 'h3';
import type { FetchError } from 'ofetch';
import type { ProblemDetails } from '#shared/types/error';

export async function wrapFetch<T>(event: H3Event, request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (err: unknown) {
    const fetchError = err as FetchError<ProblemDetails>;

    const statusCode = fetchError.response?.status ?? fetchError.statusCode ?? 500;

    if (statusCode >= 500) {
      console.error('API Server Error:', fetchError);
    } else if (import.meta.dev) {
      console.warn('API Client Error:', statusCode, fetchError.message);
    }

    const payload = fetchError.response?._data;
    let message = 'An unexpected error occurred';

    if (payload && typeof payload === 'object') {
      if (payload.errors && Object.keys(payload.errors).length > 0) {
        message = Object.entries(payload.errors)
          .map(([key, msgs]) => `${key}: ${msgs.join(', ')}`)
          .join('\n');
      } else {
        message = payload.detail ?? payload.title ?? message;
      }
    } else if (typeof payload === 'string') {
      message = payload;
    }

    if (statusCode === 401) {
      deleteCookie(event, 'access_token');
      deleteCookie(event, 'refresh_token');

      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        data: { message: message || 'Unauthorized' },
      });
    }

    throw createError({
      statusCode,
      statusMessage: message,
      data: { message },
    });
  }
}
