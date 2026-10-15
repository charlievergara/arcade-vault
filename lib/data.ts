export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type GameColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string;
  title: string;
  short: string;
  long: string;
  cat: Category;
  cover: string;
  color: GameColor;
  best: number;
  plays: string;
};

export type ScoreRow = {
  rank: number;
  name: string;
  score: number;
  date: string; // "YYYY-MM-DD"
};

export const GAMES: Game[] = [
  {
    id: "brick-buster",
    title: "BRICK BUSTER",
    short: "Bounce the ball and smash neon walls.",
    long: "Pilot a paddle-ship and bounce a plasma core to pulverize walls of chromatic bricks. Every level reshuffles the grid into impossible patterns. How long can your streak last?",
    cat: "ARCADE",
    cover: "cover-bricks",
    color: "cyan",
    best: 28450,
    plays: "12.4K",
  },
  {
    id: "drop",
    title: "DROP",
    short: "Fit the pieces before the ceiling crushes you.",
    long: "Geometric pieces fall from the dark. Rotate them, lock them in and clear lines to survive. The speed ramps up relentlessly every 10 lines.",
    cat: "PUZZLE",
    cover: "cover-tetro",
    color: "magenta",
    best: 184220,
    plays: "31.8K",
  },
  {
    id: "serpent",
    title: "SERPENT",
    short: "Grow without biting your own tail.",
    long: "A snake of light crawls across the grid hunting magenta cores. Every bite makes it longer and faster. One wrong move and it devours itself.",
    cat: "ARCADE",
    cover: "cover-snake",
    color: "green",
    best: 7820,
    plays: "9.1K",
  },
  {
    id: "chomper",
    title: "CHOMPER",
    short: "Gobble dots and escape the ghosts.",
    long: "A hungry circle patrols a maze collecting glowing dots. Four specters chase it, but every so often a power pill turns the tables.",
    cat: "ARCADE",
    cover: "cover-glot",
    color: "yellow",
    best: 96400,
    plays: "27.2K",
  },
  {
    id: "invaders",
    title: "INVADERS",
    short: "Defend the planet from rows of aliens.",
    long: "Waves of hostile pixels descend formation after formation. Slide your cannon sideways and fire with precision before they touch the surface.",
    cat: "SHOOTER",
    cover: "cover-invaders",
    color: "green",
    best: 54190,
    plays: "18.0K",
  },
  {
    id: "rocks",
    title: "ROCKS",
    short: "Pulverize asteroids in zero gravity.",
    long: "Your triangular ship drifts in absolute vacuum. Shoot and rotate to split rocks into ever smaller fragments. Watch out for UFOs on the horizon.",
    cat: "SHOOTER",
    cover: "cover-rocas",
    color: "yellow",
    best: 41200,
    plays: "15.6K",
  },
  {
    id: "froggie",
    title: "FROGGIE",
    short: "Cross the pixel highway.",
    long: "Hop between lanes of speeding cars and drifting logs on the river. Reach the lily pads before time runs out.",
    cat: "ARCADE",
    cover: "cover-rana",
    color: "green",
    best: 18900,
    plays: "6.4K",
  },
  {
    id: "pixel-duel",
    title: "PIXEL DUEL",
    short: "Two paddles. One ball. Maximum reflexes.",
    long: "The purest duel: two vertical paddles fight over a glowing ball. Play solo against the CPU or local two-player.",
    cat: "VERSUS",
    cover: "cover-duelo",
    color: "cyan",
    best: 24,
    plays: "4.2K",
  },
];

export const CATEGORIES = ["ALL", "ARCADE", "PUZZLE", "SHOOTER", "VERSUS"] as const satisfies readonly ["ALL", ...Category[]];

const PLAYERS = [
  "PX_KAI", "NEONFOX", "Z3R0COOL", "M00NRYU", "VAULT_07", "GLITCHA",
  "ATARI_KID", "CYBER_LU", "MAGENTA88", "SCANLINE", "BIT_LORD", "ARKADYA",
  "DROID_X", "RGB_QUEEN", "PIXEL_DAD", "RETROVIRA", "VECTORX", "JOY_STK",
];

export function seededScores(seed: number, count = 12): ScoreRow[] {
  let s = seed;
  const rand = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const used = new Set<string>();
  const rows: ScoreRow[] = [];
  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = PLAYERS[Math.floor(rand() * PLAYERS.length)];
    } while (used.has(name) && used.size < PLAYERS.length);
    used.add(name);
    const base = Math.floor(50000 + rand() * 250000);
    const score = base - i * Math.floor(2000 + rand() * 4000);
    const day = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
    const mon = String(1 + Math.floor(rand() * 12)).padStart(2, "0");
    rows.push({ rank: i + 1, name, score: Math.max(score, 1000), date: `2026-${mon}-${day}` });
  }
  return rows
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
