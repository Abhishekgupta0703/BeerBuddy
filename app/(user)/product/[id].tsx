import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { beers } from "../../../data/beers";
import BeerCard from "../../../components/BeerCard";

const { width, height } = Dimensions.get('window');

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'ingredients'>('description');
  
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { id, name, brand, price, type, image, description, alcohol, volume, rating, reviews } = useLocalSearchParams();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const beer = {
    id: id as string,
    name: name as string,
    brand: brand as string,
    price: Number(price),
    type: type as string,
    image: (Array.isArray(image) ? image[0] : image) || "https://via.placeholder.com/180",
    description: (description as string) || "No description available",
    alcohol: alcohol as string,
    volume: volume as string,
    rating: Number(rating) || 4.0,
    reviews: Number(reviews) || 0,
  };

  const ingredients = [
    'Water', 'Malted Barley', 'Hops', 'Yeast', 'Rice'
  ];

  const mockReviews = [
    { id: 1, name: 'John D.', rating: 5, comment: 'Excellent beer! Great taste and quality.', date: '2024-01-15' },
    { id: 2, name: 'Sarah M.', rating: 4, comment: 'Good beer, but a bit pricey.', date: '2024-01-10' },
    { id: 3, name: 'Mike R.', rating: 5, comment: 'Best beer I\'ve had in a while!', date: '2024-01-05' },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing beer: ${beer.name} - Only ₹${beer.price}!`,
        title: beer.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...beer, quantity });
    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: `${beer.name} (${quantity}x) added successfully`,
      visibilityTime: 2000,
    });
  };

  const getSimilarProducts = () => {
    return beers
      .filter(item => item.id !== beer.id && (item.type === beer.type || item.brand === beer.brand))
      .slice(0, 4);
  };

  const similarProducts = getSimilarProducts();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#F59E0B" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#F59E0B" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#D1D5DB" />);
    }
    
    return stars;
  };

  if (!beer) return <Text>Beer not found.</Text>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF7ED" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#78350F" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setIsFavorite(!isFavorite)}
              style={styles.actionButton}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#EF4444" : "#78350F"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleShare}
              style={styles.actionButton}
            >
              <Ionicons name="share-outline" size={24} color="#78350F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Image */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#FFF7ED', '#FEF3C7']}
            style={styles.imageGradient}
          >
            <Image source={{ uri: beer.image }} style={styles.image} />
          </LinearGradient>
        </Animated.View>

        {/* Product Info */}
        <Animated.View
          style={[
            styles.infoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.brandContainer}>
            <Text style={styles.brand}>{beer.brand}</Text>
            <Text style={styles.type}>{beer.type}</Text>
          </View>
          
          <Text style={styles.name}>{beer.name}</Text>
          
          <View style={styles.specs}>
            <View style={styles.specItem}>
              <Ionicons name="wine-outline" size={16} color="#B45309" />
              <Text style={styles.specText}>{beer.alcohol}</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="resize-outline" size={16} color="#B45309" />
              <Text style={styles.specText}>{beer.volume}</Text>
            </View>
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(beer.rating)}
            </View>
            <Text style={styles.ratingText}>{beer.rating}</Text>
            <Text style={styles.reviewsText}>({beer.reviews} reviews)</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{beer.price}</Text>
            <Text style={styles.pricePerUnit}>per bottle</Text>
          </View>
        </Animated.View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['description', 'reviews', 'ingredients'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'description' && (
            <Text style={styles.description}>{beer.description}</Text>
          )}
          
          {activeTab === 'ingredients' && (
            <View style={styles.ingredientsContainer}>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          )}
          
          {activeTab === 'reviews' && (
            <View style={styles.reviewsContainer}>
              {mockReviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <View style={styles.reviewStars}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <View style={styles.similarProductsSection}>
            <Text style={styles.sectionTitle}>Similar Products</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarProductsContainer}
            >
              {similarProducts.map((item) => (
                <View key={item.id} style={styles.similarProductCard}>
                  <BeerCard
                    beer={item}
                    onPress={() => {
                      router.push({
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
                      });
                    }}
                    onAdd={() => {
                      addToCart({ ...item, quantity: 1 });
                      Toast.show({
                        type: 'success',
                        text1: 'Added to Cart!',
                        text2: `${item.name} added successfully`,
                        visibilityTime: 2000,
                      });
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        
        {/* Bottom spacing to prevent content from being hidden */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={styles.quantityBtn}
            >
              <Ionicons name="remove" size={20} color="#F59E0B" />
            </TouchableOpacity>
            <Text style={styles.quantityNumber}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => q + 1)}
              style={styles.quantityBtn}
            >
              <Ionicons name="add" size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart" size={20} color="#FFFFFF" />
            <Text style={styles.cartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => {
              handleAddToCart();
              router.push("/(user)/cart");
            }}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF7ED',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  imageContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  imageGradient: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  image: {
    width: 200,
    height: 250,
    resizeMode: 'contain',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 6,
  },
  brandContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  type: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 16,
  },
  specs: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  specText: {
    fontSize: 14,
    color: '#B45309',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#78350F',
  },
  reviewsText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  pricePerUnit: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  
  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#F59E0B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Tab Content
  tabContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  
  // Ingredients
  ingredientsContainer: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: '#374151',
  },
  
  // Reviews
  reviewsContainer: {
    gap: 16,
  },
  reviewItem: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#78350F',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  
  // Similar Products
  similarProductsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  similarProductsContainer: {
    paddingRight: 16,
    gap: 12,
  },
  similarProductCard: {
    width: 160,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  
  // Bottom spacer to prevent content overlap
  bottomSpacer: {
    height: 140,
  },
  
  // Bottom Container
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#78350F',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 2,
  },
  quantityBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 4,
    minWidth: 28,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  quantityNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#78350F',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)',
    elevation: 3,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  buyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#78350F',
    paddingVertical: 10,
    borderRadius: 10,
    boxShadow: '0 2px 6px rgba(120, 53, 15, 0.25)',
    elevation: 3,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
