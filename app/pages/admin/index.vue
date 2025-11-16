<!-- app/pages/admin/index.vue -->
<script setup lang="ts"></script>

<template>
  <UDashboardPanel id="admin">
    <template #header>
      <UDashboardNavbar title="Sign In" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <h1>Administration page</h1>
    </template>
  </UDashboardPanel>
</template>
