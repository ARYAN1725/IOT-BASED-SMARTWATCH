import { StyleSheet, Text, View, SafeAreaView, TextInput, placeholder, Pressable, TouchableOpacity, Button, Alert } from 'react-native'
import React, {useState} from 'react';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../config/firebase';


const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both the fields');
            return;
        }

        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('Logged in: ', userCredential.user.uid);

            //Clear the fields
            setEmail('');
            setPassword('');

            //Navigation to Dashboard
            navigation.replace('MainTabs');
        } catch(error) {
            console.log('Login Error: ', error);
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.loginHeading}>Login</Text>
            </View>

            <View>       {/* Form will go here */}
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
                    placeholder='Enter your password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    />
            </View>

            <View style={styles.belowFormContainer}>             {/* Forgot Password will go here */}
            <TouchableOpacity>
                    <Text style={styles.link}>Forgot Password?</Text>
                </TouchableOpacity>
                
                {/* Make SignUp clickable and navigate */}
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.link}>New User? SignUp</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>SUBMIT</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Login

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
        width: 300,
        padding: 10,
    },
    link: {
        color: 'blue',
        fontWeight: 'bold',
    }
})