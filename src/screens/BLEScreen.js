import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import useBLE from '../screens/BleManager'; // 👈 use your updated file

export default function BLEScreen() {
  const { devices, connectedDevice, deviceData, startScan, connectToDevice, disconnectDevice } = useBLE();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Watch Scanner</Text>

      {!connectedDevice ? (
        <>
          <TouchableOpacity style={styles.button} onPress={startScan}>
            <Text style={styles.buttonText}>🔍 Start Scan</Text>
          </TouchableOpacity>

          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.device} onPress={() => connectToDevice(item)}>
                <Text>{item.name}</Text>
                <Text style={{ fontSize: 12 }}>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <>
          <Text style={styles.connected}>✅ Connected to {connectedDevice.name}</Text>
          <TouchableOpacity style={styles.button} onPress={disconnectDevice}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>📡 Live Data:</Text>
          <FlatList
            data={deviceData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.dataItem}>{item}</Text>}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', marginTop:40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { marginTop: 20, fontWeight: '600', fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  buttonText: { color: '#fff', fontWeight: '600' },
  device: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  connected: { color: 'green', fontWeight: 'bold', marginBottom: 10 },
  dataItem: { paddingVertical: 5, fontFamily: 'monospace' },
});
