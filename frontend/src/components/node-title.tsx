import { cn } from "@/lib/utils";
import InfoDialog from "./info-dialog";
import { ReactNode } from "react";

export default function NodeTitle({
  title,
  description,
  className,
}: {
  title: string;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className="border-b border-secondary pb-2 -mx-6">
      <h2
        className={cn(
          "text-lg  font-semibold flex flex-row w-full justify-center items-center gap-2 ",
          className
        )}
      >
        {title}
        {description && (
          <InfoDialog
            title={title}
            className="text-primary hover:cursor-pointer"
          >
            {description}
          </InfoDialog>
        )}
      </h2>
    </div>
  );
}
