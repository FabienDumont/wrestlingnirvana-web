// server/utils/wrapFetch.ts
import type { H3Event } from 'h3';
import type { FetchError } from 'ofetch';

export async function wrapFetch<T>(event: H3Event, request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (err: unknown) {
    const e = err as
      | FetchError<unknown>
      | {
          statusCode?: number;
          response?: { status?: number; _data?: unknown };
          data?: unknown;
          status?: number;
        };

    const statusCode = e.response?.status ?? e.statusCode ?? e.status ?? 500;

    if (statusCode >= 500) {
      console.error('API error:', err);
    } else if (import.meta.dev) {
      console.warn('Handled API error:', statusCode);
    }

    const data = e.response?._data ?? e.data;

    let message: string | undefined;
    if (typeof data === 'string') {
      message = data;
    } else if (data && typeof data === 'object') {
      const obj = data as { detail?: string; title?: string; message?: string };
      message = obj.detail ?? obj.title ?? obj.message;
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
      statusMessage: message || 'Request failed',
      data: { message: message || 'Request failed' },
    });
  }
}
