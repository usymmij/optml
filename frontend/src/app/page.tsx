import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex flex-col justify-center items-center gap-10">
      <h1 className="text-3xl font-bold">optml</h1>
      <Link href='/maker'>
        <Button>Maker</Button>
      </Link>
    </main>
  );
}
