// app/plugins/init-auth.server.ts
export default defineNuxtPlugin(async () => {
  const { user, fetchMe } = useAuth();

  if (user.value !== null) {
    await fetchMe();
  }
});
