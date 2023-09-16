import { useState } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { LucideXCircle } from "lucide-react";

type ShapeInputProps = {
  id?: string;
  value: number[];
  onChange: (value: number[]) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  disabled?: boolean;
  className?: string;
};

export default function ShapeInput(props: ShapeInputProps) {
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<number[]>(props.value);
  const [input, setInput] = useState<string>("");

  const setShape = (value: number[]) => {
    props.onChange(value);
    setValue(value);
  };

  const validateInput = (value: string) => {
    // Check if value is a number
    if (isNaN(Number(value))) {
      setError("Value must be a number");
      return;
    }

    // Check if value is an integer
    if (!Number.isInteger(Number(value))) {
      setError("Value must be an integer");
      return;
    }

    // Check if value is positive
    if (Number(value) < 0) {
      setError("Value must be positive");
      return;
    }

    setError("");
    setInput(value);
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        props.className
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {value.map((axis, index) => (
            <div
              key={index}
              onClick={() => setShape(value.filter((_, i) => i !== index))}
              className="flex flex-row items-center gap-1 px-1 bg-secondary rounded-lg hover:cursor-pointer"
            >
              <p>{axis}</p>
              <LucideXCircle size={14} />
            </div>
          ))}
        </div>
        <Input
          id={props.id}
          type="text"
          placeholder="Shape of input..."
          className="w-full focus-visible:ring-0 focus-visible:ring-offset-0"
          ref={props.inputRef}
          value={input}
          onChange={(e) => validateInput(e.target.value)}
          disabled={props.disabled}
          onKeyDown={(e) => {
            const trimmedInput = input.trim();
            const inputValue = Number(trimmedInput);

            if (e.key === "," || e.key === "Enter") {
              e.preventDefault();

              if (trimmedInput.length) {
                setInput("");
                setShape([...value, inputValue]);
              }
            }
          }}
        />
      </div>

      {error && <p className="text-destructive">{error}</p>}
    </div>
  );
}
