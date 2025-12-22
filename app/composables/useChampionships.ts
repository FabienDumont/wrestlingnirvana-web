// composables/useChampionships.ts
import type { ChampionshipResponse } from '#shared/types/championships';

export type Championship = ChampionshipResponse;

type ChampionshipPayload = {
  name: string;
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

  return {
    getById,
    getAll,
    create,
    update,
    deleteChampionship,
  };
};
