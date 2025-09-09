// src/screens/dashboard.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const Dashboard = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('onAuthStateChanged -> user:', user?.uid ?? null);

      if (!user) {
        // not signed in
        if (mounted) {
          setUsername(null);
          setLoading(false);
        }
        return;
      }

      try {
        // Try to read user's document from Firestore
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        console.log('Firestore user doc exists:', snap.exists());
        if (snap.exists()) {
          const data = snap.data();
          console.log('Firestore user doc data:', data);
          if (mounted) setUsername(data.username ?? user.displayName ?? user.email ?? 'User');
        } else {
          // No user doc found — fallback to auth profile
          console.warn('No user document found for uid:', user.uid);
          if (mounted) setUsername(user.displayName ?? user.email ?? 'User');
        }
      } catch (err) {
        console.error('Error fetching user doc:', err);
        // Firestore read may be blocked by rules or network error
        if (mounted) setUsername(user.displayName ?? user.email ?? 'User');
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Show spinner until we determine the username
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Dashboard</Text>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}> Welcome {username ? username : 'User'}!</Text>
      </View>

      {/* -- rest of your card UI (unchanged) -- */}
      {/* Steps Card */}
      <View style={styles.stepsContainer}>
        <View style={styles.imageAndHorizontalContainer}>
          <View style={styles.imageAndTextContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/Steps_Logo.png')}
                style={{ width: 100, height: 100, marginTop: 7 }}
              />
            </View>
            <View style={styles.aboveLineTextContainer}>
              <Text style={styles.stepsHeading}>Steps</Text>
              <Text style={styles.stepsHeading}> 9786</Text>
            </View>
          </View>

          <View style={styles.horizontalRule}></View>

          <View style={styles.belowLineTextContainer}>
            <Text style={styles.stepsHeading}>Goal: 10000</Text>
            <Text style={styles.stepsHeading}>Calories Burned: 250</Text>
          </View>
        </View>
      </View>

      {/* Heart Rate Card */}
      <View style={styles.stepsContainer}>
        <View style={styles.imageAndHorizontalContainer}>
          <View style={styles.imageAndTextContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/Heartrate_logo.png')}
                style={{ width: 100, height: 100, marginTop: 7 }}
              />
            </View>
            <View style={styles.aboveLineTextContainer}>
              <Text style={styles.stepsHeading}>Heart Rate</Text>
              <Text style={styles.stepsHeading}> 95</Text>
            </View>
          </View>

          <View style={styles.horizontalRule}></View>

          <View style={styles.belowLineTextContainer}>
            <Text style={styles.stepsHeading}>Goal: 10000</Text>
            <Text style={styles.stepsHeading}>Calories Burned: 250</Text>
          </View>
        </View>
      </View>

      {/* Oxygen Card */}
      <View style={styles.stepsContainer}>
        <View style={styles.imageAndHorizontalContainer}>
          <View style={styles.imageAndTextContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/Oxygen_Logo.png')}
                style={{ width: 100, height: 100, marginTop: 7 }}
              />
            </View>
            <View style={styles.aboveLineTextContainer}>
              <Text style={styles.stepsHeading}>Oxygen Level</Text>
              <Text style={styles.stepsHeading}> 98%</Text>
            </View>
          </View>

          <View style={styles.horizontalRule}></View>

          <View style={styles.belowLineTextContainer}>
            <Text style={styles.stepsHeading}>Goal: 10000</Text>
            <Text style={styles.stepsHeading}>Calories Burned: 250</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    marginLeft: 15,
    backgroundColor: '#f6f6f6',
    flex: 1,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    height: 150,
    width: '95%',
    alignSelf: 'center',
    paddingBottom: 20,
    marginBottom: 25,
  },
  horizontalRule: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 5,
    marginRight: 0,
    width: '100%',
    marginTop: 10,
  },
  imageAndHorizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  imageContainer: {},
  aboveLineTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  belowLineTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
  },
});
