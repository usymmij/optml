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
        <LucideBadgeInfo className={props.className} size={16} />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{props.title}</DialogTitle>
        {props.children}
      </DialogContent>
    </Dialog>
  );
}
