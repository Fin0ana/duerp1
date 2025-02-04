import { FormEvent, useState } from "react";
import { NewTreePost } from "./PostWithStreaming";
import { showErrorToast } from "@/app/utils/toast";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

export function RawDisplayer({ perMeasure }: { perMeasure: NewTreePost[] }) {
  return (
    <div className="max-h-96 overflow-auto grid grid-cols-2">
      <div className="col-span-2">
        <div className="space-y-2">
          {perMeasure.map((per, id) => (
            <div key={`per-${id}`} className="border p-2">
              {per.name} - {per.workName} - {per.riskName} - {per.measureName}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FalseAdd({ onOk }: { onOk: (newItem: any) => void }) {
  const [value, setValue] = useState("");
  // const [error, setError] = useState("")
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      const obj = JSON.parse(value);
      onOk(obj);
    } catch (error) {
      showErrorToast("Doit être un object JSON");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-100 gap-2">
      <InputTextarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={10}
      />
      <Button type="submit" label="OK"></Button>
    </form>
  );
}


