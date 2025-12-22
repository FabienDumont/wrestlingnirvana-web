// composables/usePromotions.ts
import type { PromotionResponse } from '#shared/types/promotions';
export type Promotion = PromotionResponse;

type PromotionPayload = {
  name: string;
};

export const usePromotions = () => {
  const apiFetch = useApiFetch();

  const getById = async (id: string): Promise<Promotion> => {
    return await apiFetch<Promotion>(`/api/promotions/${id}`, {
      method: 'GET',
    });
  };

  const getAll = async (): Promise<Promotion[]> => {
    return await apiFetch<Promotion[]>('/api/promotions', {
      method: 'GET',
    });
  };

  const create = async (payload: PromotionPayload): Promise<Promotion> => {
    return await apiFetch<Promotion>('/api/promotions', {
      method: 'POST',
      body: payload,
    });
  };

  const update = async (id: string, payload: PromotionPayload): Promise<Promotion> => {
    return await apiFetch<Promotion>(`/api/promotions/${id}`, {
      method: 'PUT',
      body: payload,
    });
  };

  const deletePromotion = async (id: string) => {
    await apiFetch(`/api/promotions/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getById,
    getAll,
    create,
    update,
    deletePromotion,
  };
};
