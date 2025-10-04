// BleManager.js
import { BleManager } from 'react-native-ble-plx';
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export default function useBLE() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const manager = new BleManager();

  // 🟢 Scan for nearby BLE devices
  const startScan = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }

    setDevices([]);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }

      // Example filter: only show devices with names
      if (device && device.name) {
        setDevices(prev => {
          if (!prev.find(d => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  // 🟢 Connect to selected device
  const connectToDevice = async (device) => {
    try {
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      console.log('Connected to:', connected.name);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  // 🟠 Disconnect device
  const disconnectDevice = async () => {
    if (connectedDevice) {
      await manager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

  useEffect(() => {
    return () => {
      manager.destroy();
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
