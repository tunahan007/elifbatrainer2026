export const DIFFICULTY_LEVELS = {
  EASY: {
    name: "Kolay",
    options: 4,
    timeLimit: 0,
    penalty: 0,
    speedBonus: { gold: 120, silver: 180, bronze: 240 },
  },
  MEDIUM: {
    name: "Orta",
    options: 6,
    timeLimit: 90,
    penalty: 3,
    speedBonus: { gold: 60, silver: 75, bronze: 90 },
  },
  HARD: {
    name: "Zor",
    options: 8,
    timeLimit: 60,
    penalty: 5,
    speedBonus: { gold: 40, silver: 50, bronze: 60 },
  },
  EXPERT: {
    name: "Uzman",
    options: 8,
    timeLimit: 45,
    penalty: 10,
    speedBonus: { gold: 30, silver: 38, bronze: 45 },
  },
};
