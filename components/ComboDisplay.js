import React from "react";
import { Animated, Text, StyleSheet } from "react-native";

export default function ComboDisplay({ combo, comboAnim }) {
  if (combo <= 1) return null;

  return (
    <Animated.View
      style={[
        styles.comboDisplay,
        {
          opacity: comboAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
          transform: [
            {
              scale: comboAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.3],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.comboText}>🔥 {combo}x</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  comboDisplay: {
    backgroundColor: "#fed7aa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f59e0b",
  },
  comboText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400e",
  },
});
