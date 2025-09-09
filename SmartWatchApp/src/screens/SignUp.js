import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const SignUp = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

      // Navigate to MainTabs (Dashboard)
      navigation.replace('MainTabs');

    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.loginHeading}>Sign Up</Text>

      <TextInput
        style={styles.textInput}
        placeholder='Enter your email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
      />
      <TextInput
        style={styles.textInput}
        placeholder='Pick a username'
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.textInput}
        placeholder='Enter your password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.textInput}
        placeholder='Confirm your password'
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <View style={styles.belowFormContainer}>
        <TouchableOpacity>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already Existing User? Login</Text>
        </TouchableOpacity>
      </View>

      <Button title="SUBMIT" onPress={handleSignUp} />
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  loginHeading: { fontSize: 18, fontWeight: 'bold' },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    height: 50,
    width: 300,
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
  },
  belowFormContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 350,
    padding: 10,
  },
  link: { color: 'blue', fontWeight: 'bold' },
});
