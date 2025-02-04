import { Fragment, MouseEvent, useContext } from "react";
import { DynamicFormContext } from "../../context/DynamicFormContext";
import { Option, SelectValues } from "../../types";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
//import IconButton from "@/app/components/common/icons/IconButton";
import { Button } from "primereact/button";

function OptionsEdit() {
  const { chosenEdited, setChosenEdited, setChosenId } =
    useContext(DynamicFormContext);
  if (!chosenEdited) return <></>;
  const hasSelectOptions =
    chosenEdited.type === "select" ||
    chosenEdited.type === "checkbox" ||
    chosenEdited.type === "multiselect" ||
    chosenEdited.type === "radio" ||
    chosenEdited.type === "treeselect";
  if (!hasSelectOptions) return;

  const valueOf = (option: Option): SelectValues => {
    return !hasSelectOptions
      ? ""
      : typeof option !== "object"
      ? option
      : option[chosenEdited.selectValue || "value"];
  };

  const labelOf = (option: Option): string => {
    return !hasSelectOptions
      ? ""
      : typeof option !== "object"
      ? String(option)
      : option[chosenEdited.selectLabel || "label"];
  };

  // Create
  const handleAddOption =
    (id: number, option?: "withLabel") => (evt: MouseEvent) => {
      evt.preventDefault();
      if (!hasSelectOptions) return;
      const _chosenEdited = { ...chosenEdited };
      _chosenEdited.selectOptions = _chosenEdited.selectOptions?.length
        ? _chosenEdited.selectOptions
        : [];
      const initValue =
        option || typeof _chosenEdited.selectOptions[0] === "object"
          ? {
              label: `Nouvelle option ${id + 1}`,
              value: id + 1,
            }
          : `Nouvelle option ${id + 1}`;
      id >= 0
        ? _chosenEdited.selectOptions.splice(id + 1, 0, initValue)
        : _chosenEdited.selectOptions.push(initValue);

      setChosenEdited(_chosenEdited);
    };

  // Delete
  const handleDeleteOption = (id: number) => (evt: any) => {
    setChosenEdited((v: any) => {
      if (!v) return v;

      return {
        ...v,
        selectOptions: v.selectOptions.filter(
          (f: any, id2: number) => id2 !== id
        ),
      };
    });
    setChosenId(undefined);
  };

  // Update
  const handleChangeOption =
    (id: number, key: "label" | "value") => (evt: any) => {
      if (!hasSelectOptions) return;
      const mapKey = {
        label: chosenEdited.selectLabel || "label",
        value: chosenEdited.selectValue || "value",
      };
      setChosenEdited((v: any) => {
        if (!v) return v;
        return {
          ...v,
          selectOptions: v.selectOptions.map((e: any, index: number) => {
            return id !== index
              ? e
              : typeof e !== "object"
              ? evt.target.value
              : { ...e, [mapKey[key]]: evt.target.value };
          }),
        };
      });
    };
  return (
    <div>
      <label className={`font-semibold text-sm pt-2`}>Options</label>
      {chosenEdited.selectOptions?.length ? (
        chosenEdited.selectOptions.map((option, id) => (
          <Fragment key={id}>
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1">
                {chosenEdited.type === "checkbox" ? (
                  <Checkbox checked={false} disabled={true}></Checkbox>
                ) : chosenEdited.type === "radio" ? (
                  <RadioButton></RadioButton>
                ) : (
                  <></>
                )}
                <InputText
                  className="p-1 w-full"
                  value={labelOf(option)}
                  onChange={handleChangeOption(id, "label")}
                ></InputText>
              </span>
              {typeof option === "object" && (
                <span className="">
                  <InputText
                    className="p-1 w-full"
                    value={String(valueOf(option))}
                    onChange={handleChangeOption(id, "value")}
                  ></InputText>
                </span>
              )}
              {/* <IconButton
                onClick={handleDeleteOption(id)}
                className="mgc_delete_fill text-red-500"
              ></IconButton> */}
            </div>
            <div
              className="h-2 hover:bg-gray-200"
              onClick={handleAddOption(id)}
            ></div>
          </Fragment>
        ))
      ) : (
        <div className="flex gap-2 items-center">
          <Button
            label="Nouvelle option"
            className="w-full md:w-1/2 lg:w-1/4 xl:w-1/6 p-1"
            outlined
            onClick={handleAddOption(-1)}
          ></Button>
          <Button
            label="Nouvelle option / valeur"
            className="w-full md:w-1/2 lg:w-1/4 xl:w-1/6 p-1"
            outlined
            onClick={handleAddOption(-1, "withLabel")}
          ></Button>
        </div>
      )}
    </div>
  );
}

export default OptionsEdit;

