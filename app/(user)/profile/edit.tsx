import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/useUserStore";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useUserStore();

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [avatar, setAvatar] = useState(user.avatar || "");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6
    });
    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    updateUser({ name, email, avatar });
    Alert.alert("Saved!", "Your profile was updated.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 20 }}
      >
        <Ionicons name="arrow-back-outline" size={24} />
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage} style={styles.avatarBox}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
        )}
        <Text style={styles.avatarText}>Tap to change</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#999"
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
    flex: 1
  },
  avatarBox: {
    alignItems: "center",
    marginBottom: 30
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  avatarText: {
    marginTop: 8,
    color: "#666",
    fontSize: 14
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 20
  },
  saveBtn: {
    backgroundColor: "#f59e0b",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
