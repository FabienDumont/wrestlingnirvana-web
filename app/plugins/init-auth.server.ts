// app/plugins/init-auth.server.ts
export default defineNuxtPlugin(async () => {
  const { fetchMe } = useAuth();

  await fetchMe();
});
