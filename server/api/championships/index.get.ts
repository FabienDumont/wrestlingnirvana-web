// server/api/championships/index.get.ts
import type { ChampionshipResponse } from '#shared/types/championships';

export default defineEventHandler<Promise<ChampionshipResponse[]>>(async (event) => {
  const config = useRuntimeConfig();

  try {
    return await $fetch<ChampionshipResponse[]>('/api/championships', {
      baseURL: config.apiBaseUrl,
      method: 'GET',
    });
  } catch (err: any) {
    console.log('Error while fetching championships from API', err);

    const statusCode = err?.response?.status || err?.statusCode || 500;

    throw createError({
      statusCode,
      statusMessage: 'Failed to fetch championships',
      data: { message: 'Failed to fetch championships' },
    });
  }
});
