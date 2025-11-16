// composables/useAuth.ts
type User = {
  username: string;
  role: string;
};

type SignInPayload = {
  emailOrUsername: string;
  password: string;
};

type SignUpPayload = {
  email: string;
  username: string;
  password: string;
};

type AuthResult = {
  error: { message: string } | null;
};

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null);

  const signIn = async (payload: SignInPayload): Promise<AuthResult> => {
    try {
      const { user: loggedInUser } = await $fetch<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: payload,
      });

      user.value = loggedInUser;
      return { error: null };
    } catch (err: any) {
      const message =
        err?.data?.message || err?.statusMessage || 'An unknown error occurred while signing in.';

      return { error: { message } };
    }
  };

  const signUp = async (payload: SignUpPayload): Promise<AuthResult> => {
    try {
      await $fetch<{ user: User }>('/api/auth/register', {
        method: 'POST',
        body: payload,
      });

      return { error: null };
    } catch (err: any) {
      const message =
        err?.data?.message || err?.statusMessage || 'An unknown error occurred while signing up.';

      return { error: { message } };
    }
  };

  const fetchMe = async (): Promise<void> => {
    // If we already have a user (SSR hydration / client nav), do nothing
    if (user.value !== null) {
      return;
    }

    let headers: Record<string, string> | undefined;

    if (import.meta.server) {
      const requestHeaders = useRequestHeaders(['cookie']);

      headers = {};

      if (requestHeaders.cookie) {
        headers.cookie = requestHeaders.cookie;
      }
    }

    try {
      const { user: currentUser } = await $fetch<{ user: User }>('/api/auth/me', {
        method: 'GET',
        headers,
      });

      user.value = currentUser;
    } catch (err: any) {
      // 401 etc: treat as not logged in
      user.value = null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
      });
    } finally {
      user.value = null;
    }
  };

  return {
    user,
    signIn,
    signUp,
    fetchMe,
    logout,
  };
};
