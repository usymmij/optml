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
    <main className="h-screen flex flex-col justify-between">
      <header className="flex flex-col justify-center items-center gap-4 flex-grow">
        <h1 className="text-3xl font-semibold">optml</h1>
        <h2>a machine learning educational tool.</h2>
      </header>
      <footer className="flex flex-col justify-center items-center mb-20">
        <Button size="lg" onClick={newModel}>
          Launch
        </Button>
      </footer>
    </main>
  );
}
