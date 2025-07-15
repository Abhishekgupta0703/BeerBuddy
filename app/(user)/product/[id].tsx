import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ProductDetail() {
  // const { id } = useLocalSearchParams();

  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { id, name, price, type, image, description } = useLocalSearchParams();

  const beer = {
    id: id as string,
    name: name as string,
    price: Number(price),
    type: type as string,
    image: (Array.isArray(image) ? image[0] : image) || "https://via.placeholder.com/180",
    description: (description as string) || "No description available"
  };
  if (!beer) return <Text>Beer not found.</Text>;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 20 }}
      >
        <Ionicons name="arrow-back-outline" size={24} />
      </TouchableOpacity>
      <View style={styles.imageBox}>
        <Image source={{ uri: beer.image }} style={styles.image} />
      </View>
      <Text style={styles.name}>{beer.name}</Text>
      <Text style={styles.type}>{beer.type}</Text>
      <Text style={styles.price}>₹{beer.price}</Text>
      <Text style={styles.description}>{beer.description}</Text>

      <View style={styles.qtyRow}>
        <TouchableOpacity
          onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          style={styles.qtyBtn}
        >
          <Text style={styles.qtyText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyNumber}>{quantity}</Text>
        <TouchableOpacity
          onPress={() => setQuantity((q) => q + 1)}
          style={styles.qtyBtn}
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          addToCart({ ...beer, quantity });
          router.push("/(user)/cart");
        }}
      >
        <Text style={styles.addBtnText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
    flex: 1
  },
  imageBox: {
    height: 220,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    height: 180,
    width: 140,
    resizeMode: "contain"
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111"
  },
  type: {
    fontSize: 16,
    color: "#999",
    marginBottom: 8
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#b45309",
    marginBottom: 12
  },
  description: {
    fontSize: 15,
    color: "#333",
    marginBottom: 20
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12
  },
  qtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#f3f4f6"
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  qtyNumber: {
    fontSize: 18,
    fontWeight: "600"
  },
  addBtn: {
    backgroundColor: "#f59e0b",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
