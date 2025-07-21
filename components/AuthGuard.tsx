import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/useUserStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { authState, loadAuthState } = useUserStore();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Load the current authentication state
        await loadAuthState();
        
        // Get the current state after loading
        const currentAuthState = useUserStore.getState().authState;
        
        // If user is not authenticated, redirect to welcome screen
        if (!currentAuthState.isAuthenticated) {
          console.log('User not authenticated, redirecting to welcome screen');
          router.replace('/welcome');
          return;
        }
        
        // If user is authenticated but not age verified, redirect to age verification
        if (!currentAuthState.isAgeVerified) {
          console.log('User not age verified, redirecting to age verification');
          router.replace('/age-verification');
          return;
        }
        
        // If user is authenticated and age verified but no location permission, redirect to location permission
        if (!currentAuthState.hasLocationPermission) {
          console.log('User has no location permission, redirecting to location permission');
          router.replace('/location-permission');
          return;
        }
        
        // User is fully authenticated and can access the protected screen
        console.log('User is fully authenticated');
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.replace('/welcome');
      }
    };

    checkAuthentication();
  }, [router, loadAuthState]);

  // Show loading while checking authentication
  if (!authState.isAuthenticated || !authState.isAgeVerified || !authState.hasLocationPermission) {
    return (
      <LinearGradient
        colors={['#FFF7ED', '#FEF3C7', '#FBBF24']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#78350F" />
        </View>
      </LinearGradient>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
});
