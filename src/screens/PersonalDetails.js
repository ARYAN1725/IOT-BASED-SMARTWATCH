import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, ScrollView } from "react-native";
import { auth, db } from "../config/firebase";
import { doc, setDoc, Timestamp, getDoc, collection, addDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';

export default function PersonalDetails() {
  const [step, setStep] = useState(1); // Step 1 = personal details, Step 2 = set goals
  const navigation = useNavigation(); 
  const now = new Date();
  // Personal details
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [openHeight, setOpenHeight] = useState(false);
  const [heightUnits, setHeightUnits] = useState([
    { label: "cm", value: "cm" },
    { label: "ft", value: "ft" }
  ]);

  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [openWeight, setOpenWeight] = useState(false);
  const [weightUnits, setWeightUnits] = useState([
    { label: "kg", value: "kg" },
    { label: "lbs", value: "lbs" }
  ]);

  // Goals
  const [targetWeight, setTargetWeight] = useState(""); 
  const [stepsGoal, setStepsGoal] = useState(""); 

  const INPUT_HEIGHT = 50; // consistent input & dropdown height
  useEffect(() => {
  const fetchUserName = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.username) {
          setName(data.username); // ✅ changed from data.name → data.username
        }
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  fetchUserName();
}, []);


  const calculateBMI = (weightKg, heightCm) => {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  };

  const suggestTargetWeight = (heightCm) => {
    return (22.5 * (heightCm / 100) ** 2).toFixed(1);
  };

  const distanceFromSteps = (steps) => (steps * 0.762 / 1000).toFixed(2); // km
  const caloriesFromSteps = (steps, weightKg) => Math.round(steps * 0.04 * weightKg);

  const handleNext = () => {
    let heightCm = Number(height);
    if (heightUnit === "ft") heightCm = height * 30.48;
    let weightKg = Number(weight);
    if (weightUnit === "lbs") weightKg = weight / 2.20462;

    setTargetWeight(suggestTargetWeight(heightCm));
    setStepsGoal("6000");

    setStep(2);
  };

 const handleSave = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("No user logged in!");
      return;
    }

    let heightCm = Number(height);
    if (heightUnit === "ft") heightCm = height * 30.48;

    let weightKg = Number(weight);
    if (weightUnit === "lbs") weightKg = weight / 2.20462;

    let targetKg = Number(targetWeight);

    // Save basic user details
    await setDoc(
      doc(db, "users", user.uid),
      {
        name,
        birthday: birthday ? Timestamp.fromDate(birthday) : null,
        height: heightCm,
        weight: weightKg,
        targetWeight: targetKg,
        stepsGoal: Number(stepsGoal),
      },
      { merge: true }
    );

    // 🔹 Save BMI record (add this below)
   const bmi = Number((weightKg / ((heightCm / 100) ** 2)).toFixed(1));

await addDoc(collection(db, "users", user.uid, "bmiRecords"), {
  date: now.toISOString().split("T")[0], // human-readable date
  timestamp: Timestamp.fromDate(now),   // exact time
  height: heightCm,
  weight: weightKg,
  bmi: bmi,  // numeric now
});

    alert("Details & Goals saved!");
    navigation.replace("MainTabs");
  } catch (error) {
    console.error("Error saving:", error);
    alert("Failed to save data");
  }
};

  return (
   <KeyboardAwareScrollView
  contentContainerStyle={styles.container}
  extraScrollHeight={20}
  enableOnAndroid={true}
  keyboardShouldPersistTaps="handled"
>
      <View style={styles.formBox}>
        {step === 1 ? (
          <>
            <Text style={styles.heading}>Enter Your Details</Text>

            <TextInput
              style={[styles.input, { height: INPUT_HEIGHT }]}
              placeholder="Name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={[styles.input, { height: INPUT_HEIGHT }]}
                placeholder="Birthday"
                placeholderTextColor="#aaa"
                value={birthday ? birthday.toISOString().split("T")[0] : ""}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthday || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(e, d) => {
                  setShowDatePicker(false);
                  if (d) setBirthday(d);
                }}
              />
            )}

            {/* Height Row */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15, overflow: "visible", zIndex: 5000 }}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10, height: INPUT_HEIGHT }]}
                placeholder="Height"
                placeholderTextColor="#aaa"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
              <DropDownPicker
                open={openHeight}
  value={heightUnit}
  items={heightUnits}
  setOpen={(val) => {
    setOpenHeight(val);
    if (val) setOpenWeight(false);
  }}
  setValue={setHeightUnit}
  setItems={setHeightUnits}
  containerStyle={{ width: 100, height: INPUT_HEIGHT }}
  style={{ backgroundColor: "#2a2a2a", borderColor: "#555", height: INPUT_HEIGHT }}
  dropDownContainerStyle={{ backgroundColor: "#2a2a2a", borderColor: "#555" }}
  textStyle={{ color: "#fff", fontSize: 16 }}
  nestedScrollEnabled={true} 
  
              />
            </View>

            {/* Weight Row */}
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15, overflow: "visible", zIndex: 4000 }}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10, height: INPUT_HEIGHT }]}
                placeholder="Weight"
                placeholderTextColor="#aaa"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <DropDownPicker
                open={openWeight}
                value={weightUnit}
                items={weightUnits}
                setOpen={(val) => {
                  setOpenWeight(val);
                  if (val) setOpenHeight(false);
                }}
                setValue={setWeightUnit}
                setItems={setWeightUnits}
                containerStyle={{ width: 100, height: INPUT_HEIGHT }}
                style={{ backgroundColor: "#2a2a2a", borderColor: "#555", height: INPUT_HEIGHT }}
                dropDownContainerStyle={{ backgroundColor: "#2a2a2a", borderColor: "#555" }}
                textStyle={{ color: "#fff", fontSize: 16 }}
                nestedScrollEnabled={true}
              />
            </View>

            <View style={styles.buttonWrapper}>
              <Button title="Next" onPress={handleNext} color="#4CAF50" />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.heading}>Set Your Goals</Text>
            <Text style={styles.label}>Target Weight (kg)</Text>

            <TextInput
              style={[styles.input, { height: INPUT_HEIGHT }]}
              placeholder="Target Weight (kg)"
              placeholderTextColor="#aaa"
              value={targetWeight.toString()}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Daily Steps Goal</Text>
            <TextInput
              style={[styles.input, { height: INPUT_HEIGHT }]}
              placeholder="Daily Steps Goal"
              placeholderTextColor="#aaa"
              value={stepsGoal.toString()}
              onChangeText={(val) => setStepsGoal(val)}
              keyboardType="numeric"
            />

            {stepsGoal ? (
              <View style={{ marginVertical: 10 }}>
                <Text style={{ color: "#fff" }}>Distance: {distanceFromSteps(Number(stepsGoal))} km</Text>
                <Text style={{ color: "#fff" }}>Calories Burned: {caloriesFromSteps(Number(stepsGoal), Number(weight))} kcal</Text>
              </View>
            ) : null}

            <View style={styles.buttonWrapper}>
              <Button title="Save & Finish" onPress={handleSave} color="#4CAF50" />
            </View>
          </>
        )}
      </View>
  </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212", padding: 20 },
  formBox: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#444",
    padding: 20,
    minHeight: 500,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5
  },
  heading: { fontSize: 22, marginBottom: 20, textAlign: "center", color: "#fff", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#555", backgroundColor: "#2a2a2a", color: "#fff", padding: 12, marginBottom: 15, borderRadius: 10, fontSize: 16 },
  buttonWrapper: { marginTop: 10, borderRadius: 10, overflow: "hidden" },
  label: {
  color: "#ccc",          // light grey for dark theme
  fontSize: 16,           // slightly smaller than heading
  fontWeight: "600",      // semi-bold
  marginBottom: 5,        // spacing between label and input
  marginLeft: 2           // optional: align with input nicely
},
});
