<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

const props = defineProps<{
  open: boolean;
  title: string;
  initialName: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'submit', payload: { name: string }): void;
}>();

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
});
type Schema = z.output<typeof schema>;

const formState = reactive<Partial<Schema>>({
  name: props.initialName,
});

watch(
  () => props.initialName,
  (v) => (formState.name = v),
  { immediate: true },
);

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  emit('submit', { name: event.data.name });
};
</script>

<template>
  <UModal
    :open="open"
    :dismissible="false"
    :title="title"
    @update:open="(v) => emit('update:open', v)"
  >
    <template #body>
      <UForm :state="formState" :schema="schema" class="space-y-4" @submit="onSubmit">
        <UFormField name="name" label="Name">
          <UInput v-model="formState.name" class="w-full" placeholder="Championship name" />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            variant="ghost"
            color="neutral"
            type="button"
            @click="emit('update:open', false)"
          >
            Cancel
          </UButton>
          <UButton type="submit" :loading="loading"> Save </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
