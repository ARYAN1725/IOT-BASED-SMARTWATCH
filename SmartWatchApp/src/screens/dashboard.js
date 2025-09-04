import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React from 'react'

const dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Dashboard</Text>

      {/* Welcome heading text begins */}
      <View>
        <Text style={styles.headingText}>Welcome, Aryan!</Text>
      </View>
      {/* Welcome heading text ends */}

      {/* Cards section begins here */}
      {/* Steps Card begins here */}
      <View style={styles.card}>
        <View style={styles.cardImage}>
        <Image
        source={require('../../assets/Steps_Logo.png')}
        style={{width: 75, height: 75, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}
        />
        </View>
        <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  }}
/>
        <Text style={styles.cardHeading}>Steps</Text>
      </View>
    </SafeAreaView>
  )
}

export default dashboard;

const styles = StyleSheet.create({

  headingText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    // paddingBottom: 20,
  },
  container: {
    paddingTop: 30,
    backgroundColor: '#F6F6F6',
    flex: 1,
  },
  card: {
    backgroundColor: 'grey',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    height: 150,
    width: '80%',
  },
    cardHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: 20,
    color: 'black',
    },
    cardImage: {
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        marginLeft: 10,
        marginTop: 40,
    }
});