// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { auth, db, storage } from '../config/firebase';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { SafeAreaView } from 'react-native-safe-area-context';


// const Profile = ({ navigation }) => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   const fetchUserData = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return;

//       let data = {
//         email: user.email,
//         username: user.displayName || 'User',
//         lastLogin: user.metadata?.lastSignInTime || null,
//         createdAt: user.metadata?.creationTime || null,
//       };

//       const userDoc = await getDoc(doc(db, 'users', user.uid));
//       if (userDoc.exists()) {
//         data = {...data, ...userDoc.data()};
//       } 
    
//     data.lastLogin = user.metadata?.lastSignInTime || null;
//     data.email = user.email;

//     setUserData(data);
//     }
//     catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const pickImage = async () => {
//     // Ask for permission
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permissionResult.granted) {
//       alert('Permission to access camera roll is required!');
//       return;
//     }

//     // Pick image
//     let pickerResult = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.7,
//     });

//     if (!pickerResult.canceled) {
//       uploadImage(pickerResult.assets[0].uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     try {
//       setUploading(true);
//       const user = auth.currentUser;
//       const response = await fetch(uri);
//       const blob = await response.blob();

//       const storageRef = ref(storage, `profilePics/${user.uid}.jpg`);
//       await uploadBytes(storageRef, blob);

//       const downloadURL = await getDownloadURL(storageRef);

//       // Save URL to Firestore
//       await updateDoc(doc(db, 'users', user.uid), { photoURL: downloadURL });

//       setUserData((prev) => ({ ...prev, photoURL: downloadURL }));
//       Alert.alert('Success', 'Profile picture updated!');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Could not upload photo');
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ActivityIndicator size="large" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <TouchableOpacity onPress={pickImage}>
//         <Image
//           source={
//             userData?.photoURL
//               ? { uri: userData.photoURL }
//               : require('../../assets/user.png') // placeholder image
//           }
//           style={styles.profilePic}
//         />
//       </TouchableOpacity>
//       {uploading && <ActivityIndicator size="small" color="blue" />}
//       <Text style={styles.username}>{userData?.username || 'User'}</Text>
//       <Text>Email: {userData?.email}</Text>
//       <Text>Last Login: {userData?.lastLogin ? userData.lastLogin : 'Not Available'}</Text>
//     </SafeAreaView>
//   );
// };

// export default Profile;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // marginTop: 30,
//     // justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f6f6f6',
//   },
//   profilePic: {
//     marginTop: 30,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 2,
//     borderColor: '#ccc',
//     marginBottom: 10,
//   },
//   username: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Alert , Modal, ScrollView  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBLE from '../screens/BleManager'; // adjust path if needed
import { BleManager } from 'react-native-ble-plx';


const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  // Convert timestamp safely
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not Set';
    if (timestamp.toDate) {
      return timestamp.toDate().toDateString(); // Firestore Timestamp
    }
    return String(timestamp); // fallback
  };
  const {
    devices,
    connectedDevice,
    startScan,
    connectToDevice,
    disconnectDevice,
  } = useBLE();

  const [modalVisible, setModalVisible] = useState(false);
  const manager = new BleManager();


  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      let data = {
        email: user.email,
        username: user.displayName || 'User',
        lastLogin: user.metadata?.lastSignInTime || null,
        createdAt: user.metadata?.creationTime || null,
      };

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        data = { ...data, ...userDoc.data() };
      }

      setUserData(data);
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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

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
        <ActivityIndicator size="large" color="#fff" />
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
            : require('../../assets/user.png') // placeholder image
        }
        style={styles.profilePic}
      />
    </TouchableOpacity>
    {uploading && <ActivityIndicator size="small" color="blue" />}

    <Text style={styles.username}>{userData?.username || 'User'}</Text>

    {/* Profile Info Section */}
    <View style={styles.infoCard}>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{userData?.email || 'Not Available'}</Text>
    </View>

    <View style={styles.infoCard}>
  <Text style={styles.label}>Birthday</Text>
  <Text style={styles.value}>
    {formatDate(userData?.birthday)}
  </Text>
</View>

    {/* <View style={styles.infoCard}>
      <Text style={styles.label}>Gender</Text>
      <Text style={styles.value}>{userData?.gender || 'Not Set'}</Text>
    </View> */}

    {/* Connect Watch Section */}
    
    <View style={styles.connectCard}>
        <Text style={styles.label}>Device</Text>
        <Text style={styles.value}>
          {connectedDevice ? connectedDevice.name : 'No device connected'}
        </Text>

        {!connectedDevice ? (
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => {
              startScan();
              setModalVisible(true);
            }}
          >
            <Text style={styles.connectButtonText}>Connect Watch</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.connectButton, { backgroundColor: 'red' }]}
            onPress={disconnectDevice}
          >
            <Text style={styles.connectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Device list modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView style={styles.deviceList}>
            {devices.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={styles.deviceItem}
                onPress={() => {
                  connectToDevice(d);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.deviceName}>{d.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  </SafeAreaView>
);
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212', // dark background
    padding: 20,
  },
  profilePic: {
    marginTop: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#555',
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  connectCard: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  connectButton: {
    marginTop: 10,
    backgroundColor: '#0a84ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
   modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceList: {
    backgroundColor: '#fff',
    width: '80%',
    maxHeight: 400,
    borderRadius: 10,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  deviceName: { fontSize: 16, color: '#000' },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  closeText: { color: '#fff' },
});
