import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DIFFICULTY_LEVELS } from "../data/difficulty";

export default function ResultScreen({
  totalPoints,
  bestScore,
  score,
  shuffledLetters,
  timer,
  maxCombo,
  wrongAnswers,
  difficulty,
  resultFadeAnim,
  star1Anim,
  star2Anim,
  star3Anim,
  scoreCountAnim,
  calculateStars,
  getSpeedRank,
  startGame,
  setDifficulty,
  formatTime,
}) {
  const stars = calculateStars();
  const accuracy = ((score / shuffledLetters.length) * 100).toFixed(1);
  const speedRank = getSpeedRank();
  const isPerfect = wrongAnswers === 0;
  const isNewRecord = totalPoints > bestScore;

  const animatedScore = scoreCountAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, totalPoints],
  });

  return (
    <Animated.View
      style={[styles.resultContainer, { opacity: resultFadeAnim }]}
    >
      <View style={styles.card}>
        <Text style={styles.resultTitle}>
          {isPerfect
            ? "🌟 Mükemmel!"
            : stars === 3
            ? "🎉 Harika!"
            : stars === 2
            ? "👍 İyi!"
            : "💪 Devam!"}
        </Text>

        <View style={styles.starsContainer}>
          <Animated.View
            style={{
              transform: [
                {
                  scale: star1Anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.5, 1],
                  }),
                },
              ],
              opacity: star1Anim,
            }}
          >
            <Text style={styles.starIcon}>⭐</Text>
          </Animated.View>

          <Animated.View
            style={{
              transform: [
                {
                  scale: star2Anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.5, 1],
                  }),
                },
              ],
              opacity: star2Anim,
            }}
          >
            <Text style={[styles.starIcon, stars < 2 && styles.starEmpty]}>
              ⭐
            </Text>
          </Animated.View>

          <Animated.View
            style={{
              transform: [
                {
                  scale: star3Anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.5, 1],
                  }),
                },
              ],
              opacity: star3Anim,
            }}
          >
            <Text style={[styles.starIcon, stars < 3 && styles.starEmpty]}>
              ⭐
            </Text>
          </Animated.View>
        </View>

        <View style={styles.totalPointsContainer}>
          <Text style={styles.totalPointsLabel}>Toplam Puan</Text>
          <Animated.Text style={styles.totalPointsValue}>
            {animatedScore}
          </Animated.Text>
          {isNewRecord && (
            <Text style={styles.recordBadge}>🆕 Yeni Rekor!</Text>
          )}
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{formatTime(timer)}</Text>
            <Text style={styles.statBoxLabel}>Süre</Text>
            {speedRank && (
              <View
                style={[styles.rankBadge, { backgroundColor: speedRank.color }]}
              >
                <Text style={styles.rankText}>
                  {speedRank.icon} {speedRank.rank}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{accuracy}%</Text>
            <Text style={styles.statBoxLabel}>Doğruluk</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statBoxValue}>{maxCombo}x</Text>
            <Text style={styles.statBoxLabel}>Max Kombo</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Doğru Cevap:</Text>
            <Text style={styles.detailValue}>
              {score} / {shuffledLetters.length}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Yanlış Cevap:</Text>
            <Text style={styles.detailValue}>{wrongAnswers}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Zorluk:</Text>
            <Text style={styles.detailValue}>
              {DIFFICULTY_LEVELS[difficulty].name}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => startGame(difficulty)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#10b981", "#14b8a6"]}
            style={styles.buttonGradient}
          >
            <Text style={styles.actionButtonText}>🔄 Tekrar Oyna</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { marginTop: 12 }]}
          onPress={() => setDifficulty(null)}
          activeOpacity={0.8}
        >
          <View style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>📊 Seviye Seç</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
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
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  starIcon: {
    fontSize: 64,
  },
  starEmpty: {
    opacity: 0.3,
  },
  totalPointsContainer: {
    backgroundColor: "#f0fdf4",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#10b981",
  },
  totalPointsLabel: {
    fontSize: 14,
    color: "#065f46",
    marginBottom: 4,
    fontWeight: "600",
  },
  totalPointsValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#10b981",
  },
  recordBadge: {
    fontSize: 16,
    color: "#f59e0b",
    fontWeight: "bold",
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statBoxValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  rankBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "bold",
  },
  detailsContainer: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
});
