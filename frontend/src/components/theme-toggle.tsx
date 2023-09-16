"use client";

import { LucideMoon, LucideSun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggle({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Button className={className} size="icon" />;

  return (
    <Button
      className={className}
      size="icon"
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
    >
      {resolvedTheme === "dark" ? <LucideSun /> : <LucideMoon />}
    </Button>
  );
}

export default ThemeToggle;
