import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GamePlayer } from "@/components/game-player";
import { GAMES } from "@/lib/data";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export default function PlayPage({ params }: PageProps<"/games/[id]/play">) {
  return (
    <Suspense fallback={<div className="pixel neon-cyan" style={{ padding: 32 }}>LOADING…</div>}>
      <Player params={params} />
    </Suspense>
  );
}

async function Player({ params }: { params: PageProps<"/games/[id]/play">["params"] }) {
  const { id } = await params;
  const game = GAMES.find((g) => g.id === id);
  if (!game) notFound();

  return <GamePlayer gameId={game.id} gameTitle={game.title} />;
}
