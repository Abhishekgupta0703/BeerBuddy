import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BeerCard({ beer, onAdd }: any) {
  return (
    <View style={styles.card} >
      <View style={styles.imageBox}>
        <Ionicons name="image-outline" size={48} color="#e5e7eb" />
      </View>
      <Text style={styles.beerName}>{beer.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{beer.price}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
  },
  imageBox: {
    height: 100,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  beerName: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    color: '#b45309',
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#f59e0b',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
