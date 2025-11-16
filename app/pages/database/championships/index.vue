<!-- app/pages/database/championships/index.vue -->
<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useChampionships } from '~/composables/useChampionships';

useHead({
  title: 'Championships',
});

const { user } = useAuth();

const toast = useToast();

const { getAll, create, update } = useChampionships();

const {
  data: championships,
  status,
  error,
  refresh,
} = await useAsyncData('championships', () => getAll());

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

const openEditModal = (championship: { id: string; name: string }) => {
  editingId.value = championship.id;
  formState.name = championship.name;
  isModalOpen.value = true;
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
        title: 'Championship created',
        color: 'success',
      });
    } else {
      // update
      await update(editingId.value, payload);
      toast.add({
        title: 'Championship updated',
        color: 'success',
      });
    }

    // Refetch list and close modal
    await refresh();
    isModalOpen.value = false;
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err?.message || 'Failed to save championship.',
      color: 'error',
    });
  } finally {
    loading.value = false;
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
          title="Failed to load championships"
          :description="error?.message || 'Please try again later.'"
        />

        <!-- Empty state -->
        <UAlert
          v-else-if="!Array.isArray(championships) || championships.length === 0"
          color="neutral"
          title="No championships yet"
          description="No championship have been created yet."
        />

        <!-- List -->
        <UPageList v-else divide>
          <UPageCard v-for="championship in championships" :key="championship.id" variant="ghost">
            <template #body>
              <div class="flex items-center justify-between gap-3">
                <div class="flex flex-col">
                  <span class="font-medium">
                    {{ championship.name }}
                  </span>
                </div>

                <UButton
                  v-if="user?.role === 'Admin'"
                  icon="i-lucide-pencil"
                  size="xs"
                  variant="ghost"
                  aria-label="Edit championship"
                  @click="openEditModal(championship)"
                />
              </div>
            </template>
          </UPageCard>
        </UPageList>
      </div>

      <UModal
        v-model:open="isModalOpen"
        :dismissible="false"
        :title="editingId === null ? 'New championship' : 'Edit championship'"
      >
        <template #body>
          <UForm :state="formState" :schema="schema" class="space-y-4" @submit="onSubmit">
            <UFormField name="name" label="Name">
              <UInput v-model="formState.name" />
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
