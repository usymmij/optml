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
  const [optimizer, setOptimizer] = useState("rmsprop");
  const [loss, setLoss ] = useState("mae");
  const [epochs, setEpochs] = useState(1);
  const [batchSize, setBatchSize] = useState(1);
  const [open, setOpen] = useState(false);

  const handleRun = () => {
    (async () => {
      await props.save();

      const form = new FormData();
      form.append("optimizer", optimizer);
      form.append("loss", loss);
      form.append("training_data", trainingData as File);
      form.append("epochs", epochs.toString());
      form.append("batch_size", batchSize.toString());

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
        <div className="flex flex-row gap-4 items-center justify-between">
          <div className="flex flex-col gap-4 flex-grow">
            <Label>Epochs</Label>
            <Input
              type="number"
              className="w-full"
              placeholder="Number of epochs..."
              min="1"
              value={epochs}
              onChange={(e) => {
                setEpochs(parseInt(e.target.value));
              }}
            />
          </div>
          <div className="flex flex-col gap-4 flex-grow">
            <Label>Batch Size</Label>
            <Input
              type="number"
              className="w-full"
              placeholder="Batch size..."
              min="1"
              value={batchSize}
              onChange={(e) => {
                setBatchSize(parseInt(e.target.value));
              }}
            />
          </div>
        </div>

        <Label>Optimizer</Label>
        <Select
          defaultValue="rmsprop"
          value={optimizer}
          onValueChange={setOptimizer}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select optimization method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rmsprop">RMS Propagation</SelectItem>
            <SelectItem value="adam">Adam</SelectItem>
            <SelectItem value="sgd">Stochastic Gradient Descent</SelectItem>
          </SelectContent>
        </Select>
        <Label>Loss</Label>
        <Select
          defaultValue="loss"
          value={loss}
          onValueChange={setLoss}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select loss metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="binary_crossentropy">Binary Crossentropy: classification with 2 categories</SelectItem>
            <SelectItem value="categorical_crossentropy">Categorical Crossentropy: classification with more than 2 categories</SelectItem>
            <SelectItem value="mean_squared_error">Mean Square Error</SelectItem>
            <SelectItem value="mean_absolute_error">Mean Absolute Error</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            onClick={handleRun}
            disabled={
              !trainingData ||
              !optimizer ||
              !epochs ||
              epochs < 0 ||
              !batchSize ||
              batchSize < 0
            }
          >
            Train
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
