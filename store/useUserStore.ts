import { create } from 'zustand';

type User = {
    name: string;
    email: string;
    avatar: string;
};

type UserStore = {
    user: User;
    setUser: (user: User) => void;
    updateUser: (data: Partial<User>) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        avatar: '', // default avatar or leave empty
    },
    setUser: (user) => set({ user }),
    updateUser: (data) =>
        set((state) => ({
            user: { ...state.user, ...data },
        })),
    clearUser: () =>
        set({
            user: { name: '', email: '', avatar: '' },
        }),
}));