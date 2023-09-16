import { PropsWithChildren } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { LucideBadgeInfo } from "lucide-react";

export default function InfoDialog(
  props: PropsWithChildren<{
    title: string;
    className?: string;
  }>
) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border-b border-secondary -mx-6 pb-2 flex flex-row w-full justify-center items-center gap-2 hover:cursor-pointer">
          <h2 className="text-lg font-semibold">{props.title}</h2>
          <LucideBadgeInfo className={props.className} size={16} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{props.title}</DialogTitle>
        {props.children}
      </DialogContent>
    </Dialog>
  );
}
