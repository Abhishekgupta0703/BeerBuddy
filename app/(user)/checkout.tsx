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
  Platform,
  StatusBar
} from "react-native";
import { useCartStore } from "../../store/useCartStore";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function CheckoutScreen() {
  const cartItems = useCartStore((state) => state.items);
  const router = useRouter();

  const [selectedPayment, setSelectedPayment] = useState("card");
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharges = subtotal > 999 ? 0 : 49;
  const handlingCharges = 15;
  const codCharges = selectedPayment === "cod" ? 25 : 0;
  const promoDiscount = promoApplied ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal + deliveryCharges + handlingCharges + codCharges - promoDiscount;

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "card-outline" },
    { id: "upi", name: "UPI", icon: "phone-portrait-outline" },
    { id: "cod", name: "Cash on Delivery", icon: "cash-outline" },
    { id: "wallet", name: "Wallet", icon: "wallet-outline" }
  ];

  const addresses = [
    { id: 0, name: "Home", address: "123 Main St, Lucknow, UP 226001", phone: "+91 99999 88888" },
    { id: 1, name: "Office", address: "456 Business Park, Lucknow, UP 226010", phone: "+91 88888 77777" }
  ];

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

  const handlePromoApply = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true);
      Toast.show({ type: "success", text1: "Promo code applied!", text2: "10% discount added" });
    } else {
      Toast.show({ type: "error", text1: "Invalid promo code" });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF7ED" />
      <LinearGradient
        colors={['#FFF7ED', '#FEF3C7']}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>🧾 Checkout</Text>
        <Text style={styles.subtitle}>Review your order and payment details</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Delivery Address</Text>
          {addresses.map((address, index) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress === index && styles.selectedCard
              ]}
              onPress={() => setSelectedAddress(index)}
            >
              <View style={styles.addressHeader}>
                <Ionicons 
                  name={selectedAddress === index ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color={selectedAddress === index ? "#F59E0B" : "#9CA3AF"} 
                />
                <Text style={styles.addressName}>{address.name}</Text>
              </View>
              <Text style={styles.addressText}>{address.address}</Text>
              <Text style={styles.addressPhone}>{address.phone}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍺 Your Order</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price} × {item.quantity}</Text>
              </View>
              <Text style={styles.itemTotal}>₹{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎫 Promo Code</Text>
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code (try: SAVE10)"
              value={promoCode}
              onChangeText={setPromoCode}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.promoButton} onPress={handlePromoApply}>
              <Text style={styles.promoButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {promoApplied && (
            <Text style={styles.promoSuccess}>✅ Promo code applied successfully!</Text>
          )}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment === method.id && styles.selectedCard
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentHeader}>
                <Ionicons 
                  name={selectedPayment === method.id ? "radio-button-on" : "radio-button-off"} 
                  size={20} 
                  color={selectedPayment === method.id ? "#F59E0B" : "#9CA3AF"} 
                />
                <Ionicons name={method.icon as any} size={24} color="#4B5563" style={styles.paymentIcon} />
                <Text style={styles.paymentName}>{method.name}</Text>
              </View>
              {method.id === "cod" && (
                <Text style={styles.codNote}>Additional ₹25 charges apply</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Price Details</Text>
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>₹{subtotal}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Charges</Text>
              <Text style={[styles.priceValue, deliveryCharges === 0 && styles.freeText]}>
                {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Handling Charges</Text>
              <Text style={styles.priceValue}>₹{handlingCharges}</Text>
            </View>
            {codCharges > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>COD Charges</Text>
                <Text style={styles.priceValue}>₹{codCharges}</Text>
              </View>
            )}
            {promoDiscount > 0 && (
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, styles.discountText]}>Promo Discount</Text>
                <Text style={[styles.priceValue, styles.discountText]}>-₹{promoDiscount}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.buttonText}>Place Order • ₹{total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB"
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#78350F",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 16,
    color: "#B45309",
    fontWeight: "500"
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12
  },
  addressCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  selectedCard: {
    borderColor: "#F59E0B",
    borderWidth: 2
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  addressName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 12
  },
  addressText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
    marginLeft: 32
  },
  addressPhone: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 32
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4
  },
  itemPrice: {
    fontSize: 14,
    color: "#6B7280"
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B"
  },
  promoContainer: {
    flexDirection: "row",
    gap: 8
  },
  promoInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14
  },
  promoButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center"
  },
  promoButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14
  },
  promoSuccess: {
    color: "#22C55E",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8
  },
  paymentCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center"
  },
  paymentIcon: {
    marginLeft: 12,
    marginRight: 8
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827"
  },
  codNote: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 32
  },
  priceCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280"
  },
  priceValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500"
  },
  freeText: {
    color: "#22C55E",
    fontWeight: "600"
  },
  discountText: {
    color: "#22C55E",
    fontWeight: "600"
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827"
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F59E0B"
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB"
  },
  placeOrderButton: {
    backgroundColor: "#F59E0B",
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16
  }
});
