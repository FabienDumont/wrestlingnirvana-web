<!-- app/pages/database/championships/index.vue -->
<script setup lang="ts">
import type { ChampionshipResponse } from '#shared/types/championships';
import { useChampionships } from '~/composables/useChampionships';
import { usePromotions } from '~/composables/usePromotions';
import ChampionshipUpsertModal from '~/components/championships/ChampionshipUpsertModal.vue';
import ChampionshipOwnershipHistoryModal from '~/components/championships/ChampionshipOwnershipHistoryModal.vue';

useHead({ title: 'Championships' });

const { $exception } = useNuxtApp();
const { user } = useAuth();
const toast = useToast();

const { getAll, getById, create, update, deleteChampionship, setOwnershipHistory } =
  useChampionships();
const { getAll: getAllPromotions } = usePromotions();

const {
  data: championships,
  status,
  error,
  refresh,
} = await useAsyncData('championships', () => getAll());
const { data: promotions } = await useAsyncData('promotions', () => getAllPromotions());

type PromotionOption = { label: string; value: string };
const promotionOptions = computed<PromotionOption[]>(() =>
  (promotions.value ?? []).map((p) => ({ label: p.name, value: p.id })),
);

const isUpsertOpen = ref(false);
const editing = ref<{ id: string | null; name: string }>({ id: null, name: '' });
const upsertLoading = ref(false);

const openCreateModal = () => {
  editing.value = { id: null, name: '' };
  isUpsertOpen.value = true;
};
const openEditModal = (championship: { id: string; name: string }) => {
  editing.value = { id: championship.id, name: championship.name };
  isUpsertOpen.value = true;
};

const handleUpsert = async (payload: { name: string }) => {
  upsertLoading.value = true;
  try {
    if (!editing.value.id) {
      await create(payload);
      toast.add({ title: 'Championship created', color: 'success' });
    } else {
      await update(editing.value.id, payload);
      toast.add({ title: 'Championship updated', color: 'success' });
    }
    await refresh();
    isUpsertOpen.value = false;
  } catch (e) {
    $exception.raise('Championship save failed', e);
  } finally {
    upsertLoading.value = false;
  }
};

const handleDelete = async (id: string) => {
  try {
    await deleteChampionship(id);
    await refresh();
    toast.add({ title: 'Championship deleted', color: 'success' });
  } catch (e) {
    $exception.raise('Championship deletion failed', e);
  }
};

const isHistoryOpen = ref(false);
const savingHistory = ref(false);
const selectedChampionship = ref<ChampionshipResponse | null>(null);

const openAssignModal = async (championshipId: string) => {
  try {
    selectedChampionship.value = await getById(championshipId);
    isHistoryOpen.value = true;
  } catch (e) {
    $exception.raise('Failed to load championship details', e);
  }
};
</script>

<template>
  <UDashboardPanel id="championships">
    <template #header>
      <UDashboardNavbar title="Championships" :ui="{ right: 'gap-3' }">
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
            New championship
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 space-y-4">
        <h1 class="text-xl font-semibold">Championships</h1>

        <div v-if="status === 'pending'" class="space-y-2">
          <USkeleton class="h-12 w-full" />
          <USkeleton class="h-12 w-full" />
          <USkeleton class="h-12 w-full" />
        </div>

        <UAlert
          v-else-if="status === 'error'"
          color="error"
          title="Failed to load championships"
          :description="error?.message || 'Please try again later.'"
        />

        <UAlert
          v-else-if="!Array.isArray(championships) || championships.length === 0"
          color="neutral"
          title="No championships yet"
          description="No championship have been created yet."
        />

        <UPageList v-else divide>
          <UPageCard v-for="c in championships" :key="c.id" variant="ghost">
            <template #body>
              <div class="flex items-center justify-between gap-3">
                <div class="flex flex-col">
                  <NuxtLink
                    :to="`/database/championships/${c.id}`"
                    class="font-medium hover:underline"
                  >
                    {{ c.name }}
                  </NuxtLink>
                </div>

                <div class="flex items-center gap-1">
                  <UButton
                    v-if="user?.role === 'Admin'"
                    icon="i-lucide-flag"
                    size="xs"
                    variant="ghost"
                    aria-label="Assign promotion"
                    @click="openAssignModal(c.id)"
                  />
                  <UButton
                    v-if="user?.role === 'Admin'"
                    icon="i-lucide-pencil"
                    size="xs"
                    variant="ghost"
                    aria-label="Edit championship"
                    @click="openEditModal(c)"
                  />
                  <UButton
                    v-if="user?.role === 'Admin'"
                    icon="i-lucide-trash"
                    size="xs"
                    variant="ghost"
                    aria-label="Delete championship"
                    @click="handleDelete(c.id)"
                  />
                </div>
              </div>
            </template>
          </UPageCard>
        </UPageList>
      </div>

      <ChampionshipUpsertModal
        v-model:open="isUpsertOpen"
        :title="editing.id ? 'Edit championship' : 'New championship'"
        :initial-name="editing.name"
        :loading="upsertLoading"
        @submit="handleUpsert"
      />

      <ChampionshipOwnershipHistoryModal
        v-model:open="isHistoryOpen"
        :loading="savingHistory"
        :promotion-options="promotionOptions"
        :championship="selectedChampionship"
        @save="
          async (payload) => {
            if (!selectedChampionship) return;
            savingHistory = true;
            try {
              await setOwnershipHistory(selectedChampionship.id, payload);
              await refresh();
              isHistoryOpen = false;
              toast.add({ title: 'Ownership history saved', color: 'success' });
            } catch (e) {
              $exception.raise('Ownership history save failed', e);
            } finally {
              savingHistory = false;
            }
          }
        "
      />
    </template>
  </UDashboardPanel>
</template>
