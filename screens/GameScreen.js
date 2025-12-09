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
import ABanner from "../components/banner";

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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
          alignItems: "center",
          flexGrow: 1,
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

      {/* AdMob Banner Container */}
      <View style={styles.bannerContainer}>
        {/* Place your AdMob BannerAd component here */}

        {/* Example: <BannerAd unitId="your-ad-unit-id" size={BannerAdSize.BANNER} /> */}
        <View style={styles.bannerPlaceholder}>
          <ABanner />
        </View>
      </View>
    </View>
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
    borderRadius: 20,
    padding: 16,
    width: "100%",
    maxWidth: 480,
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
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
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
    fontSize: 40,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  arabicPreview: {
    fontSize: 28,
    color: "#6b7280",
    opacity: 0.5,
  },
  feedbackContainer: {
    alignItems: "center",
    marginBottom: 12,
    minHeight: 24,
  },
  feedbackText: {
    fontSize: 16,
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
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
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
    fontSize: 48,
  },
  optionTextSmall: {
    fontSize: 32,
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
  // AdMob Banner Styles
  bannerContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  bannerPlaceholder: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    width: "100%",
  },
  bannerPlaceholderText: {
    color: "#6b7280",
    fontSize: 12,
  },
});
