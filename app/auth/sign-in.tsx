import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

    const handleLogin = async () => {
      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }
  
      try {
        const response = await fetch('http://192.168.0.102:5002/routes/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email, password}),
        });
        console.log('response: ',response)
  
        const data = await response.json();
        // console.log('DATA: ',data.user['id'])
        if (response.ok) {
          await AsyncStorage.setItem('UserID', data.user['id']?.toString());
          await AsyncStorage.setItem('username', data.user['username']?.toString());

          await AsyncStorage.setItem('age', data.user['age']?.toString() ? data.user['age']?.toString() : "");
          await AsyncStorage.setItem('gender', data.user['gender']?.toString() ? data.user['gender']?.toString() : "");
          alert('Login successful');
          Alert.alert('Success', 'Login successful');
          router.push('tabs/home'); // Navigate to home page
        } else {
          alert( data.error || 'Failed to Login');
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred');
        console.error(error);
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin} // Navigate on button press
        // onPress={() => {router.push('tabs/home')}}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => router.push('auth/forgotpass')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('auth/sign-up')}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  link: {
    color: '#007BFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
