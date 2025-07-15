import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LocationPermissionScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for location icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        
        // Store location in global state or async storage if needed
        router.replace('/(user)');
      } else {
        Alert.alert(
          'Location Permission Required',
          'We need your location to deliver beer to you. Please enable location access in settings.',
          [
            { text: 'Skip for now', onPress: () => router.replace('/(user)') },
            { text: 'Try Again', onPress: requestLocationPermission },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#FFF7ED', '#FBBF24', '#F59E0B']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Ionicons name="location" size={80} color="#78350F" />
        </Animated.View>

        <Text style={styles.title}>Enable Location</Text>
        <Text style={styles.subtitle}>
          We'll use your location to find the best beer selection near you and provide accurate delivery estimates.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
            <Text style={styles.featureText}>Accurate delivery time</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
            <Text style={styles.featureText}>Best local beer selection</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
            <Text style={styles.featureText}>Fastest delivery routes</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.allowButton}
          onPress={requestLocationPermission}
        >
          <Text style={styles.allowButtonText}>Allow Location Access</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace('/(user)')}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 80,
    padding: 40,
    marginBottom: 32,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#78350F',
    marginLeft: 12,
    fontWeight: '500',
  },
  allowButton: {
    backgroundColor: '#78350F',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  allowButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#78350F',
    fontSize: 16,
    fontWeight: '500',
  },
});
