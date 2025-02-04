import { KeyString } from "@/app/modules/utils/types";
import { LabelValue, SelectValues, TDynamicForm } from "../../types";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import React from "react";

type CheckboxGroupProps = {
  value?: SelectValues[];
  onChange: (i: CheckboxChangeEvent) => void;
  modelValue: SelectValues[];
  options: KeyString[];
  id: string;
  alignement?: string;
  invalid?: boolean;
  selectLabel?: string;
  selectValue?: string;
  disabled: boolean;
  optionTitle?: string | ((v: SelectValues | KeyString) => string);
  onCheck?: (value: SelectValues) => void;
  onUncheck?: (value: SelectValues) => void;
};

function CheckboxGroup({
  value,
  onChange,
  options,
  id,
  alignement = "horizontal",
  invalid,
  selectLabel,
  selectValue,
  disabled,
  optionTitle,
  onCheck,
  onUncheck,
}: CheckboxGroupProps) {
  const valueOf = (option: KeyString | SelectValues): SelectValues =>
    typeof option !== "object" ? option : option[selectValue || "value"];
  const labelOf = (option: KeyString | SelectValues): string =>
    typeof option !== "object"
      ? String(option)
      : option[selectLabel || "label"];
  const titleOf = (option: KeyString | SelectValues): string | undefined => {
    if (!optionTitle) return;
    return typeof optionTitle === "string" ? optionTitle : optionTitle(option);
  };
  const onChangeIntercept = (e: CheckboxChangeEvent) => {
    e.checked ? onCheck?.(e.value) : onUncheck?.(e.value);
    onChange(e);
  };

  return (
    <div
      className={`flex ${
        alignement === "vertical" ? "flex-col" : "flex-row flex-wrap"
      } gap-3`}
    >
      {options.map((option) => (
        <div
          key={"" + valueOf(option)}
          className="flex items-center"
          title={titleOf(option)}
        >
          <Checkbox
            checked={value?.includes(valueOf(option)) || false}
            onChange={onChangeIntercept}
            inputId={`${id}-${valueOf(option)}`}
            name={labelOf(option)}
            value={valueOf(option)}
            className={invalid ? "p-invalid" : ""}
            disabled={disabled}
          ></Checkbox>
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

export default CheckboxGroup;
