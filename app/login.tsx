import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = () => {
    if (phone.length !== 10) {
      Toast.show({ type: "error", text1: "Enter a valid 10-digit number" });
      return;
    }

    // Simulate sending OTP
    Toast.show({ type: "success", text1: "OTP sent to your number" });
    setOtpSent(true);
  };

  const handleVerifyOTP = async () => {
    if (otp === "1234") {
      await AsyncStorage.setItem("token", "dummy_token");
      Toast.show({ type: "success", text1: "Logged in successfully" });
      const isExistingUser = phone === "9999999999"; // you can change condition

      if (isExistingUser) {
        await AsyncStorage.setItem("token", "dummy_token");
        router.replace("/(user)");
      } else {
        await AsyncStorage.setItem("token", "dummy_token");
        router.replace("/age-verification");
      }
    } else {
      Toast.show({ type: "error", text1: "Invalid OTP" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login to BrewDash</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={10}
      />

      {otpSent && (
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
          maxLength={4}
        />
      )}

      {!otpSent ? (
        <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
          <Text style={styles.buttonText}>Verify & Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 80,
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#78350f",
    marginBottom: 40,
    textAlign: "center"
  },
  input: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16
  },
  button: {
    backgroundColor: "#f59e0b",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  }
});
