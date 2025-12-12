// shared/types/championships.ts
export type ChampionshipResponse = {
  id: string;
  name: string;
  ownershipHistory: ChampionshipOwnershipResponse[];
};

export type ChampionshipOwnershipResponse = {
  promotionId: string;
  fromDate: string;
  toDate: string | null;
};
