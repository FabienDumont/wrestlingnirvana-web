<!-- app/pages/auth/signin.vue -->
<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useAuth } from '~/composables/useAuth';

const schema = z.object({
  emailOrUsername: z.string('Email or username is required'),
  password: z.string('Password is required'),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  emailOrUsername: undefined,
  password: undefined,
});

const toast = useToast();

const loading = ref(false);

const { signIn } = useAuth();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  try {
    const { emailOrUsername, password } = event.data;

    const { error } = await signIn({
      emailOrUsername,
      password,
    });

    if (error) {
      toast.add({
        title: 'Error',
        description: error.message,
        color: 'error',
      });
      return;
    }

    toast.add({
      title: 'Success',
      description: 'Successfully signed in!',
      color: 'success',
    });

    await navigateTo('/');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UDashboardPanel id="signin">
    <template #header>
      <UDashboardNavbar title="Sign In" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <section class="flex w-full justify-center items-center p-3">
        <UCard>
          <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormField name="emailOrUsername" label="Email or username">
              <UInput v-model="state.emailOrUsername" icon="i-lucide-user" />
            </UFormField>

            <UFormField name="password" label="Password">
              <UInput
                v-model="state.password"
                type="password"
                autocomplete="current-password"
                icon="i-lucide-lock"
              />
            </UFormField>

            <UButton type="submit" :loading="loading">Sign in</UButton>
          </UForm>
        </UCard>
      </section>
    </template>
  </UDashboardPanel>
</template>
