import { View, Text, FlatList, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const notifications = [
  {
    id: '1',
    title: 'Order Delivered!',
    desc: 'Your order #BD12345 has been delivered successfully.',
    time: '2 hours ago',
    type: 'success',
  },
  {
    id: '2',
    title: 'New Craft Beer Available',
    desc: 'Check out our latest IPA collection with 20% off!',
    time: '1 day ago',
    type: 'info',
  },
  {
    id: '3',
    title: 'Order Confirmed',
    desc: 'Your order #BD12344 has been confirmed and is being prepared.',
    time: '2 days ago',
    type: 'neutral',
  },
];

export default function NotificationsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.card,
              item.type === 'success'
                ? { backgroundColor: '#fef3c7' }
                : item.type === 'info'
                ? { backgroundColor: '#f9fafb' }
                : { backgroundColor: '#f3f4f6' },
            ]}
          >
            <Text style={styles.bold}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </Animated.View>
        )}
      />
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop:45
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  bold: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  desc: {
    color: '#374151',
    marginBottom: 4,
  },
  time: {
    color: '#6b7280',
    fontSize: 12,
  },
  listContainer: {
    gap: 14,
  },
});
