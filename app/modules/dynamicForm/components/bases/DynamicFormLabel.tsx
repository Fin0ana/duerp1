import { InputText } from "primereact/inputtext";
import { useIdFor } from "../../composables/hydrateAttrs";
import { FormType, TDynamicForm } from "../../types";
import { ChangeEvent, useContext, useMemo } from "react";
import { DynamicFormContext } from "../../context/DynamicFormContext";

type DynamicFormLabelProps = {
  item: TDynamicForm;
  id: number;
};

function DynamicFormLabel({ item, id: itemId }: DynamicFormLabelProps) {
  // Context
  const { id, chosenEdited, setChosenEdited, chosenId } =
    useContext(DynamicFormContext);
  // Change label
  const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    if (!chosenEdited) return;
    setChosenEdited({ ...chosenEdited, label: e.target.value });
  };
  // Change id
  const handleChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    if (!chosenEdited) return;
    setChosenEdited({ ...chosenEdited, id: e.target.value });
  };

  // Computed
  const idFor = (item: TDynamicForm) => useIdFor(id, item);
  const withLabel = (type: TDynamicForm["type"]) =>
    type !== "checkbox" && type !== "radio";
  const isChosen = useMemo(() => chosenId === itemId, [chosenId]);

  return (
    <>
      {!isChosen ? (
        <label
          htmlFor={withLabel(item.type) ? idFor(item) : "no"}
          className={`${
            withLabel(item.type) ? "" : "mb-2"
          } font-semibold text-sm mb-1`}
        >
          {item.label}{" "}
          {typeof item.label === "string" &&
          typeof item.validation === "string" &&
          item.validation.includes("required") ? (
            <span className="text-red-500">*</span>
          ) : null}
        </label>
      ) : (
        <div className="flex gap-1">
          <div className="flex flex-col w-full">
            <label
              htmlFor={`label-${idFor(item)}`}
              className={`font-semibold text-sm`}
            >
              Libellé
            </label>
            <InputText
              className="font-semibold text-base p-1 mb-1"
              id={`label-${idFor(item)}`}
              value={chosenEdited?.label || ""}
              onChange={handleChangeLabel}
            ></InputText>
          </div>
          <div className="flex flex-col w-full">
            <label
              htmlFor={`id-${idFor(item)}`}
              className={`font-semibold text-sm`}
            >
              ID
            </label>
            <InputText
              className="font-semibold text-base p-1 mb-1"
              id={`id-${idFor(item)}`}
              value={chosenEdited?.id || ""}
              onChange={handleChangeId}
            ></InputText>
          </div>
        </div>
      )}
    </>
  );
}

export default DynamicFormLabel;



