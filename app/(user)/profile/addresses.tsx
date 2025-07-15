import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

type Address = {
  id: string;
  label: string;
  location: string;
};

export default function ManageAddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const handlePickLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location access is needed to pick address."
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const coords = location.coords;

    const geocoded = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude
    });

    if (geocoded.length > 0) {
      const place = geocoded[0];
      const formatted = `${place.name || ""}, ${place.street || ""}, ${
        place.city || ""
      }, ${place.region || ""}`;
      setAddresses((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          label: "Current Location",
          location: formatted
        }
      ]);
    } else {
      Alert.alert("Error", "Could not determine address.");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () =>
          setAddresses((prev) => prev.filter((addr) => addr.id !== id)),
        style: "destructive"
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Manage Addresses</Text>

      <TouchableOpacity onPress={handlePickLocation} style={styles.pickButton}>
        <Ionicons name="location-outline" size={20} color="#6b7280" />
        <Text style={styles.pickText}>Pick My Location</Text>
      </TouchableOpacity>

      {addresses.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 40, color: "#666" }}>
          No addresses yet. Pick one to add!
        </Text>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Ionicons name="location-outline" size={24} color="#f59e0b" />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.location}>{item.location}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
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
    padding: 20,
    paddingTop: 60
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },
  pickButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20
  },
  pickText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500"
  },
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 14
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4
  },
  location: {
    color: "#6b7280",
    fontSize: 14
  }
});
