import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/useUserStore";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useUserStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (phone && !/^[\d\s\-\+\(\)]+$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
