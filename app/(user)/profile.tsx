import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCartStore } from "@/store/useCartStore";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, clearUser, logout } = useUserStore();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
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

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      Toast.show({
        type: 'success',
        text1: 'Profile refreshed!',
        visibilityTime: 2000,
      });
    }, 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Use the logout function from store
              await logout();
              // Clear cart data
              clearCart();
              
              Toast.show({
                type: "success",
                text1: "Logged out successfully",
                text2: "See you next time!"
              });
              
              // Navigate back to main flow
              router.replace("/");
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to logout. Please try again."
              });
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      label: "My Orders",
      icon: "receipt-outline" as const,
      route: "/(user)/orders" as const,
      color: "#F59E0B",
      bgColor: "#FEF3C7"
    },
    {
      label: "Manage Addresses",
      icon: "location-outline" as const,
      route: "/(user)/profile/addresses" as const,
      color: "#10B981",
      bgColor: "#D1FAE5"
    },
    {
      label: "Payment Methods",
      icon: "card-outline" as const,
      route: null,
      color: "#3B82F6",
      bgColor: "#DBEAFE"
    },
    {
      label: "Notifications",
      icon: "notifications-outline" as const,
      route: "/(user)/notifications" as const,
      color: "#8B5CF6",
      bgColor: "#EDE9FE"
    },
    {
      label: "Help & Support",
      icon: "help-circle-outline" as const,
      route: "/(user)/profile/help" as const,
      color: "#EF4444",
      bgColor: "#FEE2E2"
    },
    {
      label: "Settings",
      icon: "settings-outline" as const,
      route: null,
      color: "#6B7280",
      bgColor: "#F3F4F6"
    }
  ];

  const statsData = [
    { label: "Orders", value: "24", icon: "receipt-outline" },
    { label: "Favorites", value: "12", icon: "heart-outline" },
    { label: "Reviews", value: "8", icon: "star-outline" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF7ED" />
      
      <ScrollView
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
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#FFF7ED', '#FEF3C7']}
          style={styles.headerSection}
        >
          <Animated.View
            style={[
              styles.profileCard,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ],
              },
            ]}
          >
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={48} color="#78350F" />
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.name}>{user.name || "Guest User"}</Text>
            <Text style={styles.email}>{user.email || "no-email@example.com"}</Text>
            <Text style={styles.phone}>{user.phone || "+91 XXXXXXXXXX"}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/(user)/profile/edit")}
            >
              <Ionicons name="pencil" size={16} color="#F59E0B" />
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsContainer}>
            {statsData.map((stat, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.statCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 30],
                          outputRange: [0, 30 + (index * 10)],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.statIconContainer}>
                  <Ionicons name={stat.icon} size={20} color="#F59E0B" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menu}>
            {menuItems.map((item, idx) => (
              <Animated.View
                key={idx}
                style={[
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 30],
                          outputRange: [0, 30 + (idx * 5)],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    if (item.route) {
                      router.push(item.route);
                    } else {
                      Toast.show({
                        type: 'info',
                        text1: 'Coming Soon',
                        text2: `${item.label} feature will be available soon!`,
                      });
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: item.bgColor }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuText}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.appInfoSection}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <View style={styles.appInfoContainer}>
            <Text style={styles.appVersion}>BrewDash v1.0.0</Text>
            <Text style={styles.appDescription}>Premium beer delivery at your doorstep</Text>
            <View style={styles.appLinks}>
              <TouchableOpacity style={styles.appLink}>
                <Text style={styles.appLinkText}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.appLink}>
                <Text style={styles.appLinkText}>Terms of Service</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.appLink}>
                <Text style={styles.appLinkText}>Rate Us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <Animated.View
          style={[
            styles.logoutSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#FEF3C7',
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FED7AA',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#B45309',
    marginBottom: 4,
    textAlign: 'center',
  },
  phone: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
    textAlign: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 8,
  },
  editText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#F59E0B',
  },
  
  // Stats Section
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statIconContainer: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#B45309',
    textAlign: 'center',
  },
  
  // Menu Section
  menuSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  menu: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  
  // App Info Section
  appInfoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  appInfoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  appVersion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#B45309',
    textAlign: 'center',
    marginBottom: 20,
  },
  appLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  appLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  appLinkText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
  },
  
  // Logout Section
  logoutSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 16,
  },
});
