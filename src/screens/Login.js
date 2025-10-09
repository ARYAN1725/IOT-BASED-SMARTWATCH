import { StyleSheet, Text, View, TextInput, Pressable, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Optional gradient for modern look
import { ImageBackground, } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both the fields');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in: ', userCredential.user.uid);

            // Clear the fields
            setEmail('');
            setPassword('');

            // Navigate to Dashboard
            navigation.replace('MainTabs');
        } catch (error) {
            console.log('Login Error: ', error);
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
       
        <SafeAreaView style={styles.container}>
             <ImageBackground
                    source={require("../../assets/login.jpg")} 
                   style={{ flex: 1, width: "100%", height: "100%"   }}
                    resizeMode="cover"
                    blurRadius={0}
                  >
            <View style={styles.gradient}>
                <View style={styles.header}>
                    <Text style={styles.loginHeading}>LOGIN</Text>
                    <Text style={styles.subHeading}>Sign in to continue</Text>
                </View>

                <View style={styles.formContainer}>
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
                    <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.textInputPassword}
                        placeholder='Password'
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
                </View>

                <View style={styles.belowFormContainer}>
                    <TouchableOpacity>
                        <Text style={styles.link}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.link}>New User? Sign Up</Text>
                    </TouchableOpacity>
                </View>

                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>SUBMIT</Text>
                </Pressable>
                </View>
            {/* </LinearGradient> */}
           </ImageBackground>
        </SafeAreaView>
         
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#696666ff',
//         overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.6)', // dark overlay for readability
//   },
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    loginHeading: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    subHeading: {
        fontSize: 16,
        color: '#aaa',
        marginTop: 8,
    },
    formContainer: {
        width: '100%',
    },
    textInput: {
        backgroundColor: '#1e1e1e',
        color: 'white',
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    belowFormContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
    },
    link: {
        color: '#e8edf0ff',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#959697ff',
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
    passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#1e1e1e',
  borderRadius: 12,
  height: 50,
  marginBottom: 15,
  paddingHorizontal: 10,
},
textInputPassword: {
  flex: 1,
  color: 'white',
  fontSize: 16,
},
});
