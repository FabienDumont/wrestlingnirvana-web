// server/api/championships/[id]/ownership-history.put.ts
import type { ChampionshipResponse } from '#shared/types/championships';
import { withAuthAndId } from '~~/server/utils/withAuthAndId';

type OwnershipLine = {
  promotionId: string;
  fromDate: string;
  toDate: string | null;
};

export default defineEventHandler<Promise<ChampionshipResponse>>(async (event) => {
  const body = await readBody<{ lines: OwnershipLine[] }>(event);

  return withAuthAndId<ChampionshipResponse>(event, {
    method: 'PUT',
    url: (id) => `/api/championships/${id}/ownership-history`,
    body,
  });
});
