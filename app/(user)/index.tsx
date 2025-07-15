import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  RefreshControl,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useCartStore } from "../../store/useCartStore";
import BeerCard from "@/components/BeerCard";
import FilterTag from "@/components/FilterTag";
import BannerCarousel from "@/components/BannerCarousel";
import QuickActions from "@/components/QuickActions";
import { beers, categories, Beer } from "../../data/beers";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [selected, setSelected] = useState("all");
  const [search, setSearch] = useState("");
  const router = useRouter();
  const navigation = useNavigation();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      Toast.show({
        type: 'success',
        text1: 'Refreshed!',
        text2: 'Latest beers loaded',
        visibilityTime: 2000,
      });
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'bestsellers':
        setSelected('all');
        setSearch('');
        break;
      case 'deals':
        setSelected('all');
        setSearch('');
        break;
      case 'new':
        setSelected('all');
        setSearch('');
        break;
      case 'craft':
        setSelected('ipa');
        setSearch('');
        break;
      default:
        break;
    }
  };

  const handleBannerPress = (bannerId: string) => {
    Toast.show({
      type: 'info',
      text1: 'Banner Pressed',
      text2: `Banner ${bannerId} tapped`,
    });
  };

  const filteredBeers = beers.filter((beer) => {
    const matchesCategory = selected === 'all' || beer.type === selected;
    const matchesSearch = beer.name.toLowerCase().includes(search.toLowerCase()) ||
                         beer.brand.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBeers = beers.filter(beer => beer.featured);
  const popularBeers = beers.filter(beer => beer.popular);

  const HeaderComponent = () => (
    <View>
      {/* Header Section */}
      <LinearGradient
        colors={['#FFF7ED', '#FEF3C7']}
        style={styles.headerSection}
      >
        <View style={styles.headerRow}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Good {getGreeting()}</Text>
            <Text style={styles.subGreeting}>What would you like to drink?</Text>
          </View>
          <TouchableOpacity
            style={styles.cartIcon}
            onPress={() => router.push("/(user)/cart")}
          >
            <Ionicons name="cart-outline" size={24} color="#78350F" />
            {cartItems.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Box */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#B45309" />
          <TextInput
            placeholder="Search beers, brands..."
            style={styles.searchInput}
            placeholderTextColor="#B45309"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </LinearGradient>

      {/* Banner Carousel */}
      <BannerCarousel onBannerPress={handleBannerPress} />

      {/* Quick Actions */}
      <QuickActions onActionPress={handleQuickAction} />

      {/* Category Filter */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FilterTag
              label={item.name}
              icon={item.icon}
              selected={selected === item.id}
              onPress={() => setSelected(item.id)}
            />
          )}
        />
      </View>

      {/* Featured Section */}
      {featuredBeers.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured</Text>
          <FlatList
            data={featuredBeers}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.horizontalCardContainer}>
                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: "/(user)/product/[id]",
                    params: {
                      id: item.id,
                      name: item.name,
                      brand: item.brand,
                      price: item.price.toString(),
                      type: item.type,
                      image: item.image,
                      description: item.description,
                      alcohol: item.alcohol,
                      volume: item.volume,
                      rating: item.rating.toString(),
                      reviews: item.reviews.toString(),
                    }
                  })}
                >
                  <BeerCard
                    beer={item}
                    onAdd={() => {
                      addToCart({ ...item, quantity: 1 });
                      Toast.show({
                        type: 'success',
                        text1: 'Added to cart!',
                        text2: `${item.name} added successfully`,
                        visibilityTime: 2000,
                      });
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Section Title for All Products */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          {selected === 'all' ? 'All Beers' : `${categories.find(c => c.id === selected)?.name} Beers`}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {filteredBeers.length} {filteredBeers.length === 1 ? 'beer' : 'beers'} found
        </Text>
      </View>
    </View>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#FFF7ED', '#FEF3C7']}
          style={styles.loadingGradient}
        >
          <Animated.View style={styles.loadingContent}>
            <Text style={styles.loadingIcon}>🍺</Text>
            <Text style={styles.loadingText}>Loading fresh beers...</Text>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF7ED" />
      <FlatList
        data={filteredBeers}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gridItemContainer}>
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/(user)/product/[id]",
                params: {
                  id: item.id,
                  name: item.name,
                  brand: item.brand,
                  price: item.price.toString(),
                  type: item.type,
                  image: item.image,
                  description: item.description,
                  alcohol: item.alcohol,
                  volume: item.volume,
                  rating: item.rating.toString(),
                  reviews: item.reviews.toString(),
                }
              })}
            >
              <BeerCard
                beer={item}
                onAdd={() => {
                  addToCart({ ...item, quantity: 1 });
                  Toast.show({
                    type: 'success',
                    text1: 'Added to cart!',
                    text2: `${item.name} added successfully`,
                    visibilityTime: 2000,
                  });
                }}
              />
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={HeaderComponent}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F59E0B']}
            tintColor="#F59E0B"
            progressBackgroundColor="#FEF3C7"
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No beers found</Text>
            <Text style={styles.emptySubtitle}>Try a different search or category</Text>
          </View>
        )}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#78350F',
    fontWeight: '600',
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#B45309',
    fontWeight: '500',
  },
  cartIcon: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  horizontalCardContainer: {
    width: 160,
  },
  listContainer: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  gridItemContainer: {
    flex: 1,
    maxWidth: '48%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
