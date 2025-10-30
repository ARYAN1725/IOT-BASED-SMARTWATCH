
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, Alert , Modal, ScrollView  } from 'react-native';
import { auth, db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import useBLE from '../screens/BleManager'; // adjust path if needed
import { BleManager } from 'react-native-ble-plx';
import { Platform} from 'react-native';
import { PermissionsAndroid } from 'react-native';



const Profile = ({ navigation }) => {
  const [activeScreen, setActiveScreen] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  // Convert timestamp safely
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Not Set';
    if (timestamp.toDate) {
      return timestamp.toDate().toDateString();
    }
    return String(timestamp);
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
  const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    // Check if permissions granted
    console.log(granted);
  }
};

const ensureBluetoothEnabled = async () => {
  const state = await manager.state();
  if (state !== 'PoweredOn') {
    Alert.alert(
      'Bluetooth Required',
      'Please turn on Bluetooth to connect to device',
      [
        { text: 'Cancel', style: 'cancel' },
        // { text: 'Open Settings', onPress: () => manager.enable() }, // Android only
      ]
    );
    return false;
  }
  return true;
};

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Unable to sign out');
    }
  };
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

return (
  <SafeAreaView style={styles.container}>
    <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
      <Image
        source={require("../../assets/people.png")}
        style={styles.profilePic}
      />
    </TouchableOpacity>
    {uploading && <ActivityIndicator size="small" color="blue" />}

    <Text style={styles.username}>{userData?.username || 'User'}</Text>
    <Text style={styles.value}>{userData?.email || 'Not Available'}</Text>
    {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

    {/* Connect Watch Section */}
    
    <View style={styles.connectCard}>
        <Text style={styles.label}>Device</Text>
        <Text style={styles.value}>
          {connectedDevice ? connectedDevice.name : 'No device connected'}
        </Text>

        {!connectedDevice ? (
          <TouchableOpacity
              style={styles.connectButton}
              onPress={async () => {
                await requestPermissions();
                const btEnabled = await ensureBluetoothEnabled();
                if (btEnabled) {
                  startScan();
                  setModalVisible(true);
                }
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
    backgroundColor: '#121212',
    padding: 20,
  },
  profilePic: {
    marginTop: 5,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    marginBottom: 10,
    tintColor:"#ccc",
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
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
    marginBottom: 7,
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
    backgroundColor: '#f2f4f7ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#080808ff',
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
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
    tintColor:"#ccc"
    
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    marginTop: 10,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 14,
    color: "#c2bcbcff",
  },
  signOutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
