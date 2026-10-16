import type { GameColor } from "@/lib/data";

export type FeatureIconKind = "GAMEPAD" | "FREE" | "TROPHY" | "ROCKET";

export type Feature = {
  icon: FeatureIconKind;
  title: string;
  desc: string;
  color: GameColor;
};
export type HomeStat = { n: string; unit: string; sub: string };
export type ActivityRow = {
  player: string;
  game: string;
  score: number;
  when: string;
  color: GameColor;
};
export type TopPlayer = { rank: number; player: string; score: number };

export const FEATURES: Feature[] = [
  {
    icon: "GAMEPAD",
    title: "CLASSIC GAMES",
    desc: "Arkanoid, Tetris, Snake and many more. The best arcades of all time in one place.",
    color: "cyan",
  },
  {
    icon: "FREE",
    title: "100% FREE",
    desc: "No subscriptions, no hidden fees. Every game is available for free.",
    color: "yellow",
  },
  {
    icon: "TROPHY",
    title: "LEADERBOARDS",
    desc: "Compete with players from all over the world. Climb the ranking and prove who is the best.",
    color: "magenta",
  },
  {
    icon: "ROCKET",
    title: "ALWAYS GROWING",
    desc: "We add new games all the time. Come back often, there is always something new to play.",
    color: "green",
  },
];

export const HOME_STATS: HomeStat[] = [
  { n: "12+", unit: "GAMES", sub: "AND COUNTING" },
  { n: "MANY", unit: "GAMES PLAYED", sub: "EVERY DAY" },
  { n: "GLOBAL", unit: "RANKING", sub: "COMPETE WITH THE WORLD" },
];

export const ACTIVITY: ActivityRow[] = [
  { player: "NEONFOX", game: "DROP", score: 184220, when: "2 min ago", color: "magenta" },
  { player: "PX_KAI", game: "CHOMPER", score: 96400, when: "5 min ago", color: "yellow" },
  { player: "Z3R0COOL", game: "INVADERS", score: 54190, when: "8 min ago", color: "green" },
  { player: "VAULT_07", game: "ROCKS", score: 41200, when: "12 min ago", color: "cyan" },
  { player: "GLITCHA", game: "BRICK BUSTER", score: 28450, when: "18 min ago", color: "cyan" },
  { player: "ARKADYA", game: "SERPENT", score: 7820, when: "24 min ago", color: "green" },
  { player: "CYBER_LU", game: "FROGGIE", score: 18900, when: "31 min ago", color: "yellow" },
];

export const TOP_PLAYERS: TopPlayer[] = [
  { rank: 1, player: "NEONFOX", score: 312840 },
  { rank: 2, player: "PX_KAI", score: 248110 },
  { rank: 3, player: "M00NRYU", score: 196720 },
  { rank: 4, player: "VAULT_07", score: 154300 },
  { rank: 5, player: "GLITCHA", score: 138900 },
];

export const PRICING_FEATURES: string[] = [
  "Access to every game",
  "Global ranking and hall of fame",
  "No ads between games",
  "Save your scores",
  "New games every month",
  "Works in any browser",
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "IS IT REALLY FREE?",
    a: 'Yes. Arcade Vault is a non-profit project made out of love for the classics. There is no hidden "premium" version.',
  },
  {
    q: "DO I NEED AN ACCOUNT?",
    a: "No. You can play as a guest. If you want to save your score and appear in the ranking, sign up in 10 seconds.",
  },
  {
    q: "HOW DO YOU SURVIVE WITHOUT CHARGING?",
    a: "It is a community project. If you like it, share it. That is the only currency we accept.",
  },
];
