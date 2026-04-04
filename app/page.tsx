"use client";

import dynamic from "next/dynamic";

const RubiksCubeApp = dynamic(() => import("@/components/RubiksCubeApp"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-zinc-500 text-sm">Loading cube...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  return <RubiksCubeApp />;
}
