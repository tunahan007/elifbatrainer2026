import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  Animated,
  Vibration,
  ScrollView,
  StyleSheet,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";

import { arabicLetters } from "./data/letter";
import { DIFFICULTY_LEVELS } from "./data/difficulty";
import MenuScreen from "./screens/MenuScreen";
import GameScreen from "./screens/GameScreen";
import ResultScreen from "./screens/ResultScreen";

export default function App() {
  const [difficulty, setDifficulty] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [options, setOptions] = useState([]);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const comboAnim = useRef(new Animated.Value(0)).current;
  const pointsAnim = useRef(new Animated.Value(0)).current;

  const resultFadeAnim = useRef(new Animated.Value(0)).current;
  const star1Anim = useRef(new Animated.Value(0)).current;
  const star2Anim = useRef(new Animated.Value(0)).current;
  const star3Anim = useRef(new Animated.Value(0)).current;
  const scoreCountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backAction = () => {
      if (showResult) {
        setShowResult(false);
        setDifficulty(null);
        return true;
      } else if (isPlaying) {
        endGame();
        return true;
      } else if (difficulty) {
        setDifficulty(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isPlaying, difficulty, showResult]);

  useEffect(() => {
    const shuffled = [...arabicLetters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);

    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    if (
      shuffledLetters.length > 0 &&
      difficulty &&
      currentIndex < shuffledLetters.length
    ) {
      generateOptions();
      playLetterSound(shuffledLetters[currentIndex]);
    }
  }, [currentIndex, shuffledLetters, difficulty]);

  useEffect(() => {
    let interval;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1;
          if (difficulty && DIFFICULTY_LEVELS[difficulty].timeLimit > 0) {
            if (newTime >= DIFFICULTY_LEVELS[difficulty].timeLimit) {
              endGame();
            }
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, difficulty]);

  const playLetterSound = async (letter) => {
    if (!soundEnabled || !letter || isSpeaking) return;

    try {
      setIsSpeaking(true);
      await Speech.stop();
      await Speech.speak(letter.arabic, {
        language: "ar",
        pitch: 1.0,
        rate: 0.75,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.log("Harf sesi çalınamadı:", error);
      setIsSpeaking(false);
    }
  };

  const playCorrectSound = async () => {
    if (!soundEnabled) return;
    try {
      Vibration.vibrate(50);
      /*   await Speech.speak("Doğru!", {
        language: "tr",
        pitch: 1.2,
        rate: 1.0,
      }); */
    } catch (error) {
      console.log("Doğru sesi çalınamadı:", error);
    }
  };

  const playWrongSound = async () => {
    if (!soundEnabled) return;
    try {
      Vibration.vibrate([0, 100, 50, 100]);
      /*   await Speech.speak("Yanlış!", {
        language: "tr",
        pitch: 0.8,
        rate: 1.0,
      }); */
    } catch (error) {
      console.log("Yanlış sesi çalınamadı:", error);
    }
  };

  const playCompleteSound = async () => {
    if (!soundEnabled) return;
    try {
      Vibration.vibrate([0, 100, 100, 100, 100, 100]);
      await Speech.speak("Oyun tamamlandı!", {
        language: "tr",
        pitch: 1.3,
        rate: 0.9,
      });
    } catch (error) {
      console.log("Tamamlama sesi çalınamadı:", error);
    }
  };

  const toggleSound = async () => {
    if (soundEnabled) {
      await Speech.stop();
    }
    setSoundEnabled(!soundEnabled);
  };

  const replayLetterSound = () => {
    if (shuffledLetters[currentIndex]) {
      playLetterSound(shuffledLetters[currentIndex]);
    }
  };

  const calculatePoints = (isCorrect, currentCombo) => {
    if (!isCorrect) return 0;

    let points = 100;
    if (currentCombo > 1) {
      points += currentCombo * 10;
    }

    const multiplier =
      {
        EASY: 1,
        MEDIUM: 1.5,
        HARD: 2,
        EXPERT: 2.5,
      }[difficulty] || 1;

    return Math.floor(points * multiplier);
  };

  const calculateStars = () => {
    if (!difficulty || shuffledLetters.length === 0) return 0;

    const level = DIFFICULTY_LEVELS[difficulty];
    const accuracy = score / shuffledLetters.length;
    const speedBonus = level.speedBonus;

    let speedStars = 0;
    if (timer <= speedBonus.gold) speedStars = 3;
    else if (timer <= speedBonus.silver) speedStars = 2;
    else if (timer <= speedBonus.bronze) speedStars = 1;

    let accuracyStars = 0;
    if (accuracy === 1) accuracyStars = 3;
    else if (accuracy >= 0.9) accuracyStars = 2;
    else if (accuracy >= 0.75) accuracyStars = 1;

    const stars = Math.round((speedStars + accuracyStars) / 2);
    return Math.max(1, stars);
  };

  const getSpeedRank = () => {
    if (!difficulty) return null;
    const speedBonus = DIFFICULTY_LEVELS[difficulty].speedBonus;

    if (timer <= speedBonus.gold)
      return { rank: "Altın", color: "#f59e0b", icon: "🥇" };
    if (timer <= speedBonus.silver)
      return { rank: "Gümüş", color: "#9ca3af", icon: "🥈" };
    if (timer <= speedBonus.bronze)
      return { rank: "Bronz", color: "#92400e", icon: "🥉" };
    return null;
  };

  const generateOptions = () => {
    if (
      shuffledLetters.length === 0 ||
      !difficulty ||
      currentIndex >= shuffledLetters.length
    )
      return;

    const numOptions = DIFFICULTY_LEVELS[difficulty].options;
    const correct = shuffledLetters[currentIndex];
    const wrongOptions = arabicLetters
      .filter((letter) => letter.arabic !== correct.arabic)
      .sort(() => Math.random() - 0.5)
      .slice(0, numOptions - 1);

    const allOptions = [correct, ...wrongOptions].sort(
      () => Math.random() - 0.5
    );

    setOptions(allOptions);
  };

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setIsPlaying(true);
    setGameOver(false);
    setShowResult(false);
    setScore(0);
    setTotalPoints(0);
    setTimer(0);
    setCurrentIndex(0);
    setFeedback("");
    setCombo(0);
    setMaxCombo(0);
    setWrongAnswers(0);
    const shuffled = [...arabicLetters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
  };

  const animateCorrect = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const animateWrong = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animatePoints = () => {
    pointsAnim.setValue(0);
    Animated.sequence([
      Animated.timing(pointsAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pointsAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateCombo = () => {
    Animated.sequence([
      Animated.timing(comboAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(comboAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateResult = (stars) => {
    resultFadeAnim.setValue(0);
    star1Anim.setValue(0);
    star2Anim.setValue(0);
    star3Anim.setValue(0);
    scoreCountAnim.setValue(0);

    Animated.sequence([
      Animated.timing(resultFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(200),
      Animated.timing(star1Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      ...(stars >= 2
        ? [
            Animated.delay(200),
            Animated.timing(star2Anim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]
        : []),
      ...(stars >= 3
        ? [
            Animated.delay(200),
            Animated.timing(star3Anim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]
        : []),
      Animated.timing(scoreCountAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();

    if (stars === 3) {
      Vibration.vibrate([0, 100, 100, 100, 100, 100]);
    } else if (stars === 2) {
      Vibration.vibrate([0, 100, 100, 100]);
    } else {
      Vibration.vibrate(100);
    }
  };

  const endGame = () => {
    setGameOver(true);
    setIsPlaying(false);
    playCompleteSound();

    setTimeout(() => {
      setShowResult(true);
      const stars = calculateStars();
      animateResult(stars);

      if (totalPoints > bestScore) {
        setBestScore(totalPoints);
      }
    }, 500);
  };

  const handleAnswer = (selectedLetter) => {
    if (!shuffledLetters[currentIndex]) return;

    if (selectedLetter.arabic === shuffledLetters[currentIndex].arabic) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      setScore(score + 1);

      const points = calculatePoints(true, newCombo);
      setTotalPoints(totalPoints + points);
      setFeedback(`✓ +${points} puan!`);

      playCorrectSound();
      animateCorrect();
      animatePoints();

      if (newCombo > 1 && newCombo % 5 === 0) {
        animateCombo();
      }

      setTimeout(() => {
        if (currentIndex + 1 < shuffledLetters.length) {
          setCurrentIndex(currentIndex + 1);
          setFeedback("");
        } else {
          endGame();
        }
      }, 500);
    } else {
      setCombo(0);
      setWrongAnswers(wrongAnswers + 1);
      setFeedback("✗ Yanlış!");

      playWrongSound();
      animateWrong();

      if (difficulty && DIFFICULTY_LEVELS[difficulty].penalty > 0) {
        setTimer((prev) => prev + DIFFICULTY_LEVELS[difficulty].penalty);
      }

      setTimeout(() => setFeedback(""), 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeLeft = () => {
    if (!difficulty || DIFFICULTY_LEVELS[difficulty].timeLimit === 0)
      return null;
    const timeLimit = DIFFICULTY_LEVELS[difficulty].timeLimit;
    const remaining = timeLimit - timer;
    return remaining > 0 ? remaining : 0;
  };

  if (!difficulty) {
    return (
      <LinearGradient colors={["#10b981", "#14b8a6"]} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <MenuScreen bestScore={bestScore} startGame={startGame} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (gameOver && !showResult) {
    return (
      <LinearGradient colors={["#10b981", "#14b8a6"]} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Sonuçlar hesaplanıyor...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (showResult) {
    return (
      <LinearGradient colors={["#10b981", "#14b8a6"]} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ResultScreen
              totalPoints={totalPoints}
              bestScore={bestScore}
              score={score}
              shuffledLetters={shuffledLetters}
              timer={timer}
              maxCombo={maxCombo}
              wrongAnswers={wrongAnswers}
              difficulty={difficulty}
              resultFadeAnim={resultFadeAnim}
              star1Anim={star1Anim}
              star2Anim={star2Anim}
              star3Anim={star3Anim}
              scoreCountAnim={scoreCountAnim}
              calculateStars={calculateStars}
              getSpeedRank={getSpeedRank}
              startGame={startGame}
              setDifficulty={setDifficulty}
              formatTime={formatTime}
            />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#10b981", "#14b8a6"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <GameScreen
          totalPoints={totalPoints}
          combo={combo}
          comboAnim={comboAnim}
          score={score}
          timer={timer}
          shuffledLetters={shuffledLetters}
          currentIndex={currentIndex}
          difficulty={difficulty}
          feedback={feedback}
          options={options}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          isSpeaking={isSpeaking}
          replayLetterSound={replayLetterSound}
          handleAnswer={handleAnswer}
          pointsAnim={pointsAnim}
          calculatePoints={calculatePoints}
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}
          shakeAnim={shakeAnim}
          formatTime={formatTime}
          getTimeLeft={getTimeLeft}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
  },
});
