// server/utils/withAuthAndId.ts
import type { H3Event } from 'h3';
import type { FetchOptions } from 'ofetch';

type AllowedMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type FetchBody = BodyInit | Record<string, unknown> | null | undefined;

export async function withAuthAndId<TResponse, TBody extends FetchBody = FetchBody>(
  event: H3Event,
  options: {
    method: AllowedMethod;
    url: (id: string) => string;
    body?: TBody;
  },
): Promise<TResponse> {
  const config = useRuntimeConfig();
  const accessToken = getCookie(event, 'access_token');

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { message: 'Unauthorized' },
    });
  }

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Id is required' },
    });
  }

  return await wrapFetch(event, async () => {
    const result = await $fetch(options.url(id), {
      baseURL: config.apiBaseUrl,
      method: options.method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: options.body,
    } satisfies FetchOptions);

    return result as TResponse;
  });
}
