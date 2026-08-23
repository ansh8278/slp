"use client";

import { usePlayer } from "./Player";

export function PlayTrigger({
  videoId,
  title,
  children,
}: {
  videoId: string;
  title: string;
  children: React.ReactNode;
}) {
  const play = usePlayer();
  return (
    <div onClick={() => play({ youtubeId: videoId, title })} className="inline-block cursor-pointer">
      {children}
    </div>
  );
}
