import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
  RefreshControl,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState, useRef, useMemo } from "react";
import { useCartStore } from "../../store/useCartStore";
import BeerCard from "@/components/BeerCard";
import FilterTag from "@/components/FilterTag";
import BannerCarousel from "@/components/BannerCarousel";
import { beers, categories, Beer } from "../../data/beers";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [selected, setSelected] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const categoryFlatListRef = useRef<FlatList>(null);
  const filterAnimation = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;

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


  const handleBannerPress = (bannerId: string) => {
    Toast.show({
      type: 'info',
      text1: 'Banner Pressed',
      text2: `Banner ${bannerId} tapped`,
    });
  };

  const filteredBeers = useMemo(() => {
    let filtered = beers.filter((beer) => {
      const matchesCategory = selected === 'all' || beer.type === selected;
      const matchesSearch = beer.name.toLowerCase().includes(search.toLowerCase()) ||
                           beer.brand.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [selected, search, sortBy, sortOrder]);

  const popularBeers = useMemo(() => beers.filter(beer => beer.popular), []);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Animated.timing(filterAnimation, {
      toValue: showFilters ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSortChange = (newSortBy: 'name' | 'price' | 'rating') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const HeaderComponent = () => (
    <View>
      {/* Fixed Header with Gradient */}
      <LinearGradient
        colors={['#FFF7ED', '#FEF3C7']}
        style={styles.headerSection}
      >
        <View style={styles.headerRow}>
          <View style={styles.greetingContainer}>
            <Animated.Text style={[styles.greeting, {
              opacity: headerOpacity.interpolate({
                inputRange: [0, 100],
                outputRange: [1, 0.8],
                extrapolate: 'clamp',
              }),
            }]}>Good {getGreeting()}</Animated.Text>
            <Text style={styles.subGreeting}>What would you like to drink?</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationIcon}
            onPress={() => router.push('/(user)/notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color="#B45309" />
          </TouchableOpacity>
        </View>

        {/* Enhanced Search Box */}
        <Animated.View style={[styles.searchContainer, {
          transform: [{
            translateY: searchAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -2],
            })
          }]
        }]}>
          <Ionicons name="search-outline" size={20} color="#B45309" />
          <TextInput
            placeholder="Search beers, brands, or styles..."
            style={styles.searchInput}
            placeholderTextColor="#B45309"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              // Animate search on input
              Animated.sequence([
                Animated.timing(searchAnimation, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: false,
                }),
                Animated.timing(searchAnimation, {
                  toValue: 0,
                  duration: 100,
                  useNativeDriver: false,
                })
              ]).start();
            }}
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch('')}
              style={styles.clearSearch}
            >
              <Ionicons name="close-circle" size={18} color="#B45309" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </LinearGradient>

      {/* Enhanced Banner Carousel */}
      <View style={styles.bannerSection}>
        <BannerCarousel onBannerPress={handleBannerPress} />
      </View>


      {/* Categories with Sticky Scroll */}
      <View style={styles.sectionContainer}>
        
        <FlatList
          ref={categoryFlatListRef}
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
              onPress={() => {
                setSelected(item.id);
                // Smooth scroll to selected category
                const selectedIndex = categories.findIndex(cat => cat.id === item.id);
                if (selectedIndex !== -1 && categoryFlatListRef.current) {
                  categoryFlatListRef.current.scrollToIndex({
                    index: selectedIndex,
                    animated: true,
                    viewPosition: 0.5,
                  });
                }
              }}
            />
          )}
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
        />
      </View>

      {/* Sort and Filter Controls */}
      <Animated.View style={[styles.filterControls, {
        height: filterAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 60],
        }),
        opacity: filterAnimation,
      }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sortContainer}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
              onPress={() => handleSortChange('name')}
            >
              <Text style={[styles.sortText, sortBy === 'name' && styles.sortTextActive]}>
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
              onPress={() => handleSortChange('price')}
            >
              <Text style={[styles.sortText, sortBy === 'price' && styles.sortTextActive]}>
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
              onPress={() => handleSortChange('rating')}
            >
              <Text style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>
                Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>


      {/* Results Header */}
<View style={styles.resultsHeader}>
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            {filteredBeers.length} {filteredBeers.length === 1 ? 'beer' : 'beers'} found
          </Text>
          <TouchableOpacity
            onPress={toggleFilters}
            style={[styles.filterButton, { marginLeft: 8 }]}
          >
            <Ionicons 
              name={showFilters ? "funnel" : "funnel-outline"} 
              size={18} 
              color={showFilters ? "#F59E0B" : "#6B7280"} 
            />
            <Text style={[styles.filterText, { color: showFilters ? "#F59E0B" : "#6B7280" }]}
            >
              Filter
            </Text>
          </TouchableOpacity>
        </View>        
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch('')}
            style={styles.clearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear search</Text>
          </TouchableOpacity>
        )}
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
            <BeerCard
              beer={item}
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
    paddingHorizontal: 1,
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
  
  // Enhanced header styles
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationIcon: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  clearSearch: {
    padding: 4,
    marginLeft: 8,
  },
  
  // Section layout styles
  bannerSection: {
    marginBottom: 8,
  },
  quickActionsSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  
  // Filter controls
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterControls: {
    overflow: 'hidden',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  sortTextActive: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  
  // Enhanced card containers
  featuredCardContainer: {
    width: 180,
    marginRight: 12,
  },
  
  // Results section
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingTop: 8,
  },
  resultsInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  clearFilters: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
});
