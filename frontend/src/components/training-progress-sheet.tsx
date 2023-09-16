import { useState } from "react";
import useWebSocket from "react-use-websocket";

type TrainingProgress = {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: "running" | "stopped" | "finished";
  created_at: string;
  updated_at: string;
};

export default function TrainingProgressSheet({ id }: { id: string }) {
  const [progress, setProgress] = useState<TrainingProgress | null>(null);

  useWebSocket(`ws://localhost:8000/ws/${id}`, {
    onMessage: (event) => {
      setProgress(JSON.parse(event.data));
    },
  });
}
