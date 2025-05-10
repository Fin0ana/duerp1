import { memo } from "react";
import { TreeNodeWithData } from "../CustomTreeComponent";
import {
  InputNumber,
  InputNumberChangeEvent,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";

type PercentageTemplateProps = {
  node: TreeNodeWithData;
  onPercentChange?: (e: number, node: TreeNodeWithData) => void;
};

export const PercentageTemplate = memo(
  ({ node, onPercentChange }: PercentageTemplateProps) => {
    const percent = node.data.percent || 0;

    const handleChange = (event: InputNumberChangeEvent) => {
      const value = event.value || 0;
      onPercentChange?.(value, node);
    };

    const handleChangeValue = (event: InputNumberValueChangeEvent) => {
      const value = event.value || 0;
      onPercentChange?.(value, node);
    };

    const manualIndic = node.data.status === "manual" ? "bg-yellow-50 border" : ""

    return node.data.checked ? (
      <InputNumber
        tooltip="Taux d'occupation"
        inputId="horizontal-buttons"
        value={percent}
        onValueChange={handleChangeValue}
        className=""
        inputClassName={`text-[0.7rem] w-12  px-1 py-0 ${manualIndic}`}
        showButtons
        step={1}
        suffix="%"
        min={0}
        max={100}
        decrementButtonClassName="w-7"
        incrementButtonClassName="w-7"
        decrementButtonIcon="pi pi-chevron-down text-xs"
        incrementButtonIcon="pi pi-chevron-up text-xs"
        locale="fr-FR"
      />
    ) : (
      <></>
    );
  }
);
