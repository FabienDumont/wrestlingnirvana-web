<!-- app/pages/database/Promotions/[id].vue -->
<script setup lang="ts">
import { usePromotions } from '~/composables/usePromotions';

const route = useRoute();
const router = useRouter();

const { getById } = usePromotions();

const id = computed(() => route.params.id as string);

useHead({
  title: 'Promotion details',
});

const {
  data: promotion,
  status,
  error,
} = await useAsyncData('promotion-view-${id.value}', () => getById(id.value));
</script>

<template>
  <UDashboardPanel id="promotion-details">
    <template #header>
      <UDashboardNavbar :title="promotion?.name || 'Promotion details'" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            icon="i-lucide-arrow-left"
            size="sm"
            variant="ghost"
            @click="router.push('/database/promotions')"
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
          title="Failed to load promotion"
          :description="error?.message || 'Please try again later.'"
        />

        <!-- Not found -->
        <UAlert
          v-else-if="!promotion"
          color="neutral"
          title="Promotion not found"
          description="This promotion may have been deleted."
        />

        <!-- Content -->
        <div v-else class="space-y-6">
          <!-- Basic info -->
          <section>
            <h1 class="text-2xl font-semibold">
              {{ promotion.name }}
            </h1>
          </section>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
