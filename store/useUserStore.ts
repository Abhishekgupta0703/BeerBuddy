import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    name: string;
    email: string;
    phone: string;
    avatar: string;
};

type AuthState = {
    isAuthenticated: boolean;
    isAgeVerified: boolean;
    hasLocationPermission: boolean;
    hasSeenWelcome: boolean;
};

type UserStore = {
    user: User;
    authState: AuthState;
    setUser: (user: User) => void;
    updateUser: (data: Partial<User>) => void;
    clearUser: () => void;
    setAuthenticated: (isAuthenticated: boolean) => void;
    setAgeVerified: (isVerified: boolean) => void;
    setLocationPermission: (hasPermission: boolean) => void;
    setWelcomeSeen: (hasSeen: boolean) => void;
    loadAuthState: () => Promise<void>;
    saveAuthState: () => Promise<void>;
    logout: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
    user: {
        name: '',
        email: '',
        phone: '',
        avatar: '',
    },
    authState: {
        isAuthenticated: false,
        isAgeVerified: false,
        hasLocationPermission: false,
        hasSeenWelcome: false,
    },
    setUser: (user) => set({ user }),
    updateUser: (data) =>
        set((state) => ({
            user: { ...state.user, ...data },
        })),
    clearUser: () =>
        set({
            user: { name: '', email: '', phone: '', avatar: '' },
        }),
    setAuthenticated: (isAuthenticated) => {
        set((state) => ({
            authState: { ...state.authState, isAuthenticated },
        }));
        get().saveAuthState();
    },
    setAgeVerified: (isVerified) => {
        set((state) => ({
            authState: { ...state.authState, isAgeVerified: isVerified },
        }));
        get().saveAuthState();
    },
    setLocationPermission: (hasPermission) => {
        set((state) => ({
            authState: { ...state.authState, hasLocationPermission: hasPermission },
        }));
        get().saveAuthState();
    },
    setWelcomeSeen: (hasSeen) => {
        set((state) => ({
            authState: { ...state.authState, hasSeenWelcome: hasSeen },
        }));
        get().saveAuthState();
    },
    loadAuthState: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const ageVerified = await AsyncStorage.getItem('ageVerified');
            const locationPermission = await AsyncStorage.getItem('locationPermission');
            const welcomeSeen = await AsyncStorage.getItem('welcomeSeen');
            const userDataString = await AsyncStorage.getItem('userData');
            
            let userData = { name: '', email: '', phone: '', avatar: '' };
            if (userDataString) {
                userData = JSON.parse(userDataString);
            }
            
            set({
                user: userData,
                authState: {
                    isAuthenticated: !!token,
                    isAgeVerified: ageVerified === 'true',
                    hasLocationPermission: locationPermission === 'true',
                    hasSeenWelcome: welcomeSeen === 'true',
                },
            });
        } catch (error) {
            console.error('Error loading auth state:', error);
        }
    },
    saveAuthState: async () => {
        try {
            const { authState, user } = get();
            await AsyncStorage.setItem('ageVerified', authState.isAgeVerified.toString());
            await AsyncStorage.setItem('locationPermission', authState.hasLocationPermission.toString());
            await AsyncStorage.setItem('welcomeSeen', authState.hasSeenWelcome.toString());
            await AsyncStorage.setItem('userData', JSON.stringify(user));
        } catch (error) {
            console.error('Error saving auth state:', error);
        }
    },
    logout: async () => {
        try {
            await AsyncStorage.multiRemove(['token', 'ageVerified', 'locationPermission', 'userData']);
            set({
                user: { name: '', email: '', phone: '', avatar: '' },
                authState: {
                    isAuthenticated: false,
                    isAgeVerified: false,
                    hasLocationPermission: false,
                    hasSeenWelcome: false, // Reset welcome seen so user sees welcome screen again
                },
            });
        } catch (error) {
            console.error('Error logging out:', error);
        }
    },
}));
