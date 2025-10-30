import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../config/firebase"; // adjust path
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc, getDocs } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";



export default function EditProfile() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openGender, setOpenGender] = useState(false);
const [genderOptions, setGenderOptions] = useState([
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
]);

  const [userData, setUserData] = useState({
    email: "",
    name: "",
    birthday: "",
    height: "",
    weight: "",
    gender: "",
  });

  const auth = getAuth();

  // 🧩 ADD THIS FUNCTION HERE (just below your useState and before useEffect)
  const saveBMI = async (weight, height) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const bmi = Number((weight / ((height / 100) ** 2)).toFixed(1));

await addDoc(collection(db, "users", user.uid, "bmiRecords"), {
  date: now.toISOString().split("T")[0], // human-readable date
  timestamp: Timestamp.fromDate(now),   // exact time
  height: height,
  weight: weight,
  bmi: bmi,  // numeric now
});

      console.log("BMI record saved:", bmi);
    } catch (error) {
      console.log("Error saving BMI:", error);
    }
  };
  // 🧩 END OF FUNCTION

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          const birthday =
            data.birthday && data.birthday.toDate
              ? data.birthday.toDate().toISOString().split("T")[0]
              : data.birthday || "";

          setUserData({
            ...data,
            birthday,
            email: user.email,
          });
        } else {
          Alert.alert("No user data found in Firestore.");
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
        Alert.alert("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update data
  const handleSave = async () => {
  try {
    setSaving(true);
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    await updateDoc(userRef, {
      name: userData.name || "",
      birthday: userData.birthday || "",
      height: userData.height || "",
      weight: userData.weight || "",
      gender: userData.gender || "", // <-- replace undefined with empty string
    });

    Alert.alert("Profile updated successfully!");
    navigation.navigate("MainTabs"); // go back to profile page
  } catch (error) {
    console.log("Error updating profile:", error);
    Alert.alert("Error updating profile. Try again.");
  } finally {
    setSaving(false);
  }
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff7f24" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}></Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { color: "#888" }]}
          value={userData.email}
          editable={false}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Birthday</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={userData.birthday}
          onChangeText={(text) => setUserData({ ...userData, birthday: text })}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Gender</Text>
        <DropDownPicker
    open={openGender}
    value={userData.gender}
    items={genderOptions}
    setOpen={(val) => setOpenGender(val)}
    setValue={(callback) =>
      setUserData((prev) => ({ ...prev, gender: callback(prev.gender) }))
    }
    setItems={setGenderOptions}
    placeholder="Select Gender"
    containerStyle={{ flex: 1, marginLeft: 10 }}
    style={{
      backgroundColor: "#2a2a2a",
      borderColor: "#555",
      height: 45,
    }}
    dropDownContainerStyle={{
      backgroundColor: "#2a2a2a",
      borderColor: "#555",
      zIndex: 5000,
    }}
    textStyle={{ color: "#fff", fontSize: 16 }}
  />
      </View>

      


      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#121212", padding: 20 },
  header: { fontSize: 26, fontWeight: "700", color: "#fff", marginBottom:1, textAlign: "center" },
  fieldContainer: { marginBottom: 18 },
  label: { color: "#585655ff", fontSize: 15, marginBottom: 6 },
  input: { backgroundColor: "#1e1e1e", color: "#fff", borderWidth: 1, borderColor: "#333", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  saveButton: { backgroundColor: "#ff7f24", paddingVertical: 14, borderRadius: 10, marginTop: 10, alignItems: "center" },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" },
});
