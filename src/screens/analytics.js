import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Analytics = () => {
  return (
    <View>
      <Text onPress={() => navigation.navigate('Dashboard')}>Dashboard</Text>
      <Text onPress={() => navigation.navigate('Profile')}>Profile</Text>
      <Text onPress={() => navigation.navigate('Analytics')}>Analytics</Text>
      <Text onPress={() => navigation.navigate('Guide')}>Guide</Text>
    </View>
  )
}

export default Analytics

const styles = StyleSheet.create({})