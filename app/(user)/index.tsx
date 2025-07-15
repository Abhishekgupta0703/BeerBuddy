import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import BeerCard from "@/components/BeerCard";
import FilterTag from "@/components/FilterTag";

const categories = ["All", "Lager", "Ale", "Stout", "Wheat"];

const beers = [
  {
    id: "1",
    name: "Golden Lager",
    price: 299,
    image: "", // Placeholder for now
    type: "Lager"
  },
  {
    id: "2",
    name: "Craft IPA",
    price: 399,
    image: "",
    type: "Ale"
  },
  {
    id: "3",
    name: "Dark Stout",
    price: 349,
    image: "",
    type: "Stout"
  },
  {
    id: "4",
    name: "Wheat Beer",
    price: 279,
    image: "",
    type: "Wheat"
  },
  {
    id: "5",
    name: "Golden Lager",
    price: 299,
    image: "", // Placeholder for now
    type: "Lager"
  },
  {
    id: "6",
    name: "Craft IPA",
    price: 399,
    image: "",
    type: "Ale"
  },
  {
    id: "7",
    name: "Dark Stout",
    price: 349,
    image: "",
    type: "Stout"
  },
  {
    id: "8",
    name: "Wheat Beer",
    price: 279,
    image: "",
    type: "Wheat"
  }
];

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, []);
  const addToCart = useCartStore((state) => state.addToCart);

  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, []);

  const filtered = beers.filter((b) => {
    const matchesCategory = selected === "All" || b.type === selected;
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search beers..."
            style={styles.searchInput}
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => router.push("/(user)/cart")}
        >
          <Ionicons name="cart-outline" size={30} color="#000" />
          {cartItems.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginVertical: 15, marginBottom:50, gap: 8 }}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <FilterTag
            label={item}
            selected={selected === item}
            onPress={() => setSelected(item)}
          />
        )}
      />

      {/* Beer Grid */}
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8]}
          numColumns={2}
          keyExtractor={(i) => i.toString()}
          columnWrapperStyle={{ gap: 14 }}
          contentContainerStyle={{ gap: 14 }}
          renderItem={() => (
            <View
              style={[styles.card, { backgroundColor: "#f3f4f6", height: 150 }]}
            />
          )}
        />
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 14,

            paddingBottom: 120,
            paddingTop: 15,
            // marginTop:10,

            flexGrow: 1,
            minHeight: `85%`
          }}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: "center", marginTop: 30, fontSize: 16 }}>
              No beers found 🥲
            </Text>
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width: "48%" }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: "/(user)/product/[id]",
                    params: {
                      id: item.id,
                      name: item.name,
                      price: item.price.toString(),
                      type: item.type,
                      image: item.image || "",
                      description: "This is a premium beer brewed with care 🍺"
                    }
                  })
                }
              >
                <BeerCard
                  beer={item}
                  onAdd={() => addToCart({ ...item, quantity: 1 })}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16 // keep bottom padding
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center"
  },

  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6"
  },
  tagText: {
    color: "#374151",
    fontWeight: "500"
  },
  selectedTag: {
    backgroundColor: "#f59e0b"
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600"
  },
  card: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 12
  },
  imageBox: {
    height: 100,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  beerName: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 6
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  price: {
    fontSize: 15,
    color: "#b45309",
    fontWeight: "bold"
  },
  addBtn: {
    backgroundColor: "#f59e0b",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  addBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },

  searchBox: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 12
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: "#111827"
  },
  cartIcon: {
    backgroundColor: "#f1ede2ff",
    padding: 6,
    borderRadius: 10,
    position: "relative"
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#f59e0b",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2
  }
});
