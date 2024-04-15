import PocketBase, { type AuthModel } from 'pocketbase';

export default defineNuxtPlugin(async () => {
  const pb = new PocketBase('http://localhost:8080');

  const cookie = useCookie<{ token: string; model: AuthModel }>('pb_auth', {
    path: '/',
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false
  });

  pb.authStore.save(cookie.value?.token, cookie.value?.model);

  pb.authStore.onChange(() => {
    cookie.value = {
      token: pb.authStore.token,
      model: pb.authStore.model
    };
  });

  try {
    pb.authStore.isValid && (await pb.collection('users').authRefresh());
  } catch (_) {
    pb.authStore.clear();
  }

  return {
    provide: {
      pb
    }
  };
});
