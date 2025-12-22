// composables/useAuth.ts
type User = {
  email: string;
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
  const apiFetch = useApiFetch();
  const user = useState<User | null>('auth-user', () => null);

  const signIn = async (payload: SignInPayload): Promise<AuthResult> => {
    const { user: loggedInUser } = await apiFetch<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: payload,
    });

    user.value = loggedInUser;
    return { error: null };
  };

  const signUp = async (payload: SignUpPayload): Promise<AuthResult> => {
    await apiFetch<{ user: User }>('/api/auth/register', {
      method: 'POST',
      body: payload,
    });

    return { error: null };
  };

  const fetchMe = async (options?: { force?: boolean }): Promise<void> => {
    if (!options?.force && user.value !== null) {
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
      const { user: currentUser } = await apiFetch<{ user: User }>('/api/auth/me', {
        method: 'GET',
        headers,
      });

      user.value = currentUser;
    } catch {
      // 401 etc: treat as not logged in
      user.value = null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiFetch('/api/auth/logout', {
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
