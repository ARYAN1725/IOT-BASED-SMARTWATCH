import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) setUserData(userDoc.data());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const pickImage = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Pick image
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!pickerResult.canceled) {
      uploadImage(pickerResult.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      const user = auth.currentUser;
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profilePics/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      // Save URL to Firestore
      await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });

      setUserData((prev) => ({ ...prev, photoURL: downloadURL }));
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not upload photo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            userData?.photoURL
              ? { uri: userData.photoURL }
              : require('../../assets/Profile_clipart_icon.png') // placeholder image
          }
          style={styles.profilePic}
        />
      </TouchableOpacity>
      {uploading && <ActivityIndicator size="small" color="blue" />}
      <Text style={styles.username}>{userData?.username || 'User'}</Text>
      <Text>Email: {userData?.email}</Text>
      <Text>Last Login: {userData?.lastLogin ? new Date(userData.lastLogin.seconds * 1000).toLocaleString(): 'Not Available'}</Text>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 30,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  profilePic: {
    marginTop: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
