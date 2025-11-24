<!-- app/pages/auth/account.vue -->
<script setup lang="ts">
import * as z from 'zod';

const { user } = useAuth();

useHead({ title: 'Account' });

const profileSchema = z.object({
  email: z.email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

type ProfileSchema = z.infer<typeof profileSchema>;

const profileState = reactive<ProfileSchema>({
  email: user.value?.email ?? '',
  username: user.value?.username ?? '',
});
</script>

<template>
  <UDashboardPanel id="account">
    <template #header>
      <UDashboardNavbar title="Account">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-4 space-y-6 max-w-xl">
        <h1 class="text-xl font-semibold">Account</h1>

        <UAlert
          v-if="!user"
          color="error"
          title="Failed to load account data"
          :description="'Please try again later.'"
        />

        <div v-else class="space-y-6">
          <UCard>
            <template #header>
              <h2 class="text-base font-semibold">Profile</h2>
            </template>

            <UForm :state="profileState" :schema="profileSchema" class="space-y-4">
              <UFormField name="email" label="Email">
                <UInput v-model="profileState.email" disabled />
              </UFormField>

              <UFormField name="username" label="Username">
                <UInput v-model="profileState.username" disabled />
              </UFormField>
            </UForm>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
