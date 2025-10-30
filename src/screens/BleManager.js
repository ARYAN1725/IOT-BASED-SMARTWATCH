// BleManager.js
import { BleManager } from 'react-native-ble-plx';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { db, auth } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function useBLE() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
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
  };

  // 🟢 Connect to selected device
  const connectToDevice = async (device) => {
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      console.log("✅ Connected to:", connected.name);

      // Start monitoring step data after connection
      monitorStepData(connected);
    } catch (error) {
      console.error("❌ Connection error:", error);
    }
  };

  // 🟠 Disconnect device
  const disconnectDevice = async () => {
    try {
      if (connectedDevice) {
        await manager.cancelDeviceConnection(connectedDevice.id);
        console.log("🔌 Disconnected from device");
        setConnectedDevice(null);
      }
    } catch (error) {
      console.error("❌ Error disconnecting device:", error);
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
    startScan,
    connectToDevice,
    disconnectDevice,
  };
}
