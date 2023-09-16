"use client";

import Flow from "@/components/flow";
import ThemeToggle from "@/components/theme-toggle";
import { ReactFlowProvider } from "reactflow";

export default function Maker({ params }: { params: { id: string } }) {
  return (
    <main className="h-screen relative">
      <ReactFlowProvider>
        <Flow id={params.id} />
      </ReactFlowProvider>
      <div className="absolute top-0 right-0 p-4 z-10">
        <ThemeToggle />
      </div>
    </main>
  );
}
