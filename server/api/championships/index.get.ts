// server/api/championships/index.get.ts
import { wrapFetch } from '../../utils/wrapFetch';
import type { ChampionshipResponse } from '#shared/types/championships';

export default defineEventHandler<Promise<ChampionshipResponse[]>>(async (event) => {
  const config = useRuntimeConfig();

  return await wrapFetch(event, () =>
    $fetch<ChampionshipResponse[]>('/api/championships', {
      baseURL: config.apiBaseUrl,
      method: 'GET',
    }),
  );
});
