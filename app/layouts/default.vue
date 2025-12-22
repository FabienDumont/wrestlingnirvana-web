<!-- app/layouts/default.vue -->
<script lang="ts" setup>
import type { NavigationMenuItem } from '#ui/types';

const open = ref(false);

const { user, logout } = useAuth();

const navItems = computed<NavigationMenuItem[]>(() => {
  const base: NavigationMenuItem[] = [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
      onSelect: () => {
        open.value = false;
      },
    },
  ];

  base.push({
    label: 'Database',
    icon: 'i-lucide-database',
    children: [
      {
        label: 'Promotions',
        to: '/database/promotions',
        onSelect: () => {
          open.value = false;
        },
      },
      {
        label: 'Championships',
        to: '/database/championships',
        onSelect: () => {
          open.value = false;
        },
      },
    ],
  });

  return base;
});

const isLoggedIn = computed(() => user.value !== null);

const signIn = async () => {
  navigateTo('/auth/signin');
};

const signUp = async () => {
  navigateTo('/auth/signup');
};

const handleLogout = async () => {
  await logout();
  await navigateTo('/');
};

const goToAccount = () => {
  navigateTo('/auth/account');
};
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="flex w-full justify-center">
          <span class="font-semibold text-center">
            {{ collapsed ? 'WN' : 'Wrestling Nirvana' }}
          </span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="navItems"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <div
          :class="['w-full p-3', collapsed ? 'flex flex-col gap-2' : 'flex justify-center gap-2']"
        >
          <template v-if="isLoggedIn">
            <div
              :class="[
                'flex items-center gap-2',
                collapsed ? 'flex-col' : 'flex-row justify-between w-full',
              ]"
            >
              <button
                type="button"
                :class="[
                  'flex items-center gap-2 rounded-md px-2 py-1 transition hover:bg-muted/60',
                  collapsed ? 'justify-center' : 'justify-start',
                ]"
                @click="goToAccount"
              >
                <UAvatar size="xs" icon="i-lucide-user" />
                <span v-if="!collapsed" class="text-sm font-medium truncate">
                  {{ user?.username }}
                </span>
              </button>

              <UButton
                icon="i-lucide-log-out"
                :label="collapsed ? undefined : 'Logout'"
                :square="collapsed"
                :block="collapsed"
                variant="ghost"
                class="whitespace-nowrap"
                @click="handleLogout"
              />
            </div>
          </template>

          <template v-else>
            <UButton
              icon="i-lucide-log-in"
              :label="collapsed ? undefined : 'Sign in'"
              :square="collapsed"
              :block="collapsed"
              class="whitespace-nowrap"
              @click="signIn"
            />
            <UButton
              icon="i-lucide-user-round-plus"
              :label="collapsed ? undefined : 'Sign up'"
              :square="collapsed"
              :block="collapsed"
              class="whitespace-nowrap"
              @click="signUp"
            />
          </template>
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
