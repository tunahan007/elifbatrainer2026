import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
} from "react-native";
import PuanDisplay from "../components/PuanDisplay";
import ComboDisplay from "../components/ComboDisplay";
import SoundButton from "../components/SoundButton";
import { DIFFICULTY_LEVELS } from "../data/difficulty";

export default function GameScreen({
  totalPoints,
  combo,
  comboAnim,
  score,
  timer,
  shuffledLetters,
  currentIndex,
  difficulty,
  feedback,
  options,
  soundEnabled,
  toggleSound,
  isSpeaking,
  replayLetterSound,
  handleAnswer,
  pointsAnim,
  calculatePoints,
  fadeAnim,
  scaleAnim,
  shakeAnim,
  formatTime,
  getTimeLeft,
}) {
  const timeLeft = getTimeLeft();
  const isTimeWarning = timeLeft && timeLeft <= 10;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <PuanDisplay totalPoints={totalPoints} />
          <ComboDisplay combo={combo} comboAnim={comboAnim} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>İlerleme</Text>
            <Text style={styles.statValue}>
              {currentIndex + 1}/{shuffledLetters.length}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>
              {timeLeft !== null ? "Kalan" : "Süre"}
            </Text>
            <Text
              style={[
                styles.statValue,
                styles.timerText,
                isTimeWarning && styles.warningText,
              ]}
            >
              {timeLeft !== null ? formatTime(timeLeft) : formatTime(timer)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Doğru</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
        </View>

        {pointsAnim._value > 0 && (
          <Animated.View
            style={[
              styles.floatingPoints,
              {
                opacity: pointsAnim,
                transform: [
                  {
                    translateY: pointsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -30],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.floatingPointsText}>
              +{calculatePoints(true, combo)}
            </Text>
          </Animated.View>
        )}

        {shuffledLetters[currentIndex] && (
          <Animated.View
            style={[
              styles.questionBox,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }, { translateX: shakeAnim }],
              },
            ]}
          >
            <View style={styles.questionHeader}>
              <Text style={styles.questionLabel}>Bu harfi seç:</Text>
              <TouchableOpacity
                style={styles.replayButton}
                onPress={replayLetterSound}
                activeOpacity={0.7}
                disabled={isSpeaking}
              >
                <Text style={styles.replayButtonText}>
                  {/* {isSpeaking ? "⏸️ Bekle" : "🔊 Tekrar"} */}
                  <SoundButton
                    soundEnabled={soundEnabled}
                    toggleSound={toggleSound}
                  />
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.questionText}>
              {shuffledLetters[currentIndex].latin}
            </Text>
            <Text style={styles.arabicPreview}>
              {/* {shuffledLetters[currentIndex].arabic} */}
            </Text>
          </Animated.View>
        )}

        {feedback !== "" && (
          <View style={styles.feedbackContainer}>
            <Text
              style={[
                styles.feedbackText,
                feedback.includes("Doğru") || feedback.includes("puan")
                  ? styles.correctFeedback
                  : styles.wrongFeedback,
              ]}
            >
              {feedback}
            </Text>
          </View>
        )}

        <View style={styles.optionsGrid}>
          {options.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                difficulty === "HARD" || difficulty === "EXPERT"
                  ? styles.optionButtonSmall
                  : styles.optionButtonLarge,
              ]}
              onPress={() => handleAnswer(letter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  difficulty === "HARD" || difficulty === "EXPERT"
                    ? styles.optionTextSmall
                    : styles.optionTextLarge,
                ]}
              >
                {letter.arabic}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  ((currentIndex + 1) / shuffledLetters.length) * 100
                }%`,
              },
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    justifyContent: "center",
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  timerText: {
    color: "#10b981",
  },
  warningText: {
    color: "#ef4444",
  },
  floatingPoints: {
    position: "absolute",
    top: 120,
    right: 40,
    zIndex: 10,
  },
  floatingPointsText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#10b981",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  questionBox: {
    backgroundColor: "#d1fae5",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  questionLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  replayButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  replayButtonText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
  questionText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  arabicPreview: {
    fontSize: 32,
    color: "#6b7280",
    opacity: 0.5,
  },
  feedbackContainer: {
    alignItems: "center",
    marginBottom: 16,
    minHeight: 30,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: "600",
  },
  correctFeedback: {
    color: "#10b981",
  },
  wrongFeedback: {
    color: "#ef4444",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  optionButtonLarge: {
    width: "48%",
    aspectRatio: 1,
  },
  optionButtonSmall: {
    width: "23%",
    aspectRatio: 1,
  },
  optionText: {
    color: "#1f2937",
  },
  optionTextLarge: {
    fontSize: 56,
  },
  optionTextSmall: {
    fontSize: 36,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
});
