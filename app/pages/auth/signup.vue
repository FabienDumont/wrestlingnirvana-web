<!-- app/pages/auth/signup.vue -->
<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

useHead({
  title: 'Sign Up',
});

const schema = z.object({
  email: z.email('Invalid email'),
  username: z.string('Username is required').min(2, 'Must be at least 2 characters'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  username: undefined,
  password: undefined,
});

const toast = useToast();

const loading = ref(false);

const { signUp } = useAuth();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true;
  const { email, username, password } = event.data;

  const { error } = await signUp({
    email,
    username,
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
    description: 'Successfully signed up!',
    color: 'success',
  });

  await navigateTo('/');
  await navigateTo('/auth/signin');
}
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Sign Up" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <section class="flex w-full justify-center items-center p-3">
        <UCard>
          <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormField name="email" label="Email">
              <UInput
                v-model="state.email"
                type="email"
                autocomplete="email"
                icon="i-lucide-mail"
              />
            </UFormField>

            <UFormField name="username" label="Username">
              <UInput v-model="state.username" icon="i-lucide-user" />
            </UFormField>

            <UFormField name="password" label="Password">
              <UInput
                v-model="state.password"
                type="password"
                autocomplete="current-password"
                icon="i-lucide-lock"
              />
            </UFormField>

            <UButton type="submit" :loading="loading">Sign up</UButton>
          </UForm>
        </UCard>
      </section>
    </template>
  </UDashboardPanel>
</template>
