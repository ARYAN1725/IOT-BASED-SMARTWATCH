
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo, Feather } from '@expo/vector-icons';
import Svg, { Circle } from "react-native-svg";


const Dashboard = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [bmi, setBmi] = useState(null);
  const navigation = useNavigation();
  const [steps, setSteps] = useState(3200);
    const [goal, setGoal] = useState(8000);
    const [editVisible, setEditVisible] = useState(false);
    const [newGoal, setNewGoal] = useState(goal.toString());
  
    const km = (steps * 0.0008).toFixed(2);
    const kcal = (steps * 0.04).toFixed(0);
    const progress = Math.min(steps / goal, 1); // same progress for all arcs
    
  
    const getOffset = (radius) =>  4* Math.PI * radius * (1 - progress);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUsername(null);
        setLoading(false);
        return;
      }
  
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
  
        if (snap.exists()) {
          const data = snap.data();
          setUsername(data.username || "User");
          setHeight(data.height || null);
          setWeight(data.weight || null);

          if (data.height && data.weight) {
    const hMeters = data.height / 100; // convert cm → meters
    const bmiValue = (data.weight / (hMeters * hMeters)).toFixed(1);
    setBmi(bmiValue);
  }
        } else {
          setUsername("User");
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        setUsername("User");
      } finally {
        setLoading(false);
      }
    });
  
    return unsubscribe;
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
     <View style={styles.container}>
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 1}}>
      {/* Steps Section */}
      <View style={styles.stepsContainer}>
<View style={styles.progressContainer}>
        <Svg height="180" width="360" viewBox="0 0 360 180">
          {/* Background arcs */}
          {[160, 130, 100].map((r, i) => (
            <Circle
              key={i}
              cx="180"
              cy="180"
              r={r}
              stroke="#2d2d2d"
              strokeWidth="20"
              fill="none"
            />
          ))}

          {/* Steps arc */}
          <Circle
            cx="180"
            cy="180"
            r="160"
            stroke="#ff7f24"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 160}
            strokeDashoffset={getOffset(160)}
            transform="rotate(-180 180 180)"
          />
          {/* Km arc */}
          <Circle
            cx="180"
            cy="180"
            r="130"
            stroke="#52a8ff"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={getOffset(130)}
            transform="rotate(-180 180 180)"
          />
          {/* Kcal arc */}
          <Circle
            cx="180"
            cy="180"
            r="100"
            stroke="#b566ff"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 100}
            strokeDashoffset={getOffset(100)}
            transform="rotate(-180 180 180)"
          />
        </Svg>
      </View>

            {/* Steps | Km | Kcal Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Image source={require("../../assets/shoes.png")} style={styles.sicon} />
                <Text style={[styles.label, { color: "#ff7f24" }]}>Step</Text>
                <Text style={styles.value}>{steps}</Text>
              </View>
              <View style={styles.statItem}>
                <Image source={require("../../assets/location.png")} style={styles.sicon} />
                <Text style={[styles.label, { color: "#52a8ff" }]}>Km</Text>
                <Text style={styles.value}>{km}</Text>
              </View>
              <View style={styles.statItem}>
                <Image source={require("../../assets/fire.png")} style={styles.sicon} />
                <Text style={[styles.label, { color: "#b566ff" }]}>Kcal</Text>
                <Text style={styles.value}>{kcal}</Text>
              </View>
            </View>
      
            {/* Goal section */}
            <View style={styles.goalContainer}>
              <Text style={styles.goalText}>
                Today’s Steps <Text style={{ color: "#ff7f24" }}>{steps}/{goal}</Text>
              </Text>
              <TouchableOpacity onPress={() => setEditVisible(true)} style={styles.editBtn}>
                <Text style={{ color: "#ff7f24", fontSize: 16 }}>✏️</Text>
              </TouchableOpacity>
            </View>
      
            {/* Edit Goal Modal */}
            <Modal visible={editVisible} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>Edit Goal</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={newGoal}
                    onChangeText={setNewGoal}
                  />
                  <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={() => {
                        setGoal(Number(newGoal));
                        setEditVisible(false);
                      }}
                    >
                      <Text style={{ color: "#fff" }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditVisible(false)}>
                      <Text style={{ color: "#fff" }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>


        {/* <View style={styles.stepsBox}> */}
          {/* <View style={styles.stepsIconCircle}>
           <FontAwesome5 name="shoe-prints" size={40} color="black" />
          </View> */}
           {/* <Image 
              source={require('../../assets/shoes.png')} 
              style={styles.stepsIconCircle} 
            />
          <Text style={styles.stepsLabel}>Steps</Text>
          <Text style={styles.stepsCount}>0</Text>
          <Text style={styles.goalText}>Goal</Text>
          <TouchableOpacity style={styles.editGoal}>
            <MaterialIcons name="edit" size={40} color="black" />
          </TouchableOpacity> */}
          
        {/* </View> */}

        {/* <View style={styles.smallBoxes}> */}
          {/* <View style={[styles.smallBox, {backgroundColor: '#2C3E91'}]}> */}
            {/* <View style={styles.iconCircleBlue}>
             <Ionicons name="location-outline" size={40} color="black" />
            </View> */}
            {/* <Image 
              source={require('../../assets/location.png')} 
              style={styles.iconCircleBlue} 
            />
            <Text style={styles.boxLabel}>Km</Text>
            <Text style={styles.boxCount}>0</Text> */}
          {/* </View> */}

          {/* <View style={[styles.smallBox, {backgroundColor: '#652C91'}]}> */}
            {/* <View style={styles.iconCirclePurple}>
             <FontAwesome5 name="fire" size={40} color="orange" />
            </View> */}
            {/* <Image 
              source={require('../../assets/fire.png')} 
              style={styles.iconCirclePurple} 
            />
            <Text style={styles.boxLabel}>Kcal</Text>
            <Text style={styles.boxCount}>0</Text> */}
          {/* </View> */}
        {/* </View>  */}
      </View>


    <View style={styles.grid}>
      <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('StepsBlock')}
         activeOpacity={0.8}>  
          <Text style={styles.healthLabel}>Heart Rate</Text>
          <Text style={styles.noDataSubText}>No Data</Text>
          <Image 
              source={require('../../assets/Heartrate_logo.png')} 
              style={styles.icon} 
          />
      </TouchableOpacity>  
        <View style={styles.gridItem}>
          {/* <View style={styles.healthIconContainerPurple}>
            <FontAwesome5 name="bed" size={40} color="blue" />
          </View> */}
          <Text style={styles.healthLabel}>SPO2</Text>
          <Text style={styles.noDataSubText}>No Data</Text>
          <Image 
              source={require('../../assets/spo2logo.png')} 
              style={styles.icon} 
          />
          {/* <View style={styles.graphPurple} /> */}
        </View>

        <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('BMIDetail')}
         activeOpacity={0.8}
       > 
          <Text style={styles.healthLabel}>BMI</Text>
          <Text style={styles.noDataSubText}>{bmi ? bmi : "No Data"}</Text>
          <Image 
              source={require('../../assets/bmilogo.png')} 
              style={styles.icon} 
          />
        </TouchableOpacity>

        <View style={styles.gridItem}>
          {/* <View style={styles.healthIconContainerGreen}>
            <FontAwesome5 name="dumbbell" size={40} color="black" />
          </View> */}
          <Text style={styles.healthLabel}>Sleep</Text>
          <Text style={styles.noDataSubText}>11hr 38mins</Text>
          <Image 
              source={require('../../assets/sleep.png')} 
              style={styles.icon} 
          />
          {/* <View style={styles.graphGreen} /> */}
        </View>
      </View>

      <TouchableOpacity style={styles.changeOrderButton}>
        <Text style={styles.changeOrderText}>Change Order</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',  // dark background
    paddingHorizontal: 5,
    paddingTop: 5,
    // marginLeft: 15,
//     backgroundColor: '#f6f6f6',
//     flex: 1,
//   },
  },
  stepsContainer: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
},
  statItem: {
    alignItems: "center",
},
sicon: {
    width: 22,
    height: 22,
    marginBottom: 4,
    tintColor:"#fff"
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  goalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  goalText: {
    color: "#ccc",
    fontSize: 15,
  },
  editBtn: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#2c2c2c",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#ff7f24",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  stepsBox: {
    backgroundColor: '#714916',
    borderRadius: 15,
    width: '48%',
    padding: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  stepsIconCircle: {
    backgroundColor: '#FF7200',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // tintColor: "#fff"
  },
  icon: {
    marginLeft: 40,
    // marginTop:1,
    width: 100,
    height: 100,
    // tintColor: '#fa0303ff',
  },

  stepsLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  stepsCount: {
    color: '#FF7200',
    fontSize: 48,
    fontWeight: 'bold',
  },
  // goalText: {
  //   color: '#666',
  //   fontSize: 14,
  //   marginTop: 10,
  // },
  editGoal: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
  },
  smallBoxes: {
    width: '48%',
    justifyContent: 'space-between',
  },
  smallBox: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleBlue: {
    backgroundColor: '#2D4BCF',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor:'#000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  iconCirclePurple: {
    backgroundColor: '#6C2DE4',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor:'#000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 4,
    shadowOpacity: 0.5,
    elevation: 5,
    // tintColor: "#d57c16ff"
  },
  smallIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },
  boxLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  boxCount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  circularProgressParent: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 110,
    height: 110,
  },
  outerCircle: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 8,
    borderColor: '#E4731F',
    top: 0,
    left: 0,
  },
  middleCircle: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#2C3E91',
  },
  innerCircle: {
    position: 'absolute',
    top: 30,
    left: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 8,
    borderColor: '#652C91',
  },
  rainbowIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
  },
  rainbowImage: {
    width: 24,
    height: 24,
  },
  noDataBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  noDataText: {
    color: '#fff',
    fontSize: 16,
  },
  seeMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#222',
    width: '48%',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  healthIconContainerRed: {
    backgroundColor: '#CC2929',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  healthIconContainerPurple: {
    backgroundColor: '#635AB6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  healthIconContainerBlue: {
    backgroundColor: '#3E93A5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  healthIconContainerGreen: {
    backgroundColor: '#709E95',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  healthIcon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  healthLabel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 2,
  },
  noDataSubText: {
    color: '#7a7a7a',
    fontSize: 14,
    marginBottom: 10,
  },
  graphRed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#440000',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  graphPurple: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#4B3A82',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  graphBlue: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#1E4B53',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  graphGreen: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#4D7066',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  changeOrderButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  changeOrderText: {
    color: '#e6e6e6ff',
    fontSize: 16,
  },
});