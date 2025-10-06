import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from "react-native";
import Svg, { Circle } from "react-native-svg";

const StepsBlock = () => {
  const [steps, setSteps] = useState(3200);
  const [goal, setGoal] = useState(6000);
  const [editVisible, setEditVisible] = useState(false);
  const [newGoal, setNewGoal] = useState(goal.toString());

  const km = (steps * 0.0008).toFixed(2);
  const kcal = (steps * 0.04).toFixed(0);
  const progress = Math.min(steps / goal, 1); // same progress for all arcs
  

  const getOffset = (radius) => 2 * Math.PI * radius * (1 - progress);

  return (
    <View style={styles.container}>
      {/* Multi-color progress arcs */}
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
          <Image source={require("../../assets/shoes.png")} style={styles.icon} />
          <Text style={[styles.label, { color: "#ff7f24" }]}>Step</Text>
          <Text style={styles.value}>{steps}</Text>
        </View>
        <View style={styles.statItem}>
          <Image source={require("../../assets/location.png")} style={styles.icon} />
          <Text style={[styles.label, { color: "#52a8ff" }]}>Km</Text>
          <Text style={styles.value}>{km}</Text>
        </View>
        <View style={styles.statItem}>
          <Image source={require("../../assets/fire.png")} style={styles.icon} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginTop: 12,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  icon: {
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
});

export default StepsBlock;
