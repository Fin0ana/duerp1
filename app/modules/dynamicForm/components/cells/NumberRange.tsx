import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { NumberRangeValue } from "../../types";

type NumberRangeProps = {
  value?: NumberRangeValue;
  onChange: (v: NumberRangeValue) => void;
  id: string;
  alignement?: "vertical" | "horizontal";
  invalid?: boolean;
  disabled?: boolean;
  toLabel?: string;
  fromLabel?: string;
  inputClassName: string;
};

function NumberRange({
  value,
  onChange,
  alignement = "horizontal",
  id,
  invalid,
  disabled,
  toLabel,
  fromLabel,
  inputClassName,
}: NumberRangeProps) {
  const handleChange =
    (key: "to" | "from") => (evt: InputNumberValueChangeEvent) => {
      const difference =
        key === "from"
          ? (value?.to ?? 0) - (evt.value ?? 0)
          : (evt.value ?? 0) - (value?.from ?? 0);
      if (!value) {
        const DEFAULT_NUMBER_RANGE_VALUE: NumberRangeValue = {
          from: 0,
          to: 1,
          difference: 1,
        };
        onChange({
          ...DEFAULT_NUMBER_RANGE_VALUE,
          [key]: evt.value,
          difference,
        });
        return;
      }

      onChange({ ...value, [key]: evt.value, difference });
    };
  return (
    <div
      className={`w-full grid gap-2 ${
        alignement === "vertical" ? "grid-cols-1" : "grid-cols-2"
      }`}
    >
      <div className="col-span-1">
        <div className="p-inputgroup flex-1">
          {fromLabel && <span className="p-inputgroup-addon">{fromLabel}</span>}
          <InputNumber
            inputId={`from-${id}`}
            disabled={disabled}
            className="w-full"
            inputClassName={`${inputClassName} ${invalid ? "p-invalid" : ""}`}
            max={value?.to ?? 1}
            value={value?.from ?? 0}
            onValueChange={handleChange("from")}
          ></InputNumber>
        </div>
      </div>
      <div className="col-span-1">
        <div className="p-inputgroup flex-1">
          {toLabel && <span className="p-inputgroup-addon">{toLabel}</span>}
          <InputNumber
            inputId={`to-${id}`}
            disabled={disabled}
            className="w-full"
            inputClassName={"w-full" + (invalid ? "p-invalid" : "")}
            min={value?.from ?? 0}
            value={value?.to ?? 1}
            onValueChange={handleChange("to")}
          ></InputNumber>
        </div>
      </div>
    </div>
  );
}

export default NumberRange;


