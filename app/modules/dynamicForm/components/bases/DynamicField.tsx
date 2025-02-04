import { Skeleton } from "primereact/skeleton";
import { useValidation } from "../../composables/validation";
import { FormType, TDynamicForm } from "../../types";
import DynamicFormCore from "./DynamicFormCore";
import DynamicFormLabel from "./DynamicFormLabel";
import ErrorMessage from "../cells/ErrorMessage";
import { EventHandler, useContext, useMemo } from "react";
import { DynamicFormContext } from "../../context/DynamicFormContext";
import IconButton from "@/app/components/common/icons/IconButton";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { FIELDS_TYPES } from "../../composables/changeFieldType";
import AdditionnalInfos from "../editMode/AdditionnalInfos";
type DynamicFieldProps = {
  item: TDynamicForm;
  id: number;
};
function DynamicField({ item, id }: DynamicFieldProps) {
  const {
    getLoading,
    globalMode,
    setChosenEdited,
    chosenEdited,
    chosenId,
    setChosenId,
    setValue,
    value,
    id: formId
  } = useContext(DynamicFormContext);
  const { errorsTouched } = useValidation();

  // Computed
  const isQuestionMode = useMemo(() => globalMode === "question", [globalMode]);
  const isChosen = useMemo(() => chosenId === id, [chosenId]);

  // Loading
  const skeletonHeight = (item: TDynamicForm) => {
    if (item.type === "textarea") return "85.6px";
    if (item.type === "file") return "76px";
    if (item.type === "checkbox" || item.type === "radio") return "22px";
    return "45.6px";
  };

  // Set item mode
  const handleChangeMode = () => {
    if (!isChosen) {
      setChosenEdited(item);
      setChosenId(id);
      return;
    }
    setValue?.((preVal) =>
      preVal.map((prevItem, id2) => {
        if (!chosenEdited) return prevItem;
        return id === id2 ? chosenEdited : prevItem;
      })
    );

    resetChosen();
  };

  const handleCrux = () => {
    if (!isChosen) return;
    resetChosen();
  };

  const resetChosen = () => {
    setChosenEdited(undefined);
    setChosenId(undefined);
  };

  const handleChangeType = (e: DropdownChangeEvent) => {
    const type = e.target.value;

    setChosenEdited((val) => {
      if (!val) return val;
      return {
        ...val,
        type,
      };
    });
  };
  const setItemTemplate = (item: TDynamicForm) => {
    if (!setValue) return;
    setValue((prevFormData) =>
      prevFormData.map((prevItem) =>
        prevItem.id === item.id ? item : prevItem
      )
    );
  };

  return getLoading ? (
    <>
      <Skeleton
        height="1rem"
        style={{ maxWidth: "10rem", marginBottom: ".45rem" }}
      ></Skeleton>
      <Skeleton height={skeletonHeight(item)}></Skeleton>
    </>
  ) : (
    <div className="relative flex flex-row items-center">
      {isQuestionMode && (
        <IconButton className="mgc_dots_line cursor-grab"></IconButton>
      )}
      <div className={`flex flex-col w-full ${isQuestionMode ? "p-2" : ""}`}>
        {isQuestionMode && isChosen && (
          <div className="pb-2">
            <Dropdown
              value={chosenEdited?.type || ""}
              onChange={handleChangeType}
              options={FIELDS_TYPES}
              optionLabel="label"
              optionValue="value"
              pt={{ input: { className: "p-1" } }}
              placeholder="Type"
            ></Dropdown>
          </div>
        )}
        {/* Label */}
        <DynamicFormLabel item={item} id={id}></DynamicFormLabel>

        {/* Input */}
        {item.type === "template" && item.template ? (
          <item.template item={item} setItem={setItemTemplate} form={value} />
        ) : isQuestionMode && isChosen ? (
          <AdditionnalInfos></AdditionnalInfos>
        ) : (
          <DynamicFormCore item={item} id={formId}></DynamicFormCore>
        )}

        {/* Errors */}
        {errorsTouched(item) && (
          <ErrorMessage message={errorsTouched(item)}></ErrorMessage>
        )}

        {typeof item.additionnalInfo === "function"
          ? item.additionnalInfo(item)
          : item.additionnalInfo}
      </div>
      {isQuestionMode && (
        <div className="flex flex-row gap-1 px-2">
          <IconButton
            size="2rem"
            className={`text-lg ${
              !isChosen
                ? "mgc_pencil_fill text-blue-500"
                : "mgc_check_fill text-green-500"
            }`}
            onClick={handleChangeMode}
          ></IconButton>
          <IconButton
            size="2rem"
            onClick={handleCrux}
            className={`text-lg ${
              !isChosen
                ? "mgc_delete_fill text-red-500"
                : "mgc_close_fill text-red-500"
            }`}
          ></IconButton>
        </div>
      )}
    </div>
  );
}

export default DynamicField;



