import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../../store/useCartStore";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeOne = useCartStore((state) => state.removeOneFromCart);
  const removeAll = useCartStore((state) => state.removeFromCart);
  const router = useRouter();

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
      </View>

      {cartItems.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40, fontSize: 16 }}>
          Your cart is empty 😕
        </Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 14 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: item.image || "https://via.placeholder.com/70x100" }}
                  style={styles.image}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>

                {/* Quantity Controls */}
                <View style={styles.qtyBox}>
                  <TouchableOpacity onPress={() => removeOne(item.id)} style={styles.qtyBtn}>
                    <Text style={styles.qtyText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => addToCart({ ...item, quantity: 1 })} style={styles.qtyBtn}>
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeAll(item.id)} style={styles.deleteIcon}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* Total */}
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>₹{totalAmount}</Text>
          </View>

          {/* Checkout */}
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push("/(user)/checkout")}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#f9fafb"
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },
  image: {
    width: 60,
    height: 80,
    resizeMode: "cover",
    borderRadius: 6,
    marginRight: 14
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6
  },
  price: {
    color: "#b45309",
    fontSize: 15,
    fontWeight: "bold"
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  qtyBtn: {
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  qtyValue: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "600"
  },
  deleteIcon: {
    marginLeft: 6
  },
  totalBox: {
    backgroundColor: "#fff7ed",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#fef3c7"
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 16
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#d97706"
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: "#f59e0b",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
