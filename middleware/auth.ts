export default defineNuxtRouteMiddleware(() => {
  const { $pb } = useNuxtApp();

  if (!$pb.authStore.isValid) {
    return navigateTo('/auth');
  }
});
