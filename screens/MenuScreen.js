import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DIFFICULTY_LEVELS } from "../data/difficulty";

export default function MenuScreen({ bestScore, startGame }) {
  return (
    <View style={styles.startContainer}>
      <View style={styles.card}>
        <Text style={styles.titleText}>Elif-ba Oyunu</Text>
        <Text style={styles.subtitleText}>Zorluk seviyesi seç:</Text>

        {bestScore > 0 && (
          <View style={styles.bestScoreContainer}>
            <Text style={styles.bestScoreLabel}>En Yüksek Puan:</Text>
            <Text style={styles.bestScoreValue}>
              {bestScore.toLocaleString()}
            </Text>
          </View>
        )}

        {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
          <TouchableOpacity
            key={key}
            style={styles.difficultyButton}
            onPress={() => startGame(key)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                key === "EASY"
                  ? ["#10b981", "#059669"]
                  : key === "MEDIUM"
                  ? ["#f59e0b", "#d97706"]
                  : key === "HARD"
                  ? ["#ef4444", "#dc2626"]
                  : ["#8b5cf6", "#7c3aed"]
              }
              style={styles.buttonGradient}
            >
              <Text style={styles.difficultyButtonText}>{level.name}</Text>
              <Text style={styles.difficultyDetails}>
                {level.options} seçenek
                {level.timeLimit > 0 && ` • ${level.timeLimit}sn limit`}
              </Text>
              <Text style={styles.speedBonusText}>
                🥇 {level.speedBonus.gold}sn 🥈 {level.speedBonus.silver}sn 🥉{" "}
                {level.speedBonus.bronze}sn
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  startContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: "relative",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 18,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
  },
  bestScoreContainer: {
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  bestScoreLabel: {
    fontSize: 14,
    color: "#92400e",
    marginBottom: 4,
  },
  bestScoreValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#b45309",
  },
  difficultyButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  difficultyButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  difficultyDetails: {
    fontSize: 13,
    color: "#ffffff",
    opacity: 0.9,
    marginBottom: 4,
  },
  speedBonusText: {
    fontSize: 11,
    color: "#ffffff",
    opacity: 0.85,
  },
});
