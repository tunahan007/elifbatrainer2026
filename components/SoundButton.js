import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function SoundButton({ soundEnabled, toggleSound }) {
  return (
    <TouchableOpacity
      style={styles.soundButton}
      onPress={toggleSound}
      activeOpacity={0.7}
    >
      <Text style={styles.soundButtonText}>{soundEnabled ? "🔊" : "🔇"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  soundButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 8,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  soundButtonText: {
    fontSize: 12,
  },
});
