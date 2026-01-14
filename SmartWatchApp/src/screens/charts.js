import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Charts = () => {

  // Dummy data
  const steps = [3000, 4200, 5100, 6800, 8200, 9500, 11000];
  const heartRate = [92, 90, 88, 85, 82, 80, 78];
  const spo2 = [96, 96, 97, 97, 98, 98, 99];

  const getFeedback = (data, label) => {
    if (data[data.length - 1] > data[0]) return `Good progress in ${label}`;
    if (data[data.length - 1] < data[0]) return `Decline detected in ${label}`;
    return `No significant change in ${label}`;
  };

  const renderChart = (title, data) => (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={{
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ data }]
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#1e1e1e',
          backgroundGradientFrom: '#1e1e1e',
          backgroundGradientTo: '#1e1e1e',
          decimalPlaces: 0,
          color: () => '#0a84ff',
          labelColor: () => '#aaa',
        }}
        bezier
        style={{ borderRadius: 12 }}
      />
      <Text style={styles.feedback}>{getFeedback(data, title)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderChart('Steps', steps)}
      {renderChart('Heart Rate', heartRate)}
      {renderChart('SpO₂', spo2)}
    </ScrollView>
  );
};

export default Charts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  feedback: {
    marginTop: 10,
    color: '#34c759',
    fontSize: 14,
  },
});
