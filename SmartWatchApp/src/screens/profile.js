import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Profile = ({navigation}) => {
  return (
    <View>
      <Text onPress={() => navigation.navigate('Dashboard')}>Dashboard</Text>
      <Text onPress={() => navigation.navigate('Settings')}>Settings</Text>
      <Text onPress={() => navigation.navigate('Profile')}>Profile</Text>
      <Text onPress={() => navigation.navigate('Guide')}>Guide</Text>
    </View>
  )
}

export default Profile;

const styles = StyleSheet.create({})