// server/api/championships/[id].get.ts
import { wrapFetch } from '../../utils/wrapFetch';
import type { ChampionshipResponse } from '#shared/types/championships';

export default defineEventHandler<Promise<ChampionshipResponse>>(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Championship id is required',
    });
  }

  return await wrapFetch(event, () =>
    $fetch<ChampionshipResponse>(`/api/championships/${id}`, {
      baseURL: config.apiBaseUrl,
      method: 'GET',
    }),
  );
});
