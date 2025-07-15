import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password) {
      Toast.show({
        type: "error",
        text1: "All fields are required!"
      });
      return;
    }

    // Simulated signup
    Toast.show({ type: "success", text1: "Account created successfully!" });
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 🍻</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f2f2f2"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center"
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  button: {
    backgroundColor: "#4136dc",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  link: {
    color: "#4136dc",
    textAlign: "center",
    marginTop: 8
  }
});
