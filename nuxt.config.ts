// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Only available server-side NUXT_API_BASE_URL
    apiBaseUrl: '',
    public: {
      // for client-side NUXT_PUBLIC_API_BASE_URL
      publicApiBaseUrl: '',
    },
  },
});
