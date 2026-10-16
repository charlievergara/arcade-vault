import Link from "next/link";

export default function GameNotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 24px" }}>
      <div className="pixel neon-magenta" style={{ fontSize: 20, marginBottom: 16 }}>
        GAME NOT FOUND
      </div>
      <p style={{ color: "var(--ink-dim)", marginBottom: 28 }}>
        This cartridge isn&apos;t in the vault. Check the link or pick a game from the library.
      </p>
      <Link href="/" className="btn">
        BACK TO THE VAULT
      </Link>
    </div>
  );
}
