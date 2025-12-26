// server/api/championships/[id]/assign-promotion.post.ts
import type { ChampionshipResponse } from '#shared/types/championships';
import { withAuthAndId } from '~~/server/utils/withAuthAndId';

export default defineEventHandler<Promise<ChampionshipResponse>>(async (event) => {
  const body = await readBody<{ name: string }>(event);

  return withAuthAndId<ChampionshipResponse>(event, {
    method: 'POST',
    url: (id) => `/api/championships/${id}/assign-promotion`,
    body,
  });
});
