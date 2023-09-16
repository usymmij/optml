import AddNodes from "./add-nodes";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { LucideAlignHorizontalJustifyStart, LucidePlay } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Progress } from "./ui/progress";

type FlowActionsProps = {
  onLayout: () => void;
  onRun: () => void;
  className?: string;
};

function FlowActions(props: FlowActionsProps) {
  return (
    <>
      <footer
        className={cn(
          "absolute bottom-0 right-0 p-4 flex flex-col gap-2 items-center",
          props.className
        )}
      >
        <div className="flex flex-row justify-between gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" onClick={props.onLayout}>
                  <LucideAlignHorizontalJustifyStart />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Horizontal Layout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AddNodes />
        </div>
        <Button size="lg" className="w-full" onClick={props.onRun}>
          <div className="flex flex-row">
            <LucidePlay />
            <p>Run</p>
          </div>
        </Button>
      </footer>
      <h1 className="absolute bottom-0 left-0 p-4 text-2xl">
        opt<span className="font-bold">ML</span>
      </h1>
    </>
  );
}

export default FlowActions;
