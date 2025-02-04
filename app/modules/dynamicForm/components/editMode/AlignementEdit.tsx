import { useContext } from "react";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import { DynamicFormContext } from "../../context/DynamicFormContext";

function AlignementEdit() {
  const { chosenEdited, setChosenEdited } = useContext(DynamicFormContext);

  if (!chosenEdited) return <></>;
  const hasAlignement =
    chosenEdited.type === "checkbox" || chosenEdited.type === "radio";
  if (!hasAlignement) return <></>;

  const handleChangeAlignement = (evt: RadioButtonChangeEvent) => {
    setChosenEdited(() => ({ ...chosenEdited, alignement: evt.target.value }));
  };

  return (
    <>
      <label className={`font-semibold text-sm pt-2`}>Alignement</label>
      <div className="flex flex-wrap gap-3">
        <div>
          <RadioButton
            inputId="radio-horizontal"
            checked={chosenEdited.alignement === "horizontal"}
            value={"horizontal"}
            onChange={handleChangeAlignement}
          ></RadioButton>
          <label htmlFor="radio-horizontal" className="ml-1">Horizontal</label>
        </div>
        <div>
          <RadioButton
            inputId="radio-vertical"
            checked={chosenEdited.alignement === "vertical"}
            value={"vertical"}
            onChange={handleChangeAlignement}
          ></RadioButton>
          <label htmlFor="radio-vertical" className="ml-1">Vertical</label>
        </div>
      </div>
    </>
  );
}

export default AlignementEdit;


