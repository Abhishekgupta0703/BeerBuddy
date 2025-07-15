import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const faqs = [
{
question: "How do I place an order?",
answer: "Browse beers, add to cart, and proceed to checkout from the cart screen.",
},
{
question: "Where can I track my order?",
answer: "Go to 'Orders' tab from the bottom navigation to see your order history.",
},
{
question: "How do I update my address?",
answer: "Go to Profile > Manage Addresses to add or update your delivery address.",
},
];

export default function HelpScreen() {
const router = useRouter();

const handleSupportEmail = () => {
Linking.openURL("mailto:support@brewdash.com?subject=Support Request");
};

return (
<ScrollView contentContainerStyle={styles.container}>
<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
<Ionicons name="arrow-back-outline" size={24} color="#111" />
</TouchableOpacity>

  <Text style={styles.title}>Help & Support</Text>

  {faqs.map((faq, index) => (
    <View key={index} style={styles.faqBox}>
      <Text style={styles.question}>{faq.question}</Text>
      <Text style={styles.answer}>{faq.answer}</Text>
    </View>
  ))}

  <TouchableOpacity style={styles.contactBtn} onPress={handleSupportEmail}>
    <Text style={styles.contactText}>Contact Support</Text>
  </TouchableOpacity>
</ScrollView>
);
}

const styles = StyleSheet.create({
container: {
padding: 24,
paddingTop: 60,
backgroundColor: "#fff",
},
backButton: {
marginBottom: 16,
},
title: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 24,
color: "#111",
},
faqBox: {
marginBottom: 20,
},
question: {
fontSize: 16,
fontWeight: "600",
marginBottom: 4,
color: "#1f2937",
},
answer: {
fontSize: 14,
color: "#4b5563",
},
contactBtn: {
backgroundColor: "#f59e0b",
marginTop: 40,
padding: 14,
borderRadius: 8,
alignItems: "center",
},
contactText: {
color: "#fff",
fontSize: 16,
fontWeight: "600",
},
});

