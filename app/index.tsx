import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/useUserStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { authState, loadAuthState } = useUserStore();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Load authentication state from storage
        await loadAuthState();
        
        // Get the current auth state after loading
        const currentAuthState = useUserStore.getState().authState;
        
        // ALWAYS show welcome screen first (regardless of hasSeenWelcome)
        // This ensures welcome screen appears on every app reload
        if (!currentAuthState.isAuthenticated) {
          // User is not authenticated - show welcome screen
          router.replace('/welcome');
        } else if (!currentAuthState.isAgeVerified) {
          // User is authenticated but not age verified
          router.replace('/age-verification');
        } else if (!currentAuthState.hasLocationPermission) {
          // User is authenticated and age verified but no location permission
          router.replace('/location-permission');
        } else {
          // User is fully authenticated - can access home
          router.replace('/(user)');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, always redirect to welcome screen
        router.replace('/welcome');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, [router, loadAuthState]);

  if (loading) {
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

  // This should never be reached since we're redirecting
  return null;
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
