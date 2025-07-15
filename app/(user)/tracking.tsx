import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function TrackingScreen() {
  const router = useRouter();

  const handleSupport = () => {
    Toast.show({
      type: "info",
      text1: "Support" + "You can call us at 1800-BEER-BUDDY"
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Order #18293</Text>
      <Text style={styles.status}>🟢 Out for Delivery</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Estimated Time:</Text>
        <Text style={styles.value}>20 minutes</Text>

        <Text style={styles.label}>Delivery Partner:</Text>
        <Text style={styles.value}>Sanjay (📱 +91 99999 88888)</Text>

        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>Near your area, Lucknow</Text>
      </View>

      <TouchableOpacity style={styles.supportBtn} onPress={handleSupport}>
        <Text style={styles.supportText}>Need Help?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.doneBtn}
        onPress={() => router.replace("/(user)/orders")}
      >
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12
  },
  status: {
    fontSize: 16,
    color: "green",
    fontWeight: "600",
    marginBottom: 24
  },
  infoBox: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 10,
    marginBottom: 30
  },
  label: {
    color: "#555",
    fontSize: 14,
    marginTop: 12
  },
  value: {
    fontSize: 16,
    fontWeight: "500"
  },
  supportBtn: {
    backgroundColor: "#ffb703",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 14
  },
  supportText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15
  },
  doneBtn: {
    backgroundColor: "#4136dc",
    padding: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  doneText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  }
});
