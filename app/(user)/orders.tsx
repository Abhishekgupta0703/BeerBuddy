import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const orders = [
  {
    id: 'BD12345',
    date: '2024-01-15',
    status: 'Delivered',
    price: 748,
    items: 3,
  },
  {
    id: 'BD12344',
    date: '2024-01-10',
    status: 'Delivered',
    price: 599,
    items: 2,
  },
  {
    id: 'BD12343',
    date: '2024-01-05',
    status: 'Cancelled',
    price: 899,
    items: 4,
  },
];

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <View
                style={[
                  styles.status,
                  {
                    backgroundColor:
                      item.status === 'Delivered'
                        ? '#22c55e'
                        : item.status === 'Cancelled'
                        ? '#ef4444'
                        : '#facc15',
                  },
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.date}>
              {item.date} • {item.items} items
            </Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.outlineBtn}>
                <Text style={styles.outlineText}>View Details</Text>
              </TouchableOpacity>
              {item.status === 'Delivered' && (
                <TouchableOpacity style={styles.reorderBtn}>
                  <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>
              )}
            </View>
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
    paddingTop:45,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontWeight: '600',
    fontSize: 16,
  },
  status: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b45309',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineText: {
    fontWeight: '600',
    color: '#111827',
  },
  reorderBtn: {
    flex: 1,
    backgroundColor: '#f59e0b',
    padding: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  reorderText: {
    color: '#fff',
    fontWeight: '600',
  },
});
