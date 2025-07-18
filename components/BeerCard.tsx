import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Beer } from '../data/beers';

interface BeerCardProps {
  beer: Beer;
  onAdd: () => void;
  onPress?: () => void;
}

export default function BeerCard({ beer, onAdd, onPress }: BeerCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const addButtonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleAddPress = () => {
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onAdd();
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={12} color="#F59E0B" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={12} color="#F59E0B" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#D1D5DB" />);
    }
    
    return stars;
  };

  return (
    <Animated.View 
      style={[
        styles.card,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.cardContent}
      >
        {/* Discount Badge */}
        {beer.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{beer.discount}% OFF</Text>
          </View>
        )}

        {/* Stock Status */}
        {!beer.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}

        {/* Product Tags */}
        <View style={styles.tagsContainer}>
          {beer.popular && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>Bestseller</Text>
            </View>
          )}
          {beer.tags?.includes('new') && (
            <View style={[styles.tag, styles.newTag]}>
              <Text style={styles.tagText}>New</Text>
            </View>
          )}
          {beer.tags?.includes('craft') && (
            <View style={[styles.tag, styles.craftTag]}>
              <Text style={styles.tagText}>Craft</Text>
            </View>
          )}
        </View>

        {/* Beer Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: beer.image }}
            style={styles.beerImage}
            resizeMode="cover"
          />
        </View>

        {/* Beer Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.brandText}>{beer.brand}</Text>
          <Text style={styles.beerName} numberOfLines={1}>{beer.name}</Text>
          <Text style={styles.volumeText}>{beer.volume} • {beer.alcohol}</Text>
          
          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderStars(beer.rating)}
            </View>
            <Text style={styles.ratingText}>({beer.reviews})</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{beer.price}</Text>
              {beer.originalPrice && (
                <Text style={styles.originalPrice}>₹{beer.originalPrice}</Text>
              )}
            </View>
            
            <Animated.View style={{ transform: [{ scale: addButtonScale }] }}>
              <TouchableOpacity 
                style={[
                  styles.addBtn,
                  !beer.inStock && styles.addBtnDisabled
                ]} 
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddPress();
                }}
                disabled={!beer.inStock}
              >
                <Ionicons 
                  name="add" 
                  size={18} 
                  color={beer.inStock ? "#FFFFFF" : "#9CA3AF"} 
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    margin: 4,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardContent: {
    padding: 12,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#6B7280',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  beerImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  brandText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  beerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  volumeText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 10,
    color: '#6B7280',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  addBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)',
    elevation: 2,
  },
  addBtnDisabled: {
    backgroundColor: '#E5E7EB',
    boxShadow: 'none',
    elevation: 0,
  },
  tagsContainer: {
    position: 'absolute',
    top: 40,
    left: 8,
    right: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    zIndex: 5,
  },
  tag: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  newTag: {
    backgroundColor: '#10B981',
  },
  craftTag: {
    backgroundColor: '#8B5CF6',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
});
