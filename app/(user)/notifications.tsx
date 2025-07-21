import { View, Text, FlatList, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useEffect, useRef } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const notifications = [
  {
    id: '1',
    title: 'Order Delivered!',
    desc: 'Your order #BD12345 has been delivered successfully.',
    time: '2 hours ago',
    type: 'success',
    icon: 'checkmark-circle',
    read: false,
  },
  {
    id: '2',
    title: 'New Craft Beer Available',
    desc: 'Check out our latest IPA collection with 20% off!',
    time: '1 day ago',
    type: 'info',
    icon: 'information-circle',
    read: true,
  },
  {
    id: '3',
    title: 'Order Confirmed',
    desc: 'Your order #BD12344 has been confirmed and is being prepared.',
    time: '2 days ago',
    type: 'neutral',
    icon: 'checkbox',
    read: true,
  },
];

export default function NotificationsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return '#22c55e';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success': return '#ecfdf5';
      case 'info': return '#eff6ff';
      default: return '#f9fafb';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF7ED', '#FEF3C7']}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>🔔 Notifications</Text>
        <Text style={styles.subtitle}>Stay updated with your orders and offers</Text>
      </LinearGradient>
      
      <Animated.View style={[styles.listWrapper, { opacity: fadeAnim }]}>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                { backgroundColor: getBackgroundColor(item.type) },
                !item.read && styles.unreadCard
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={24} 
                    color={getIconColor(item.type)} 
                  />
                </View>
                <View style={styles.contentContainer}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.bold, !item.read && styles.unreadTitle]}>
                      {item.title}
                    </Text>
                    {!item.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.desc}>{item.desc}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#B45309',
    fontWeight: '500',
  },
  listWrapper: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unreadCard: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bold: {
    fontWeight: '600',
    fontSize: 16,
    color: '#111827',
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#000000',
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 4,
    marginLeft: 8,
  },
  desc: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
});
