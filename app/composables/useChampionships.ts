// composables/useChampionships.ts
export type Championship = {
  id: string;
  name: string;
};

type ChampionshipPayload = {
  name: string;
};

export const useChampionships = () => {
  const getAll = async (): Promise<Championship[]> => {
    return await $fetch<Championship[]>('/api/championships', {
      method: 'GET',
    });
  };

  const create = async (payload: ChampionshipPayload): Promise<Championship> => {
    return await $fetch<Championship>('/api/championships', {
      method: 'POST',
      body: payload,
    });
  };

  const update = async (id: string, payload: ChampionshipPayload): Promise<Championship> => {
    return await $fetch<Championship>(`/api/championships/${id}`, {
      method: 'PUT',
      body: payload,
    });
  };

  const deleteChampionship = async (id: string) => {
    await $fetch(`/api/championships/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getAll,
    create,
    update,
    deleteChampionship,
  };
};
