import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

import React from 'react'

const Guide = ({ navigation }) => {
  return (
    <SafeAreaView>
      <ScrollView>
      <View >
        <Text style={styles.headingText}>Welcome to the user guide!</Text>
      </View>

      <View> 
        <View style={styles.instructionDiv}>
          <Text style={styles.instructionText}>Connect your Wearable Smartwatch device to the mobile application by enabling ‘bluetooth connection.’</Text>
        </View>

        <Text style={styles.instructionText}>You can check your vitals viz the heartrate, Blood Oxygen(SpO2) and Steps.</Text>
        <Text style={styles.instructionText}>On clicking on any of the vitals, you will be redirected to the ‘ 
          <Text style={styles.linkText} onPress={() => navigation.navigate('Analytics')}>Analysis </Text> 
          Page’ where you can visualize your vitals graphically. Also, you can track your progress.</Text>

        <View style={styles.instructionDiv}>
          <Text style={styles.instructionTextHeading} 
          onPress= {() => navigation.navigate('Dashboard')}>1. Dashboard (Landing Page)</Text>
          <View style={styles.imageTextWrapper}> 
            <Image
              source={require('../../assets/dashboardSs.jpeg')}
              style={{ width: 154, height: 300 }}
            />
            <Text style={styles.imageTextWrapperText}>You can access the vitals of any component by clicking on the respective card. You will be redirected to the analysis page. </Text>
          </View>

        </View>

        <Text style={styles.instructionTextHeading} 
        onPress={() => navigation.navigate('Profile')}>2. Profile</Text>


        <View style={styles.imageTextWrapper}>
          <Text style={styles.imageTextWrapperText}>
            Change your profile photograph by clicking on the profile photo icon. Here, you can check your credentials like username, email and last login.
            Your vitals will appear here once you check them!
          </Text>
          <Image
            source={require('../../assets/profileSs.jpeg')}
            style={{ width: 154, height: 300 }}
          />
        </View>
        </View>

        </ScrollView>
    </SafeAreaView>
  )
}

export default Guide

const styles = StyleSheet.create({
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  instructionDiv: {
    marginTop: 10,
    textAlign: 'justify',
    marginLeft: 10,
    marginRight: 10,
  },
  instructionText: {
    fontSize: 15,
    margin: 5,
    textAlign: 'justify',
    // marginLeft: 5,
  },
  instructionTextHeading: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  imageTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  imageTextWrapperText: {
    flex: 1,
    textAlign: 'justify',
    margin: 10,
    flexWrap: 'wrap',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },

})