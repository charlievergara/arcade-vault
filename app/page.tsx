import Link from "next/link";
import { FeatureIcon } from "@/components/home/feature-icon";
import styles from "@/components/home/home.module.css";
import { MiniCard } from "@/components/home/mini-card";
import { Reveal } from "@/components/home/reveal";
import { Silhouettes } from "@/components/home/silhouettes";
import { GAMES } from "@/lib/data";
import {
  ACTIVITY,
  FAQ,
  FEATURES,
  HOME_STATS,
  PRICING_FEATURES,
  TOP_PLAYERS,
} from "@/lib/home-data";

const section = `${styles["home-section"]} ${styles.reveal}`;

function SectionHead({
  kicker,
  color,
  title,
}: {
  kicker: string;
  color: "cyan" | "magenta" | "yellow" | "green";
  title: string;
}) {
  return (
    <div className={styles["section-head"]}>
      <div className={`${styles.kicker} pixel neon-${color}`}>{kicker}</div>
      <h2 className={styles["section-title"]}>{title}</h2>
      <div className={styles["section-rule"]}></div>
    </div>
  );
}

export default function Home() {
  return (
    <Reveal>
      {/* HERO */}
      <section className={styles["home-hero"]}>
        <Silhouettes />
        <div className={styles["home-hero-inner"]}>
          <div className={`${styles["hero-eyebrow"]} pixel neon-yellow`}>
            ▸ INSERT A COIN<span className="blink">_</span>
          </div>
          <h1 className={styles["home-title"]}>
            <span className={styles["line-1"]}>THE CLASSIC</span>
            <span className={styles["line-2"]}>ARCADE IS</span>
            <span className={styles["line-3"]}>BACK</span>
          </h1>
          <p className={styles["home-sub"]}>
            Play the best classics right in your browser.
            <br />
            No downloads. No cost. Just fun.
          </p>
          <div className={styles["home-ctas"]}>
            <Link href="/games" className="btn xl pulse">
              ▶&nbsp; EXPLORE GAMES
            </Link>
            <Link href="/auth" className="btn xl magenta">
              ✦&nbsp; CREATE ACCOUNT
            </Link>
          </div>
        </div>
        <div className={styles["hero-scroll"]} aria-hidden="true">
          <span>SCROLL</span>
          <span className={styles.arrow}>▼</span>
        </div>
      </section>

      {/* WHY */}
      <section className={section}>
        <SectionHead kicker="// 01" color="magenta" title="WHY ARCADE VAULT?" />
        <div className={styles["feature-grid"]}>
          {FEATURES.map((f, i) => (
            <div
              key={f.icon}
              className={`${styles["feature-card"]} ${styles[f.color]}`}
              style={{ transitionDelay: i * 80 + "ms" }}
            >
              <FeatureIcon kind={f.icon} />
              <div className={`${styles["ft-title"]} pixel`}>{f.title}</div>
              <div className={styles["ft-desc"]}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GAMES PREVIEW */}
      <section className={section}>
        <SectionHead kicker="// 02" color="cyan" title="GAMES AVAILABLE NOW" />
        <div className={styles["mini-rail"]}>
          {GAMES.slice(0, 6).map((g) => (
            <MiniCard key={g.id} game={g} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/games" className="btn lg">
            VIEW ALL GAMES →
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className={`${styles["home-stats"]} ${styles.reveal}`}>
        <div className={styles["stats-inner"]}>
          {HOME_STATS.map((st, i) => (
            <div
              key={st.unit}
              className={styles["stat-block"]}
              style={{ transitionDelay: i * 90 + "ms" }}
            >
              <div className={`${styles["stat-n"]} neon-yellow`}>{st.n}</div>
              <div className={`${styles["stat-u"]} pixel`}>{st.unit}</div>
              <div className={styles["stat-s"]}>{st.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT ACTIVITY / LEADERBOARD */}
      <section className={section}>
        <SectionHead kicker="// 03" color="yellow" title="LIVE ACTIVITY" />
        <div className={styles["activity-grid"]}>
          <div className={styles["activity-card"]}>
            <div className={styles["ac-head"]}>
              <div className={`${styles["ac-title"]} pixel`}>▸ LATEST SCORES</div>
            </div>
            <div className={styles.ticker}>
              {ACTIVITY.map((r, i) => (
                <div
                  key={r.player}
                  className={styles["tick-row"]}
                  style={{ animationDelay: i * 60 + "ms" }}
                >
                  <span className={`${styles["tk-p"]} neon-${r.color}`}>{r.player}</span>
                  <span className={styles["tk-mid"]}>▸ {r.game}</span>
                  <span className={styles["tk-s"]}>+{r.score.toLocaleString("en-US")}</span>
                  <span className={styles["tk-t"]}>{r.when}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles["activity-card"]}>
            <div className={styles["ac-head"]}>
              <div className={`${styles["ac-title"]} pixel neon-magenta`}>
                ▸ TOP PLAYERS · TODAY
              </div>
              <Link href="/hall-of-fame" className={styles["lb-link"]}>
                VIEW HALL →
              </Link>
            </div>
            <div className={styles["top-list"]}>
              {TOP_PLAYERS.map((r, i) => (
                <div
                  key={r.player}
                  className={`${styles["top-row"]}${
                    i < 3 ? " " + styles[`top${i + 1}`] : ""
                  }`}
                >
                  <span className={styles["tp-rk"]}>#{String(r.rank).padStart(2, "0")}</span>
                  <span className={styles["tp-bar"]}>
                    <span
                      className={styles["tp-fill"]}
                      style={{ width: 100 - i * 16 + "%" }}
                    ></span>
                  </span>
                  <span className={styles["tp-p"]}>{r.player}</span>
                  <span className={styles["tp-s"]}>{r.score.toLocaleString("en-US")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={section}>
        <SectionHead kicker="// 04" color="green" title="PRICING" />
        <div className={styles["pricing-grid"]}>
          <div className={styles["price-card"]}>
            <div className={`${styles["pc-label"]} pixel`}>SINGLE PLAN</div>
            <div className={`${styles["pc-name"]} pixel`}>VAULT PLAYER</div>
            <div className={styles["pc-amount"]}>
              <span className={styles["pc-amount-n"]}>$0</span>
              <span className={styles["pc-amount-u"]}>/ FOREVER</span>
            </div>
            <div className={styles["pc-tag"]}>NO TRICKS · NO FINE PRINT</div>
            <ul className={styles["pc-list"]}>
              {PRICING_FEATURES.map((p) => (
                <li key={p}>✔ {p}</li>
              ))}
            </ul>
            <Link href="/auth" className="btn xl pulse" style={{ width: "100%" }}>
              START FREE →
            </Link>
            <div className={styles["pc-foot"]}>We don&apos;t ask for a card. We never will.</div>
            <div className={`${styles["pc-stamp"]} pixel`}>
              FREE
              <br />
              PLAY
            </div>
          </div>

          <div className={styles["pricing-faq"]}>
            {FAQ.map((item) => (
              <div key={item.q} className={styles["faq-item"]}>
                <div className={`${styles["faq-q"]} pixel`}>{item.q}</div>
                <div className={styles["faq-a"]}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={`${styles["home-final"]} ${styles.reveal}`}>
        <h2 className={`${styles["final-title"]} pixel`}>READY TO PLAY?</h2>
        <Link href="/games" className={`btn xl pulse ${styles["final-cta"]}`}>
          INSERT COIN →
        </Link>
        <div className={styles["final-tag"]}>
          Free. No sign-up required. Start in seconds.
        </div>
      </section>
    </Reveal>
  );
}
