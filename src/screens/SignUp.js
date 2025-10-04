import { StyleSheet, Text, View, TouchableOpacity, TextInput, Pressable, Alert, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';  // 👈 for eye icons

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Write to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Account created successfully!');

      // Clear input fields
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Navigate to PersonalDetails
      navigation.replace('PersonalDetails');

    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 Background image */}
      <ImageBackground
        source={require('../../assets/login.jpg')}  // 👈 replace with your image path
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Create Account</Text>
          <Text style={styles.subHeading}>Join us today</Text>

          <TextInput
            style={styles.textInput}
            placeholder='Email'
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            selectionColor="#ccc"
          />

          <TextInput
            style={styles.textInput}
            placeholder='Username'
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            selectionColor="#ccc"
          />

          {/* Password field with eye toggle */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              selectionColor="#ccc"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="#aaa"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password field with eye toggle */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              selectionColor="#ccc"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={22}
                color="#aaa"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.linksContainer}>
            {/* <TouchableOpacity>
              <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>

          <Pressable style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { flex: 1 ,backgroundColor: '#696666ff',},
  background: { flex: 1, justifyContent: 'center' },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: 'rgba(0,0,0,0.6)', // dark overlay for readability
  // },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: '#1e1e1e',
    color: 'white',
    height: 50,
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    height: 50,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  linksContainer: {
    alignItems: 'center',
  marginBottom: 30,
  width: '100%',
  },
  link: {
    color: '#f6f7f8ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#8a8c8eff',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});
