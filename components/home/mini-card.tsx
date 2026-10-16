import Link from "next/link";
import type { Game } from "@/lib/data";
import styles from "./home.module.css";

export function MiniCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.id}`} className={styles["mini-card"]}>
      <div className={styles["mini-cover"]}>
        <div className={"cover-bg " + game.cover}></div>
      </div>
      <div className={styles["mini-meta"]}>
        <div className={styles["mini-title"]}>{game.title}</div>
        <div className={styles["mini-cat"]}>{game.cat}</div>
      </div>
    </Link>
  );
}
