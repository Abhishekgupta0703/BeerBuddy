import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "../store/useUserStore";

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const otpSlideAnim = useRef(new Animated.Value(0)).current;

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

  const handleSendOTP = () => {
    if (phone.length !== 10) {
      Toast.show({ type: "error", text1: "Enter a valid 10-digit number" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Toast.show({ type: "success", text1: "OTP sent to your number" });
      setOtpSent(true);
      
      // Animate OTP input appearance
      Animated.spring(otpSlideAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (otp === "1234") {
      setLoading(true);
      
      try {
        // Set authentication token
        await AsyncStorage.setItem("token", "dummy_token");
        
        // Set user data based on phone number
        const isExistingUser = phone === "9999999999";
        const userData = isExistingUser 
          ? {
              name: "John Doe",
              email: "john.doe@example.com",
              phone: phone,
              avatar: ""
            }
          : {
              name: "New User",
              email: "newuser@example.com",
              phone: phone,
              avatar: ""
            };
        
        // Save user data to AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        
        // Update user store with authentication
        const { setUser, setAuthenticated } = useUserStore.getState();
        setUser(userData);
        setAuthenticated(true);
        
        Toast.show({ type: "success", text1: "Logged in successfully" });
        
        setTimeout(() => {
          if (isExistingUser) {
            router.replace("/location-permission");
          } else {
            router.replace("/age-verification");
          }
        }, 1000);
      } catch (error) {
        console.error('Login error:', error);
        Toast.show({ type: "error", text1: "Login failed", text2: "Please try again" });
      } finally {
        setLoading(false);
      }
    } else {
      Toast.show({ type: "error", text1: "Invalid OTP" });
    }
  };

  return (
    <LinearGradient
      colors={['#FFF7ED', '#FEF3C7', '#FBBF24']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🔐</Text>
            <Text style={styles.title}>Welcome to BrewDash</Text>
            <Text style={styles.subtitle}>Enter your phone number to continue</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="phone-portrait" size={20} color="#78350F" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
              placeholderTextColor="#B45309"
            />
          </View>

          {otpSent && (
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  opacity: otpSlideAnim,
                  transform: [{ translateY: Animated.multiply(otpSlideAnim, -10) }],
                },
              ]}
            >
              <Ionicons name="key" size={20} color="#78350F" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
                maxLength={4}
                placeholderTextColor="#B45309"
              />
            </Animated.View>
          )}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={!otpSent ? handleSendOTP : handleVerifyOTP}
            disabled={loading}
          >
            {loading ? (
              <Animated.View style={styles.loadingContainer}>
                <Text style={styles.buttonText}>Processing...</Text>
              </Animated.View>
            ) : (
              <Text style={styles.buttonText}>
                {!otpSent ? "Send OTP" : "Verify & Login"}
              </Text>
            )}
          </TouchableOpacity>

          {otpSent && (
            <TouchableOpacity 
              style={styles.resendButton} 
              onPress={() => {
                setOtpSent(false);
                setOtp("");
                Animated.spring(otpSlideAnim, {
                  toValue: 0,
                  tension: 50,
                  friction: 8,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>By continuing, you agree to our</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.1)',
    elevation: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#78350F',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B45309',
    textAlign: 'center',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#FED7AA',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#78350F',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    boxShadow: '0 4px 8px rgba(245, 158, 11, 0.3)',
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#FED7AA',
    boxShadow: '0 4px 8px rgba(245, 158, 11, 0.1)',
    elevation: 1,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },
  resendText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#B45309',
    fontSize: 14,
    marginBottom: 4,
  },
  linkText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
});
