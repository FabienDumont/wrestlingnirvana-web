// server/api/championships/[id].delete.ts
import { wrapFetch } from '../../utils/wrapFetch';

export default defineEventHandler(async (event): Promise<void> => {
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

  return await wrapFetch(event, () =>
    $fetch(`/api/championships/${id}`, {
      baseURL: config.apiBaseUrl,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );
});
