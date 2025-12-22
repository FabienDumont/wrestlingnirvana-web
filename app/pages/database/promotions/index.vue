<!-- app/pages/database/promotions/index.vue -->
<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { usePromotions } from '~/composables/usePromotions';

useHead({
  title: 'Promotions',
});

const { $exception } = useNuxtApp();

const { user } = useAuth();

const toast = useToast();

const { getAll, create, update, deletePromotion } = usePromotions();

const {
  data: promotions,
  status,
  error,
  refresh,
} = await useAsyncData('promotions', () => getAll());

const isModalOpen = ref(false);
const editingId = ref<string | null>(null);

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type Schema = z.output<typeof schema>;

const formState = reactive<Partial<Schema>>({
  name: undefined,
});

const openCreateModal = () => {
  editingId.value = null;
  formState.name = '';
  isModalOpen.value = true;
};

const openEditModal = (promotion: { id: string; name: string }) => {
  editingId.value = promotion.id;
  formState.name = promotion.name;
  isModalOpen.value = true;
};

const handleDeletePromotion = async (id: string) => {
  try {
    await deletePromotion(id);
    await refresh();
    toast.add({
      title: 'Promotion deleted',
      color: 'success',
    });
  } catch (error) {
    $exception.raise('Promotion deletion failed', error);
  }
};

const loading = ref(false);

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;

  try {
    const payload = {
      name: event.data.name,
    };

    if (editingId.value === null) {
      // create
      await create(payload);
      await refresh();
      toast.add({
        title: 'Promotion created',
        color: 'success',
      });
    } else {
      // update
      await update(editingId.value, payload);
      toast.add({
        title: 'Promotion updated',
        color: 'success',
      });
    }

    await refresh();
    isModalOpen.value = false;
  } catch (error) {
    $exception.raise('Promotion save failed', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UDashboardPanel id="promotions">
    <template #header>
      <UDashboardNavbar title="Promotions" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            v-if="user?.role === 'Admin'"
            icon="i-lucide-plus"
            size="sm"
            @click="openCreateModal"
          >
            New promotion
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="p-4 space-y-4">
        <h1 class="text-xl font-semibold">Promotions</h1>

        <!-- Loading state -->
        <div v-if="status === 'pending'" class="space-y-2">
          <USkeleton class="h-12 w-full" />
          <USkeleton class="h-12 w-full" />
          <USkeleton class="h-12 w-full" />
        </div>

        <!-- Error state -->
        <UAlert
          v-else-if="status === 'error'"
          color="error"
          title="Failed to load promotions"
          :description="error?.message || 'Please try again later.'"
        />

        <!-- Empty state -->
        <UAlert
          v-else-if="!Array.isArray(promotions) || promotions.length === 0"
          color="neutral"
          title="No promotions yet"
          description="No promotion have been created yet."
        />

        <!-- List -->
        <UPageList v-else divide>
          <UPageCard v-for="promotion in promotions" :key="promotion.id" variant="ghost">
            <template #body>
              <div class="flex items-center justify-between gap-3">
                <div class="flex flex-col">
                  <NuxtLink
                    :to="`/database/promotions/${promotion.id}`"
                    class="font-medium hover:underline"
                  >
                    {{ promotion.name }}
                  </NuxtLink>
                </div>

                <div class="flex items-center gap-1">
                  <UButton
                    v-if="user?.role === 'Admin'"
                    icon="i-lucide-pencil"
                    size="xs"
                    variant="ghost"
                    aria-label="Edit promotion"
                    @click="openEditModal(promotion)"
                  />
                  <UButton
                    v-if="user?.role === 'Admin'"
                    icon="i-lucide-trash"
                    size="xs"
                    variant="ghost"
                    aria-label="Delete promotion"
                    @click="handleDeletePromotion(promotion.id)"
                  />
                </div>
              </div>
            </template>
          </UPageCard>
        </UPageList>
      </div>

      <UModal
        v-model:open="isModalOpen"
        :dismissible="false"
        :title="editingId === null ? 'New promotion' : 'Edit promotion'"
      >
        <template #body>
          <UForm :state="formState" :schema="schema" class="space-y-4" @submit="onSubmit">
            <UFormField name="name" label="Name">
              <UInput v-model="formState.name" class="w-full" placeholder="Promotion name" />
            </UFormField>

            <div class="flex justify-end gap-2">
              <UButton variant="ghost" color="neutral" type="button" @click="isModalOpen = false">
                Cancel
              </UButton>
              <UButton type="submit" :loading="loading">
                {{ editingId === null ? 'Create' : 'Save' }}
              </UButton>
            </div>
          </UForm>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>
