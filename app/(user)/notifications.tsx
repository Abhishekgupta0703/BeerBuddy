import { View, Text, FlatList, StyleSheet } from 'react-native';

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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <View
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
          </View>
        )}
      />
    </View>
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
});
