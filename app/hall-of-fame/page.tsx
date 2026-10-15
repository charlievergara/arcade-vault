import Link from "next/link";
import { HallOfFame } from "@/components/hall-of-fame";

export default function HallOfFamePage() {
  return (
    <div className="av-hall fade-in">
      <div className="hall-head">
        <h1>HALL OF FAME</h1>
        <p className="pixel" style={{ fontSize: 10 }}>
          THE NAMES THAT NEVER LEAVE THE SCREEN
        </p>
      </div>

      <HallOfFame />

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link href="/" className="btn lg">
          BACK TO THE LIBRARY
        </Link>
      </div>
    </div>
  );
}
