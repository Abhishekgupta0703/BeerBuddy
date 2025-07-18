import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../../store/useCartStore";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function CartScreen() {
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeOne = useCartStore((state) => state.removeOneFromCart);
  const removeAll = useCartStore((state) => state.removeFromCart);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRemoveAll = (itemId: string, itemName: string) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${itemName} from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeAll(itemId) }
      ]
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
        </View>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cart-outline" size={80} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some delicious beers to get started!</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push("/(user)")}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
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
                  <TouchableOpacity 
                    onPress={() => handleRemoveAll(item.id, item.name)} 
                    style={styles.deleteIcon}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
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
    </Animated.View>
)}

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
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f3f4f6"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1
  },
  cartBadge: {
    backgroundColor: "#f59e0b",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold"
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 20,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32
  },
  shopButton: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
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
