"use client";

import { useEffect, useRef } from "react";
import styles from "./home.module.css";

// Root wrapper of the Home: fades sections in (.reveal -> .in) as they scroll into view.
export function Reveal({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    root.querySelectorAll(`.${styles.reveal}`).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`${styles.home} fade-in`}>
      {children}
    </div>
  );
}
