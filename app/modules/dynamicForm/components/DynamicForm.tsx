import {
  Dispatch,
  FormEvent,
  forwardRef,
  Fragment,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DynamicFormMethods,
  DynamicFormProps,
  DynamicFormSubmitOptions,
  FormResult,
  FormType,
  TDynamicForm,
} from "../types";
import { Button } from "primereact/button";
import {
  DynamicFormContext,
  DynamicFormProvider,
} from "../context/DynamicFormContext";
import { KeyString } from "../../utils/types";
import { useValidation } from "../composables/validation";
import DynamicField from "./bases/DynamicField";
import IconMingCute from "@/app/components/common/icons/IconMingCute";
import { groupBy } from "@/app/utils/objectManip";
import { Fieldset } from "primereact/fieldset";

const _DynamicForm = forwardRef<DynamicFormMethods, DynamicFormProps>(
  (
    {
      value,
      setValue,
      submitLoading,
      paginated,
      limit,
      submitLabel,
      submitIcon,
      onSubmit = () => {},
      globalMode = "answer",
      onEdit = () => {},
      submitTemplate,
      onCancel,
      cancelIcon,
      cancelLabel,
      fullHeight,
      noSubmit,
      onChange,
    },
    ref
  ) => {
    // Context
    const { setTouched, chosenEdited, setChosenEdited, chosenId, setChosenId } =
      useContext(DynamicFormContext);

    // Computed
    const isQuestionMode = useMemo(
      () => globalMode === "question",
      [globalMode]
    );
    const containerClass = (item: TDynamicForm) => {
      if (isQuestionMode)
        return "col-span-12 border rounded-md border-gray-200 focus-within:ring-2 focus-within:ring-primary-50";
      return item.containerClass || "col-span-12 md:col-span-6";
    };

    // Add question

    const handleAddQuestion = () => {
      const newField: TDynamicForm = {
        type: "input",
        value: "",
        label: "Nouveau champ",
        id: `new-field-${value.length}`,
      };
      setValue((val) => [...val, newField]);
      setChosenEdited(newField);
      setChosenId(value.length);
    };

    // Errors // Validation
    const { getObject, validate } = useValidation();

    // Submit
    const handleSubmit = async (evt: FormEvent) => {
      evt.preventDefault();
      submit();
    };

    /**
     * 
     * @param options no callback signifies that it only validate the form and return the result if valid
     * @returns 
     */
    async function submit(
      options?: DynamicFormSubmitOptions
    ): Promise<FormResult | void | undefined> {
      if (isQuestionMode) return;
      if (submitLoading) return;
      if (noSubmit) return;
      setTouched(true);
      const isValid = await validate();
      if (!isValid) return;
      !!!options?.noCallBack && onSubmit(getObject("value"));
      return getObject("value");
    }

    useImperativeHandle(ref, () => ({
      submit,
    }));

    // Save question mode
    const handleEdit = () => {
      if (!isQuestionMode) return;
      onEdit(value);
    };

    // Utils
    const containerRef = useRef<KeyString>({});

    // sectionning
    const groupedBySection = groupBy(value, "section");

    return (
      <form
        className={`flex flex-col justify-between ${
          fullHeight ? "h-full" : ""
        }`}
        onSubmit={handleSubmit}
      >
        {/* <pre>{JSON.stringify(Object.keys(groupedBySection), null, 2)}</pre> */}
        <div className="grid gap-2 grid-cols-12">
          {Object.entries(groupedBySection).map(([groupKey, groupValue]) => (
            <Fragment key={groupKey}>
              {groupKey === "undefined" || groupKey.startsWith("_") ? (
                groupValue.map((item, id) => (
                  <div
                    key={item.id}
                    className={`flex flex-col ${containerClass(item)}`}
                    ref={(el) => (containerRef.current[item.id] = el)}
                    tabIndex={isQuestionMode ? 0 : undefined}
                  >
                    <DynamicField item={item} id={id} />
                  </div>
                ))
              ) : (
                <Fieldset legend={groupKey} className="col-span-12">
                  <div className="w-full grid gap-2 grid-cols-12">
                    {groupValue.map((item, id) => (
                      <div
                        key={item.id}
                        className={`flex flex-col ${containerClass(item)}`}
                        ref={(el) => (containerRef.current[item.id] = el)}
                        tabIndex={isQuestionMode ? 0 : undefined}
                      >
                        <DynamicField item={item} id={id} />
                      </div>
                    ))}
                  </div>
                </Fieldset>
              )}
            </Fragment>
          ))}
          {isQuestionMode && !chosenEdited && (
            <div
              onClick={handleAddQuestion}
              className={
                "rounded-md col-span-12 p-3 flex items-center justify-center gap-2 " +
                "uppercase bg-white text-green-600 font-semibold " +
                "border border-green-600 cursor-pointer hover:bg-green-50"
              }
            >
              <IconMingCute className="mgc_plus_fill" />
              <span>Nouveau champ</span>
            </div>
          )}
        </div>
        {!noSubmit ? (
          <div className={`pt-5`}>
            {submitTemplate ? (
              submitTemplate({
                onSubmit,
                pending: submitLoading,
                onCancel,
                value: getObject("value"),
              })
            ) : (
              <div className="w-full flex justify-end gap-2">
                {!isQuestionMode ? (
                  <>
                    {onCancel && (
                      <Button
                        loading={submitLoading}
                        icon={cancelIcon || "pi pi-times"}
                        type="button"
                        label={cancelLabel || "Annuler"}
                        severity="secondary"
                        onClick={onCancel}
                      ></Button>
                    )}
                    <Button
                      loading={submitLoading}
                      icon={submitIcon || "pi pi-check"}
                      type="submit"
                      label={submitLabel || "Confirmer"}
                    ></Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    icon="pi pi-save"
                    label="Enregistrer"
                    onClick={handleEdit}
                  ></Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </form>
    );
  }
);

const DynamicForm = forwardRef<DynamicFormMethods, DynamicFormProps>(
  (props: DynamicFormProps, ref) => {
    // Used for updating the field context, and updating the props in consequence (raha natao tany @ zanany de lasa in-2)
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState(false);
    const [modes, setModes] = useState<{ id: string; value: FormType }[]>([]);
    const [chosenEdited, setChosenEdited] = useState<TDynamicForm>();
    const [chosenId, setChosenId] = useState<number>();

    const updateFieldFromKey = (
      field: TDynamicForm,
      key: keyof TDynamicForm,
      newValue: any
    ) => {
      props.setValue((prevFormData) =>
        prevFormData.map((item) =>
          item.id === field.id ? { ...item, [key]: newValue } : item
        )
      );
    };
    const updateFieldValue = (
      field: TDynamicForm,
      newValue: TDynamicForm["value"]
    ) => {
      updateFieldFromKey(field, "value", newValue);
    };

    // Each Item Mode
    const itemMode = useCallback(
      (item: TDynamicForm) => {
        return modes.find((mode) => mode.id === item.id)?.value;
      },
      [modes]
    );

    const setItemMode = (item: TDynamicForm, mode: FormType) => {
      setModes((prevModes) =>
        prevModes.map((prevMode) =>
          prevMode.id === item.id ? { ...prevMode, value: mode } : prevMode
        )
      );
    };

    useEffect(() => {
      if (props.globalMode !== "question") setChosenEdited(undefined);
    }, [props.globalMode]);

    return (
      <DynamicFormProvider
        value={{
          value: props.value,
          setValue: props.setValue,
          updateFieldFromKey,
          updateFieldValue,
          errors,
          setErrors,
          touched,
          setTouched,
          id: props.id,
          globalMode: props.globalMode || "answer",
          getLoading: props.getLoading,
          chosenEdited,
          setChosenEdited,
          chosenId,
          setChosenId,
        }}
      >
        <_DynamicForm ref={ref} {...props}></_DynamicForm>
      </DynamicFormProvider>
    );
  }
);
export default DynamicForm;


