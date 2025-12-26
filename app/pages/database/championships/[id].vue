<!-- app/pages/database/championships/[id].vue -->
<script setup lang="ts">
import { useChampionships } from '~/composables/useChampionships';
import { usePromotions } from '~/composables/usePromotions';
import type { TableColumn } from '@nuxt/ui';

type OwnershipHistory = {
  promotionId: string;
  fromDate?: string | null;
  toDate?: string | null;
};

type OwnershipHistoryRow = {
  promotionName: string;
  fromDate: string;
  toDate: string;
};

const route = useRoute();
const router = useRouter();

const { getById } = useChampionships();
const { getAll: getAllPromotions } = usePromotions();

const id = computed(() => route.params.id as string);

useHead({
  title: 'Championship details',
});

const { data, status, error } = useLazyAsyncData(
  'championship-view-${id.value}',
  async () => {
    const [championship, promotions] = await Promise.all([getById(id.value), getAllPromotions()]);

    return { championship, promotions };
  },
  {
    watch: [id],
  },
);

const championship = computed(() => data.value?.championship);
const promotions = computed(() => data.value?.promotions || []);

const promotionNameById = computed<Record<string, string>>(() => {
  if (!promotions.value) return {};
  return promotions.value.reduce(
    (acc, promotion) => {
      acc[promotion.id] = promotion.name;
      return acc;
    },
    {} as Record<string, string>,
  );
});

const columns: TableColumn<OwnershipHistory>[] = [
  {
    accessorKey: 'promotionName',
    header: 'Promotion',
  },
  {
    accessorKey: 'fromDate',
    header: 'From',
  },
  {
    accessorKey: 'toDate',
    header: 'To',
  },
];

const ownershipHistoryRows = computed<OwnershipHistoryRow[]>(() => {
  const history = championship.value?.ownershipHistory ?? [];
  const map = promotionNameById.value;

  return history.map((oh) => ({
    promotionName: map[oh.promotionId] ?? oh.promotionId,
    fromDate: oh.fromDate ? new Date(oh.fromDate).toLocaleDateString() : 'Present',
    toDate: oh.toDate ? new Date(oh.toDate).toLocaleDateString() : 'Present',
  }));
});
</script>

<template>
  <UDashboardPanel id="championship-details">
    <template #header>
      <UDashboardNavbar
        :title="championship?.name || 'Championship details'"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            icon="i-lucide-arrow-left"
            size="sm"
            variant="ghost"
            @click="router.push('/database/championships')"
          >
            Back to list
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4">
        <!-- Loading -->
        <div v-if="status === 'pending'" class="space-y-2">
          <USkeleton class="h-8 w-1/2" />
          <USkeleton class="h-6 w-1/3" />
          <USkeleton class="h-48 w-full" />
        </div>

        <!-- Error -->
        <UAlert
          v-else-if="status === 'error'"
          color="error"
          title="Failed to load championship"
          :description="error?.message || 'Please try again later.'"
        />

        <!-- Not found -->
        <UAlert
          v-else-if="!championship"
          color="neutral"
          title="Championship not found"
          description="This championship may have been deleted."
        />

        <!-- Content -->
        <div v-else class="space-y-6">
          <!-- Basic info -->
          <section>
            <h1 class="text-2xl font-semibold">
              {{ championship.name }}
            </h1>
          </section>

          <!-- Ownership history -->
          <section class="space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Ownership history</h2>
            </div>

            <div v-if="ownershipHistoryRows.length === 0">
              <UAlert
                color="neutral"
                title="No ownership history"
                description="This championship is not currently assigned to any promotion."
              />
            </div>

            <UTable v-else :data="ownershipHistoryRows" :columns="columns"> </UTable>
          </section>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
