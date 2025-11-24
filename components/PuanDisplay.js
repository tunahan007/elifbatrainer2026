import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PuanDisplay({ totalPoints }) {
  return (
    <View style={styles.pointsDisplay}>
      <Text style={styles.pointsLabel}>Puan</Text>
      <Text style={styles.pointsValue}>{totalPoints.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pointsDisplay: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10b981",
  },
  pointsLabel: {
    fontSize: 11,
    color: "#065f46",
    fontWeight: "600",
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10b981",
  },
});
