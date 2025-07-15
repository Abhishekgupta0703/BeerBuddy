import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCartStore } from "@/store/useCartStore";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const { user, clearUser } = useUserStore();
  const { clearCart } = useCartStore();
  const router = useRouter();

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
              // Clear user data
              clearUser();
              // Clear cart data
              clearCart();
              // Remove token from storage
              await AsyncStorage.removeItem("token");
              
              Toast.show({
                type: "success",
                text1: "Logged out successfully",
                text2: "See you next time!"
              });
              
              // Navigate back to welcome screen
              router.replace("/welcome");
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

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle-outline" size={64} color="#9ca3af" />
        )}
        <Text style={styles.name}>{user.name || "Guest User"}</Text>
        <Text style={styles.email}>{user.email || "no-email@example.com"}</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/(user)/profile/edit")}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
       
        {[
          {
            label: "Manage Addresses",
            icon: "location-outline" as const,
            route: "/(user)/profile/addresses" as const
          },
          { label: "Payment Methods", icon: "card-outline" as const, route: null },
          {
            label: "Notifications",
            icon: "notifications-outline" as const,
            route: null
          },
          { label: "Help & Support", icon: "help-circle-outline" as const, route: "/(user)/profile/help" as const }
        ].map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.menuItem}
            onPress={() => {
              if (item.route) {
                router.push(item.route);
              }
            }}
          >
            <Ionicons name={item.icon} size={20} color="#6b7280" />
            <Text style={styles.menuText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 45
  },
  profileCard: {
    backgroundColor: "#f9fafb",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 10
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16
  },
  editText: {
    fontWeight: "500",
    fontSize: 14
  },
  menu: {
    gap: 12
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 10,
    gap: 12,
    justifyContent: "space-between"
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827"
  },
  logoutButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#ef4444",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 16
  }
});
