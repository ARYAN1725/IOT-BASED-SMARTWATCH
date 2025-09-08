import { StyleSheet, Text, View, SafeAreaView, Pressable, TouchableOpacity, TextInput, Button, } from 'react-native'
import React, {useState} from 'react'
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {auth, db} from '../config/firebase';
import { Alert } from 'react-native';

const SignUp = ({ navigation }) => {
    const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
  
    try {
      // Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store additional info in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          username,
          email,
          createdAt: new Date()
        });
      } catch (firestoreError) {
        console.log('Firestore write failed:', firestoreError);
        Alert.alert('Warning', 'Account created, but failed to save user data.');
      }
  
      // Navigate after success
      Alert.alert('Success', 'Account created successfully!');
      console.log("✅ Navigating to Dashboard");
      navigation.replace('MainTabs');

  
    } catch (authError) {
      console.log('Signup/auth error:', authError);
      Alert.alert('Signup Error', authError.message);
    }
  };
  

return (
    <SafeAreaView style={styles.container}>
        <View>
            <Text style={styles.loginHeading}>Sign Up</Text>
        </View>

        <View>       {/* Form will go here */}
            <TextInput
                style={styles.textInput}
                placeholder='Enter your email'
                value = {email}
                onChangeText={setEmail}
                keyboardType='email-address'
                autoCapitalize='none'
            />

            <TextInput
                style={styles.textInput}
                placeholder='Pick a username'
                value = {username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.textInput}
                placeholder='Enter your password'
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.textInput}
                placeholder='Confirm your password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
            />
        </View>

        <View style={styles.belowFormContainer}>             {/* Forgot Password will go here */}
            <TouchableOpacity>
                <Text style={styles.link}>Forgot Password?</Text>
            </TouchableOpacity>

            {/*  Make SignUp clickable and navigate */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Already Existing User? Login</Text>
            </TouchableOpacity>
        </View>

        <View>
        <Button title="SUBMIT" onPress={handleSignUp} />
        </View>
    </SafeAreaView>
)
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        marginTop: 35,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f6f6',
    },
    loginHeading: {
        fontSize: 18,
        fontWeight: 'bold',
    },
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
    button: {
        backgroundColor: 'skyblue',
        padding: 12,
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    belowFormContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 350,
        padding: 10,
    },
    link: {
        color: 'blue',
        fontWeight: 'bold',
    }
})