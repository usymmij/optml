import { cn } from "@/lib/utils";

export default function NodeTitle({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-lg border-b border-secondary font-semibold text-center pb-2 -mx-6",
        className
      )}
    >
      {title}
    </h2>
  );
}
