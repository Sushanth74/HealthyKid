import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';   
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router'; // Ensure expo-router is set up correctly

export default function App() {
  const router = useRouter();
  

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        padding: 20,
      }}
    >
      {/* App Logo or Image */}
      <Image
        source={require('../assets/images/healthykid.jpeg')}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />

      {/* Welcome Text */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 }}>
        Welcome to HealthyKid!
      </Text>

      {/* Informative Text */}
      <Text style={{ fontSize: 16, textAlign: 'center', color: 'white', marginBottom: 20 }}>
        Track your child’s health, nutrition, and activity levels easily with our app. Stay informed and make healthier decisions every day!
      </Text>

      <StatusBar style="auto" />

      {/* Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#4CAF50',
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 8,
          marginTop: 20,
        }}
        onPress={() => router.push('auth/sign-in')}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Continue with Email
        </Text>
      </TouchableOpacity>
    </View>
  );
}
