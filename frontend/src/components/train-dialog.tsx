import { PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";

export default function TrainDialog(
  props: PropsWithChildren<{
    id: string;
    save: () => Promise<any>;
  }>
) {
  const { toast } = useToast();
  const [trainingData, setTrainingData] = useState<File | null>(null);
  const [value, setValue] = useState("rmsprop");
  const [open, setOpen] = useState(false);

  const handleRun = () => {
    (async () => {
      await props.save();

      const form = new FormData();
      form.append("optimizer", value);
      form.append("training_data", trainingData as File);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/train/${props.id}`,
          form
        );

        if (res.status === 200) {
          setOpen(false);
        } else {
          toast({
            title: "Could start compilation",
            variant: "destructive",
            description:
              "Could not start the compilation of the model. Please try again.",
            duration: 3000,
          });
        }
      } catch (err) {
        toast({
          title: "Could start compilation",
          variant: "destructive",
          description:
            "Could not start the compilation of the model. Please try again.",
          duration: 3000,
        });
      }
    })();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Train opt<b>ML</b> Model
          </DialogTitle>
          <DialogDescription>
            Train your model to run remotely.
          </DialogDescription>
        </DialogHeader>
        <Label>Training Data Set</Label>
        <Input
          type="file"
          accept=".npy,.npz"
          onChange={(e) => {
            if (e.target.files) {
              setTrainingData(e.target.files[0]);
            }
          }}
        />
        <Label>Optimizer</Label>
        <Select defaultValue="rmsprop" value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select optimization method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rmsprop">RMS Propagation</SelectItem>
            <SelectItem value="adam">Adam</SelectItem>
            <SelectItem value="sgd">Stochastic Gradient Descent</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button onClick={handleRun} disabled={!trainingData || !value}>
            Train
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
