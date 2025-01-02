import { create } from "zustand";

interface User {
  userId: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface UserState {
  user: User | null; // 用户信息
  setUser: (user: User) => void; // 设置用户信息
  clearUser: () => void; // 清空用户信息
}

export const useUserStore = create<UserState>((set) => ({
  user: null, // 初始化为 null
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
