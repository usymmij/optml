"use client";

import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const newModel = () => {
    (async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create`);

      if (res.status === 200) {
        const id = res.data;
        router.push(`/maker/${id}`);
      }
    })();
  };

  return (
    <main className="h-screen flex flex-col justify-center items-center gap-10">
      <h1 className="text-3xl font-bold">optml</h1>
      <Button onClick={newModel}>Maker</Button>
    </main>
  );
}
