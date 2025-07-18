import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/useUserStore';

export default function AgeVerificationScreen() {
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();
  const { setAgeVerified } = useUserStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!image) {
      Toast.show({ type: 'error', text1: 'Please upload your ID' });
      return;
    }

    // Simulate upload + verification
    setAgeVerified(true);
    Toast.show({ type: 'success', text1: 'Age verification successful' });
    router.replace('/location-permission');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Age Verification</Text>
      <Text style={styles.desc}>Please upload a valid ID to verify you&apos;re 21+</Text>

      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <>
            <Text style={styles.uploadIcon}>⬆️</Text>
            <Text style={styles.uploadText}>Upload your ID</Text>
            <View style={styles.chooseBtn}>
              <Text style={styles.chooseBtnText}>Choose File</Text>
            </View>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          Your ID will be securely processed and deleted after verification.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit for Verification</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 24,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    marginBottom: 20,
  },
  uploadIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  uploadText: {
    color: '#6b7280',
    marginBottom: 10,
  },
  chooseBtn: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  chooseBtnText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  noteBox: {
    backgroundColor: '#fff7ed',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  noteText: {
    color: '#78350f',
    fontSize: 13,
  },
  button: {
    backgroundColor: '#f59e0b',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

