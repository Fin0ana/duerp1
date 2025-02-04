import { KeyString } from "@/app/modules/utils/types";
import { LabelValue, SelectValues } from "../../types";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";

type RadioGroupProps = {
  value?: SelectValues;
  onChange: (i: RadioButtonChangeEvent) => void;
  options: (LabelValue | SelectValues)[];
  id: string;
  alignement?: "vertical" | "horizontal";
  invalid?: boolean;
  selectLabel?: string;
  selectValue?: string;
  disabled: boolean;
};

function RadioGroup({
  value,
  onChange,
  options,
  id,
  alignement = "horizontal",
  invalid,
  selectLabel,
  selectValue,
  disabled,
}: RadioGroupProps) {
  const valueOf = (option: KeyString | SelectValues): SelectValues =>
    typeof option !== "object" ? option : option[selectValue || "value"];
  const labelOf = (option: KeyString | SelectValues): string =>
    typeof option !== "object"
      ? String(option)
      : option[selectLabel || "label"];

  return (
    <div
      className={`flex ${
        alignement === "vertical" ? "flex-col" : "flex-row flex-wrap"
      } gap-3`}
    >
      {options.map((option) => (
        <div key={"" + valueOf(option)} className="flex items-center">
          <RadioButton
            checked={value === valueOf(option)}
            onChange={onChange}
            inputId={`${id}-${valueOf(option)}`}
            name={labelOf(option)}
            value={valueOf(option)}
            className={invalid ? "p-invalid" : ""}
            disabled={disabled}
          ></RadioButton>
          <label
            htmlFor={`${id}-${valueOf(option)}`}
            className="ml-2 cursor-pointer"
          >
            {labelOf(option)}
          </label>
        </div>
      ))}
    </div>
  );
}

export default RadioGroup;

