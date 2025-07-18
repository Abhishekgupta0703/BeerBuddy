import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useCartStore } from "../../store/useCartStore";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useState } from "react";

export default function CheckoutScreen() {
  const cartItems = useCartStore((state) => state.items);
  const router = useRouter();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const placeOrder = useCartStore((state) => state.placeOrder);
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Toast.show({ type: "info", text1: "Your cart is empty" });
      return;
    }

    placeOrder(); // ✅ Save order to history
    Toast.show({ type: "success", text1: "Order placed successfully" });
    router.replace("/(user)/orders");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Checkout</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>
              ₹{item.price} × {item.quantity}
            </Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: ₹{total}</Text>
        <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },
  card: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8
  },
  name: {
    fontSize: 16,
    fontWeight: "600"
  },
  price: {
    fontSize: 14,
    marginTop: 4,
    color: "#555"
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 20
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16
  },
  button: {
    backgroundColor: "#4136dc",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  }
});
