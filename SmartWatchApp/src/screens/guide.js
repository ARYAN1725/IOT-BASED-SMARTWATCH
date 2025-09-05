import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Guide = ({navigation}) => {
  return (
    <View>
      <Text onPress={() => navigation.navigate('Dashboard')}>Dashboard</Text>
      <Text onPress={() => navigation.navigate('Profile')}>Profile</Text>
      <Text onPress={() => navigation.navigate('Analytics')}>Analytics</Text>
      <Text onPress={() => navigation.navigate('Guide')}>Guide</Text>
    </View>
  )
}

export default Guide

const styles = StyleSheet.create({})