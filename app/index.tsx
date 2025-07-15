import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/(user)');
      } else {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4136dc" />
      </View>
    );
  }

  return (
     <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>🍺</Text>
      </View>

      <Text style={styles.title}>BrewDash</Text>
      <Text style={styles.subtitle}>Premium beer delivered to your door</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(to bottom, #fff7ed, #fef9c3)', // fallback
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconWrapper: {
    backgroundColor: '#f59e0b',
    padding: 30,
    borderRadius: 100,
    marginBottom: 30,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#78350f',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#b45309',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});