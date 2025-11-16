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
    try {
      return await $fetch('/api/championships', {
        method: 'GET',
      });
    } catch (err: any) {
      const message = err?.data?.message || err?.statusMessage;

      throw new Error(message);
    }
  };

  const create = async (payload: ChampionshipPayload): Promise<Championship> => {
    return await $fetch<Championship>('/api/championships', {
      method: 'POST',
      body: payload,
    });
  };

  const update = async (id: string, payload: ChampionshipPayload): Promise<Championship> => {
    throw new Error('Not implemented');
  };

  return {
    getAll,
    create,
    update,
  };
};
