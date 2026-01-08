import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { setSentryUser, clearSentryUser } from '@/lib/sentry';
import { createZustandSecureStorage } from '@/utils/secureStorage';

/**
 * 用户信息接口
 */
interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role?: string;
}

/**
 * 认证状态接口
 */
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * 认证状态管理 Store
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
        });

        // 设置 Sentry 用户信息
        setSentryUser({
          id: user.id,
          username: user.username,
          email: user.email,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });

        // 清除 Sentry 用户信息
        clearSentryUser();
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => {
          const updatedUser = state.user ? { ...state.user, ...userData } : null;

          // 更新 Sentry 用户信息
          if (updatedUser) {
            setSentryUser({
              id: updatedUser.id,
              username: updatedUser.username,
              email: updatedUser.email,
            });
          }

          return {
            user: updatedUser,
          };
        });
      },
    }),
    {
      name: 'auth-storage',
      // 使用加密存储
      storage: createJSONStorage(() => createZustandSecureStorage() as StateStorage),
    }
  )
);
