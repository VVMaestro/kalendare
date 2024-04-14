import PocketBase from 'pocketbase';

export const usePocketBase = () => {
  const pb = new PocketBase('http://localhost:8080');

  const authWithUserAndPassword = async (username: string, password: string) => {
    try {
      return await pb.collection('users').authWithPassword(username, password);
    } catch (error: unknown) {
      console.error('Failed to auth', error);

      return undefined;
    }
  };

  return {
    pb,
    authWithUserAndPassword
  };
};
