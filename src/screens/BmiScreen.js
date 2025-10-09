import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { auth, db } from "../config/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export default function BmiScreen() {
  const [bmiRecords, setBmiRecords] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(true);


  // Fetch BMI records
  const fetchBMIData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const bmiRef = collection(db, "users", user.uid, "bmiRecords");
      const q = query(bmiRef, orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);

      const data = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter and keep only valid BMI values
      const validData = data
        .filter((item) => !isNaN(parseFloat(item.bmi)))
        .slice(0, 7)
        .reverse(); // last 7 in correct order

      setBmiRecords(validData);
    } catch (error) {
      console.log("Error fetching BMI:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user data
  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const d = userDoc.data();
        setHeight(d.height ? String(d.height) : "");
        setWeight(d.weight ? String(d.weight) : "");
      }
    } catch (e) {
      console.log("Error fetching user data:", e);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchBMIData();
  }, []);


  const handleEdit = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w) {
      alert("Please enter valid height and weight");
      return;
    }

    const bmi = Number((w / ((h / 100) ** 2)).toFixed(1));
    const now = new Date();

    // Update user height/weight
    await updateDoc(doc(db, "users", user.uid), {
      height: h,
      weight: w,
    });

    // Add new BMI record
    await addDoc(collection(db, "users", user.uid, "bmiRecords"), {
      bmi: bmi,
      height: h,
      weight: w,
      date: now.toISOString().split("T")[0],
      timestamp: Timestamp.fromDate(now),
    });

    setShowEditForm(false); // hide form
    fetchBMIData(); // reload chart
  } catch (e) {
    console.log("Error updating BMI:", e);
    alert("Failed to update BMI");
  }
};


  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const bmiValues = bmiRecords
  .map((item) => {
    const val = Number(item.bmi);
    return isNaN(val) ? null : val;
  })
  .filter((v) => v !== null);


  const labels = bmiRecords
    .filter((item) => !isNaN(parseFloat(item.bmi)))
    .map((item) => {
      const d = item.timestamp.toDate();
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });

  const currentBmi = bmiValues[bmiValues.length - 1] || "--";

  return (
    <View style={{ flex: 1, backgroundColor: "#121212", alignItems: "center" }}>
    <TouchableWithoutFeedback onPress={() => setSelectedPoint(null)}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>BMI Tracker</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Current Height: {height || "--"} cm</Text>
          <Text style={styles.infoText}>Current Weight: {weight || "--"} kg</Text>
          <Text style={styles.infoText}>Current BMI: {currentBmi}</Text>
        </View>
        <TouchableOpacity
  style={styles.editBtn}
  onPress={() => setShowEditForm(true)}
>
  
  <Text style={styles.editText}>Edit Height & Weight</Text>
</TouchableOpacity>

{showEditForm && (
  <TouchableWithoutFeedback onPress={() => setShowEditForm(false)}>
    <View style={styles.overlay}>
      <TouchableWithoutFeedback>
        <View style={styles.editForm}>
          <Text style={styles.formTitle}>Edit Height & Weight</Text>

          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleEdit}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
)}



        {bmiValues.length > 0 ? (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
  data={{
    labels: labels,
    datasets: [{ data: bmiValues }],
  }}
  width={Math.max(screenWidth, bmiValues.length * 80)}
  height={250}
  chartConfig={{
    backgroundColor: "#202020",
    backgroundGradientFrom: "#202020",
    backgroundGradientTo: "#202020",
    color: (opacity = 1) => `rgba(255,127,36,${opacity})`,
    labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  }}
  bezier
  style={{ marginVertical: 8, borderRadius: 16 }}
  verticalLabelRotation={-20}
  renderDotContent={({ x, y, index }) => (
    <Text
      key={index}
      style={{
        position: "absolute",
        left: x - 10,
        top: y - 20,
        color: "#ff7f24",
        fontSize: 12,
        fontWeight: "bold",
      }}
    >
      {bmiValues[index]}
    </Text>
  )}
/>

            </ScrollView>

            {selectedPoint && (
              <View
                style={{
                  position: "absolute",
                  left: selectedPoint.x + 15,
                  top: selectedPoint.y + 100,
                }}
              >
                <Text style={styles.pointText}>{selectedPoint.value}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.noData}>No BMI data available</Text>
        )}

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setShowEditForm(true)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editText}>Edit Height & Weight</Text>
        </TouchableOpacity>

        {showEditForm && (
          <TouchableWithoutFeedback onPress={() => setShowEditForm(false)}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback>
                <View style={styles.editForm}>
                  <Text style={styles.formTitle}>Edit Height & Weight</Text>

                  <Text style={styles.label}>Height (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                  />

                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />

                  <TouchableOpacity style={styles.saveBtn} onPress={handleEdit}>
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212",
    alignItems: "center",
    paddingBottom: 60,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: "#202020",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    width: "90%",
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 2,
  },
  chartStyle: {
    borderRadius: 16,
    marginVertical: 8,
  },
  pointText: {
    color: "#ff7f24",
    fontWeight: "600",
    fontSize: 14,
  },
  noData: {
    color: "gray",
    marginVertical: 20,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff7f24",
    padding: 10,
    borderRadius: 10,
    marginTop: 7,
    marginBottom:20,
  },
  editText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  editForm: {
    backgroundColor: "#202020",
    padding: 20,
    borderRadius: 16,
    width: "80%",
  },
  formTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    color: "#ccc",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#303030",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  saveBtn: {
    backgroundColor: "#ff7f24",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
