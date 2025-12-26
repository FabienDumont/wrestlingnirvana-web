// composables/useChampionships.ts
import type { ChampionshipResponse } from '#shared/types/championships';

export type Championship = ChampionshipResponse;

type ChampionshipPayload = {
  name: string;
};

export type AssignPromotionPayload = {
  promotionId: string;
  from: string;
};

export const useChampionships = () => {
  const apiFetch = useApiFetch();

  const getById = async (id: string): Promise<Championship> => {
    return await apiFetch<Championship>(`/api/championships/${id}`, {
      method: 'GET',
    });
  };

  const getAll = async (): Promise<Championship[]> => {
    return await apiFetch<Championship[]>('/api/championships', {
      method: 'GET',
    });
  };

  const create = async (payload: ChampionshipPayload): Promise<Championship> => {
    return await apiFetch<Championship>('/api/championships', {
      method: 'POST',
      body: payload,
    });
  };

  const update = async (id: string, payload: ChampionshipPayload): Promise<Championship> => {
    return await apiFetch<Championship>(`/api/championships/${id}`, {
      method: 'PUT',
      body: payload,
    });
  };

  const deleteChampionship = async (id: string) => {
    await apiFetch(`/api/championships/${id}`, {
      method: 'DELETE',
    });
  };

  const assignPromotion = async (championshipId: string, payload: AssignPromotionPayload) => {
    return await apiFetch(`/api/championships/${championshipId}/assign-promotion`, {
      method: 'POST',
      body: payload,
    });
  };

  return {
    getById,
    getAll,
    create,
    update,
    deleteChampionship,
    assignPromotion,
  };
};
