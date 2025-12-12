// composables/usePromotions.ts
import type { PromotionResponse } from '#shared/types/promotions';
export type Promotion = PromotionResponse;

export const usePromotions = () => {
  const getById = async (id: string): Promise<Promotion> => {
    return await $fetch<Promotion>(`/api/promotions/${id}`, {
      method: 'GET',
    });
  };

  const getAll = async (): Promise<Promotion[]> => {
    return await $fetch<Promotion[]>('/api/promotions', {
      method: 'GET',
    });
  };

  return {
    getById,
    getAll,
  };
};
