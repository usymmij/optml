import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import axios from "axios";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ScrollArea } from "./ui/scroll-area";

export default function TrainingProgressSheet({
  id,
  run_id,
  epochs,
  isOpen,
  setOpen,
}: {
  id: string;
  run_id: string | null;
  epochs: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [data, setData] = useState<any[]>([]);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const fetchProgress = () => {
      if (progress?.toString() === "100" || !run_id) {
        clearInterval(fetchInterval);
        return;
      }

      (async () => {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/model/${id}/stats`,
          {
            params: {
              run_id: run_id,
            },
          }
        );

        if (res.status === 200) {
          const data = await res.data;
          console.log(data);
          setData(data);
          setProgress((data.length / epochs) * 100);
        }
      })();
    };

    const fetchInterval = setInterval(fetchProgress, 1000);
    return () => clearInterval(fetchInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, run_id, epochs, progress]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setProgress(null);
        setOpen(open);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Training</SheetTitle>
          <SheetDescription>
            The model is currently training. This may take a while.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-4 pt-4">
            <Label>Progress</Label>
            <div className="flex flex-row gap-4 w-full items-center">
              <Progress className="flex-grow" value={progress || 0} />
              <p>{progress}%</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 pt-4">
            <Label>Accuracy</Label>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={data
                  .sort((a, b) => {
                    return a.epoch - b.epoch;
                  })
                  .map((val) => {
                    const epoch = val.epoch;
                    const accuracy = val.accuracy;
                    return { name: epoch, accuracy: accuracy };
                  })}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="name" name="Epoch" />
                <YAxis />
                <Tooltip
                  allowEscapeViewBox={{ x: true, y: false }}
                  contentStyle={{ backgroundColor: "", color: "" }}
                  wrapperClassName="rounded-lg text-foreground bg-background/80 backdrop-blur-md"
                  labelClassName="font-bold text-lg pb-2 text-foreground"
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Accuracy"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-4 pt-4">
            <Label>Loss</Label>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={data
                  .sort((a, b) => {
                    return a.epoch - b.epoch;
                  })
                  .map((val) => {
                    const epoch = val.epoch;
                    const loss = val.loss;
                    return { name: epoch, loss: loss };
                  })}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="name" name="Epoch" />
                <YAxis />
                <Tooltip
                  allowEscapeViewBox={{ x: true, y: false }}
                  contentStyle={{ backgroundColor: "", color: "" }}
                  wrapperClassName="rounded-lg text-foreground bg-background/80 backdrop-blur-md"
                  labelClassName="font-bold text-lg pb-2 text-foreground"
                />
                <Area
                  type="monotone"
                  dataKey="loss"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Loss"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
