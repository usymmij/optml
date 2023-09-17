import AddNodes from "./add-nodes";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { LucideAlignHorizontalJustifyStart, LucideCombine } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import TrainDialog from "./train-dialog";

type FlowActionsProps = {
  id: string;
  onLayout: () => void;
  save: () => Promise<any>;
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
        <div className="flex flex-row justify-between gap-2 w-full">
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
        <TrainDialog id={props.id} save={props.save}>
          <Button size="lg" className="w-full">
            <div className="flex flex-row items-center gap-2">
              <LucideCombine />
              <p>Train</p>
            </div>
          </Button>
        </TrainDialog>
      </footer>
      <h1 className="absolute bottom-0 left-0 p-4 text-2xl">
        <span className="absolute svg-inline">
          <svg
            width="40"
            height="40"
            viewBox="0 0 170  170"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M92.6239 3.53789C88.4379 -0.648047 81.6512 -0.648044 77.4652 3.53789L3.53789 77.4653C-0.648047 81.6512 -0.648044 88.4379 3.53789 92.6239L77.4652 166.551C81.6512 170.737 88.4379 170.737 92.6239 166.551L166.551 92.6239C170.737 88.4379 170.737 81.6512 166.551 77.4652L92.6239 3.53789ZM60.9621 51.4476C59.0593 51.4476 57.5168 52.9902 57.5168 54.893V60.1406C57.5168 61.4565 58.2546 62.6002 59.3391 63.1804L43.794 97.8331H40.1537C38.2509 97.8331 36.7083 99.3756 36.7083 101.278V106.526C36.7083 108.429 38.2509 109.971 40.1537 109.971H45.4013C47.3041 109.971 48.8466 108.429 48.8466 106.526V101.278C48.8466 101.269 48.8465 101.259 48.8465 101.25L74.0599 83.4116L80.7488 98.1545C79.5733 98.7031 78.7587 99.8956 78.7587 101.278V106.526C78.7587 108.429 80.3012 109.971 82.204 109.971H87.4516C89.3544 109.971 90.8969 108.429 90.8969 106.526V101.278C90.8969 99.9232 90.1145 98.7508 88.9768 98.1882L95.9388 83.2894L122.109 102.786V106.526C122.109 108.429 123.652 109.971 125.555 109.971H130.802C132.705 109.971 134.248 108.429 134.248 106.526V101.278C134.248 99.3756 132.705 97.8331 130.802 97.8331H126.822L110.652 63.2307C111.79 62.6681 112.572 61.4957 112.572 60.1406V54.893C112.572 52.9902 111.03 51.4476 109.127 51.4476H103.879C101.977 51.4476 100.434 52.9902 100.434 54.893V60.1406C100.434 60.5558 100.508 60.9539 100.642 61.3226L85.4065 72.1016L69.648 60.3621C69.6526 60.2888 69.655 60.215 69.655 60.1406V54.893C69.655 52.9902 68.1125 51.4476 66.2097 51.4476H60.9621ZM83.1059 73.7292L68.4167 62.7863C68.2345 62.9384 68.0365 63.0721 67.8253 63.1844L75.16 79.3508L83.1059 73.7292ZM76.2875 81.8357L85.3659 75.4129L93.7448 81.6549L86.1849 97.8331H83.5455L76.2875 81.8357ZM72.9325 80.9267L65.0648 63.5859H62.0942L46.6298 98.0585C47.0446 98.2169 47.4209 98.4531 47.741 98.7493L72.9325 80.9267ZM87.6665 73.7852L102.24 63.4745L94.903 79.1762L87.6665 73.7852ZM122.481 99.7207L97.0971 80.8107L105.146 63.5859H107.86L124.03 98.1882C123.363 98.518 122.818 99.0576 122.481 99.7207Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="ml-12">opt</span>
        <span className="font-bold">ML</span>
      </h1>
    </>
  );
}

export default FlowActions;
