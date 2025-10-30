// BleManager.js
import { BleManager } from 'react-native-ble-plx';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
<<<<<<< HEAD
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
=======
import { Buffer } from 'buffer';
import { db } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Nordic UART Service UUIDs
const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
>>>>>>> 93f700c (Updated BLE connection and UI code)

export default function useBLE() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [deviceData, setDeviceData] = useState([]); // store live readings
  const manager = new BleManager();

  // 🟢 Scan for nearby BLE devices
  const startScan = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
      }

      setDevices([]);
      console.log("🔍 Scanning for BLE devices...");
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error("❌ Scan error:", error);
          return;
        }

        if (device && device.name) {
          setDevices(prev => {
            if (!prev.find(d => d.id === device.id)) {
              return [...prev, device];
            }
            return prev;
          });
        }
      });

      setTimeout(() => {
        manager.stopDeviceScan();
        console.log("🛑 Scan stopped after 10 seconds");
      }, 10000);
    } catch (err) {
      console.error("❌ Error during scan:", err);
    }
<<<<<<< HEAD
=======

    setDevices([]);
    console.log('🔍 Scanning for devices...');
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        return;
      }

      if (device && device.name) {
        setDevices(prev => {
          if (!prev.find(d => d.id === device.id)) {
            console.log('📡 Found device:', device.name);
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    // stop scan after 10 sec
    setTimeout(() => {
      manager.stopDeviceScan();
      console.log('⏹️ Scan stopped');
    }, 10000);
>>>>>>> 93f700c (Updated BLE connection and UI code)
  };

  // 🟢 Connect to selected device
  const connectToDevice = async (device) => {
    try {
      console.log('🔗 Connecting to device:', device.name);
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
<<<<<<< HEAD
      console.log("✅ Connected to:", connected.name);

      // Start monitoring step data after connection
      monitorStepData(connected);
=======
      console.log('✅ Connected to:', connected.name);

      // start reading from the watch
      startReadingData(connected);
>>>>>>> 93f700c (Updated BLE connection and UI code)
    } catch (error) {
      console.error("❌ Connection error:", error);
    }
  };

  // 🟡 Read and monitor data
  const startReadingData = async (device) => {
    try {
      console.log('📡 Subscribing to data...');
      const characteristic = await device.readCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID
      );

      // start monitoring for continuous updates
      device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        async (error, characteristic) => {
          if (error) {
            console.error('Monitor error:', error);
            return;
          }

          if (characteristic?.value) {
            const decoded = Buffer.from(characteristic.value, 'base64').toString('utf8');
            console.log('📥 Data received:', decoded);

            // update state
            setDeviceData(prev => [...prev, decoded]);

            // save to Firestore
            await saveDataToFirestore(decoded);
          }
        }
      );
    } catch (error) {
      console.error('Error reading data:', error);
    }
  };

  // 🧾 Save data to Firestore
  const saveDataToFirestore = async (data) => {
    try {
      await addDoc(collection(db, 'deviceData'), {
        timestamp: Timestamp.now(),
        data: parseData(data),
      });
      console.log('✅ Data saved to Firestore');
    } catch (error) {
      console.error('Firestore save error:', error);
    }
  };

  // Safely parse JSON if possible
  const parseData = (data) => {
    try {
      return JSON.parse(data);
    } catch {
      return { raw: data };
    }
  };

  // 🟠 Disconnect device
  const disconnectDevice = async () => {
<<<<<<< HEAD
    try {
      if (connectedDevice) {
        await manager.cancelDeviceConnection(connectedDevice.id);
        console.log("🔌 Disconnected from device");
        setConnectedDevice(null);
      }
    } catch (error) {
      console.error("❌ Error disconnecting device:", error);
=======
    if (connectedDevice) {
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      console.log('🔌 Disconnected');
>>>>>>> 93f700c (Updated BLE connection and UI code)
    }
  };

  // 🟣 Upload step data to Firestore
  const uploadStepsToFirestore = async (currentSteps) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("⚠️ User not logged in");
        return;
      }

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const docRef = doc(db, "users", user.uid, "stepData", today);

      await setDoc(docRef, {
        date: today,
        stepsToday: currentSteps,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      console.log("📤 Steps updated successfully:", currentSteps);
    } catch (error) {
      console.error("❌ Error uploading steps:", error);
    }
  };

  // 🧩 Monitor smartwatch step data
  const monitorStepData = async (device) => {
    try {
      if (!device) {
        console.log("⚠️ No device connected to monitor steps");
        return;
      }

      // Replace these with your smartwatch's actual UUIDs
      const serviceUUID = "YOUR_SERVICE_UUID";
      const characteristicUUID = "YOUR_CHARACTERISTIC_UUID";

      console.log("📡 Listening for step data...");

      device.monitorCharacteristicForService(
        serviceUUID,
        characteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.error("❌ Error monitoring step data:", error);
            return;
          }

          // Convert from Base64 to readable format (BLE data comes in Base64)
          const base64 = characteristic?.value;
          const decoded = atob(base64); // requires base-64 decoding support
          const stepValue = parseInt(decoded, 10);

          if (!isNaN(stepValue)) {
            console.log("📈 Step data received:", stepValue);
            uploadStepsToFirestore(stepValue);
          }
        }
      );
    } catch (error) {
      console.error("❌ Error in monitorStepData:", error);
    }
  };

  // 🧹 Cleanup BLE Manager
  useEffect(() => {
    return () => {
      manager.destroy();
      console.log("🧹 BLE Manager destroyed");
    };
  }, []);

  return {
    devices,
    connectedDevice,
    deviceData,
    startScan,
    connectToDevice,
    disconnectDevice,
  };
}
