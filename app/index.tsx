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
        
        // Determine next screen based on auth state
        if (!currentAuthState.hasSeenWelcome) {
          router.replace('/welcome');
        } else if (!currentAuthState.isAuthenticated) {
          router.replace('/login');
        } else if (!currentAuthState.isAgeVerified) {
          router.replace('/age-verification');
        } else if (!currentAuthState.hasLocationPermission) {
          router.replace('/location-permission');
        } else {
          router.replace('/(user)');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
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
