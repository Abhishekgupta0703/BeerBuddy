import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
export const unstable_settings = {
  initialRouteName: "index"
};
export default function UserLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "#f59e0b",
        tabBarStyle: { height: 60, paddingBottom: 6 },
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={22} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: "Alerts",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          href: null // 👈 prevents this from being registered as a tab
        }}
      />
      <Tabs.Screen
        name="checkout"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="product/[id]"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="profile/edit"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="profile/addresses"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}
