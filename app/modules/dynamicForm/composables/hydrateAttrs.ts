// import { ChangeEvent, SyntheticEvent, useCallback, useContext } from "react";
// import type {
//   DateRange,
//   ErrorType,
//   ImgFromServer,
//   ItemState,
//   NumberRange,
//   TDynamicForm,
// } from "../types";
// import { InputNumberChangeEvent } from "primereact/inputnumber";
// import { FormEvent } from "primereact/ts-helpers";
// import { DynamicFormContext } from "../context/DynamicFormContext";
// import { DropdownChangeEvent } from "primereact/dropdown";
// import { RadioButtonChangeEvent } from "primereact/radiobutton";
// import { CheckboxChangeEvent } from "primereact/checkbox";
// import { TreeSelectChangeEvent } from "primereact/treeselect";
// import { AutoCompleteChangeEvent } from "primereact/autocomplete";
// import { KeyString } from "../../utils/types";

// export function useIdFor(propId: string, item: TDynamicForm) {
//   return `${propId}-${item.id}`;
// }

// export function useHydrateAttr(
//   propId: string,
//   item: TDynamicForm,
//   onChange?: (v: any) => void
// ) {
//   const { updateFieldValue, touched, errors, value } =
//     useContext(DynamicFormContext);

//   // Update the field value in function of item
//   const setItemValue = (val: TDynamicForm["value"]) => {
//     updateFieldValue(item, val);
//     onChange?.(val);
//   };

//   const memoizedFunction = useCallback(() => {
//     // context
//     const { globalMode } = useContext(DynamicFormContext);
//     // Global definitions
//     const isInvalid = !!(touched && errors[item.id]);
//     const invalidClass = isInvalid ? "p-invalid" : "";
//     const directClassesFields: TDynamicForm["type"][] = ["input", "textarea"];
//     const inputClassName = item.inputClassName || "";
//     const conditionnalInputClass = directClassesFields.includes(item.type)
//       ? inputClassName
//       : "";
//     const returnValue = {
//       className: `w-full ${invalidClass} ${conditionnalInputClass}`,
//       id: useIdFor(propId, item),
//       disabled: !!item.disabled || !!item.readonly || globalMode === "question",
//       placeholder: item.placeholder,
//       value: item.value,
//       title: item.title,
//     };

//     // Specifics (arakaraky ny type)
//     if (item.type === "input" || item.type === "textarea") {
//       return {
//         ...returnValue,
//         onChange: (e: ChangeEvent<HTMLInputElement>) => {
//           setItemValue(e.target.value);
//         },
//       };
//     }
//     if (item.type === "date")
//       return {
//         ...returnValue,
//         inputId: useIdFor(propId, item),
//         inputClassName: item.inputClassName,
//         id: null,
//         onChange: (e: FormEvent<Date, SyntheticEvent<Element, Event>>) => {
//           setItemValue(e.value);
//         },
//       };
//     if (item.type === "daterange")
//       return {
//         ...returnValue,
//         inputClassName: `w-full ${inputClassName}`,
//         onChange: (e: DateRange) => {
//           setItemValue(e);
//         },
//         invalid: isInvalid,
//         alignement: item.alignement,
//         toLabel: item.toLabel,
//         fromLabel: item.fromLabel,
//         touchUI: item.touchUI,
//       };
//     if (item.type === "number")
//       return {
//         ...returnValue,
//         inputClassName: `w-full ${inputClassName}`,
//         onValueChange: (e: InputNumberChangeEvent) => {
//           setItemValue(e.value);
//         },
//         inputId: useIdFor(propId, item),
//         id: null,
//         useGrouping: item.useGrouping ?? true,
//         locale: "fr",
//         invalid: isInvalid,
//       };
//     if (item.type === "numberrange")
//       return {
//         ...returnValue,
//         inputClassName: `w-full ${inputClassName}`,
//         onChange: (e: NumberRange) => {
//           setItemValue(e);
//         },
//         invalid: isInvalid,
//         alignement: item.alignement,
//         toLabel: item.toLabel,
//         fromLabel: item.fromLabel,
//       };
//     if (item.type === "password")
//       return {
//         ...returnValue,
//         inputClassName: `w-full ${inputClassName}`,
//         onChange: (e: ChangeEvent<HTMLInputElement>) => {
//           setItemValue(e.target.value);
//         },
//         toggleMask: true,
//         feedback: false,
//         pt: { input: { autoComplete: "username" } },
//         inputId: useIdFor(propId, item),
//         id: null,
//         invalid: isInvalid,
//       };
//     if (item.type === "mask")
//       return {
//         ...returnValue,
//         autoClear: item.autoClear || true,
//         mask: item.mask || "",
//         inputClassName: `w-full ${inputClassName}`,
//         id: useIdFor(propId, item),
//       };
//     if (item.type === "select")
//       return {
//         ...returnValue,
//         onChange: (e: DropdownChangeEvent) => {
//           setItemValue(e.value);
//         },
//         options: item.selectOptions || [],
//         optionValue:
//           typeof item.selectOptions[0] !== "string"
//             ? item.selectValue || "value"
//             : null,
//         optionLabel:
//           typeof item.selectOptions[0] !== "string"
//             ? item.selectLabel || "label"
//             : null,
//         pt: { input: { className: `w-full ${inputClassName}` } },
//         inputId: useIdFor(propId, item),
//         filter: item.filter,
//         id: null,
//         invalid: isInvalid,
//         virtualScrollerOptions:
//           item.selectOptions?.length > 100 ? { itemSize: 32.5 } : undefined,
//         emptyFilterMessage: "Pas de résultat",
//         emptyMessage: "Pas d'options",
//         showClear: item.showClear,
//       };
//     if (item.type === "multiselect") {
//       const optionValue =
//         typeof item.selectOptions[0] !== "string"
//           ? item.selectValue || "value"
//           : null;
//       const optionLabel =
//         typeof item.selectOptions[0] !== "string"
//           ? item.selectLabel || "label"
//           : null;

//       // how we treat the values when they are not in options
//       const notInOptionsValues = (item.value || []).filter((v) => {
//         return optionLabel && optionValue != null
//           ? !item.selectOptions.some((o: any) => o[optionValue] === v)
//           : !item.selectOptions.some((o: any) => o === v);
//       });
//       const nullOptions =
//         optionLabel && optionValue
//           ? notInOptionsValues.map((v) => ({
//               [optionLabel]: "NULL",
//               [optionValue]: v,
//             }))
//           : notInOptionsValues;
//       const showNullOption = item.showNullOption ?? true; // Default value is true
//       const options = showNullOption
//         ? [...nullOptions, ...(item.selectOptions || [])]
//         : item.selectOptions || [];

//       return {
//         ...returnValue,
//         onChange: (e: DropdownChangeEvent) => {
//           setItemValue(e.value);
//         },
//         options,
//         optionValue,
//         optionLabel,
//         pt: { input: { className: `w-full ${inputClassName}` } },
//         inputId: useIdFor(propId, item),
//         filter: item.filter,
//         id: null,
//         invalid: isInvalid,
//         virtualScrollerOptions:
//           item.selectOptions?.length > 100 ? { itemSize: 32.5 } : undefined,
//         emptyFilterMessage: "Pas de résultat",
//         emptyMessage: "Pas d'options",
//         // display: "chip",
//         focusOnHover: false,
//         onSelectAll: item.onSelectAll,
//       };
//     }
//     if (item.type === "autocomplete")
//       return {
//         ...returnValue,
//         onChange: (e: AutoCompleteChangeEvent) => {
//           setItemValue(e.value);
//         },
//         options: item.selectOptions || [],
//         field: item.field || "name",
//         inputClassName: `w-full ${inputClassName}`,
//         pt: { container: { className: "w-full" } },
//         inputId: useIdFor(propId, item),
//         id: null,
//         invalid: isInvalid,
//         virtualScrollerOptions:
//           item.selectOptions?.length > 100 ? { itemSize: 32.5 } : undefined,
//         onCreateNew: (e: KeyString[]) => item.onCreateNew?.(e, value),
//         multiple: item.multiple,
//         emptyMessage: "Pas d'options",
//       };
//     if (item.type === "addable-autocomplete")
//       return {
//         ...returnValue,
//         onChange: (e: AutoCompleteChangeEvent) => {
//           setItemValue(e.value);
//         },
//         selectOptions: item.selectOptions || [],
//         field: item.field || "name",
//         idField: item.idField || "_id",
//         inputClassName: `w-full ${inputClassName}`,
//         pt: { container: { className: "w-full" } },
//         inputId: useIdFor(propId, item),
//         id: null,
//         onSelect: item.onSelect,
//         onCreateNew: item.onCreateNew,
//         onDelete: item.onDelete,
//         invalid: isInvalid,
//         loading: item.loading,
//         disabled: item.disabled,
//         placeholder: item.placeholder,
//         multiple: item.multiple,
//         emptyMessage: "Pas d'options",
//       };
//     if (item.type === "treeselect")
//       return {
//         ...returnValue,
//         onChange: (e: TreeSelectChangeEvent) => {
//           setItemValue(e.value);
//         },
//         options: item.selectOptions || [],
//         invalid: isInvalid,
//         inputClassName: `w-full ${inputClassName}`,
//         selectLabel: item.selectLabel || "label",
//         selectValue: item.selectValue || "value",
//         childrenKey: item.childrenKey || "children",
//         inputId: useIdFor(propId, item),
//         id: null,
//         emptyFilterMessage: "Pas de résultat",
//         emptyMessage: "Pas d'options",
//       };
//     if (item.type === "lazyselect")
//       return {
//         ...returnValue,
//         onChange: (e: DropdownChangeEvent) => {
//           setItemValue(e.value);
//         },
//         invalid: isInvalid,
//         inputClassName: `w-full ${inputClassName}`,
//         selectLabel: item.selectLabel,
//         selectValue: item.selectValue,
//         filter: item.filter,
//         fetcher: item.fetcher || (() => {}),
//         oneFetcher: item.oneFetcher || (() => {}),
//         dataKey: item.dataKey,
//         totalKey: item.totalKey,
//         inputId: useIdFor(propId, item),
//         id: null,
//       };
//     if (item.type === "radio")
//       return {
//         ...returnValue,
//         onChange: (e: RadioButtonChangeEvent) => {
//           setItemValue(e.value);
//         },
//         alignement: item.alignement || "vertical",
//         options: item.selectOptions || [],
//         invalid: isInvalid,
//         selectLabel: item.selectLabel,
//         selectValue: item.selectValue,
//         optionTitle: item.optionTitle,
//       };
//     if (item.type === "checkbox")
//       return {
//         ...returnValue,
//         onChange: (e: CheckboxChangeEvent) => {
//           let value = item.value ? [...item.value] : [];
//           if (e.checked) value.push(e.value);
//           else value.splice(value.indexOf(e.value), 1);
//           setItemValue(value);
//         },
//         alignement: item.alignement || "vertical",
//         options: item.selectOptions || [],
//         invalid: isInvalid,
//         selectLabel: item.selectLabel,
//         selectValue: item.selectValue,
//         optionTitle: item.optionTitle,
//         onCheck: item.onCheck,
//         onUncheck: item.onUncheck,
//       };
//     if (item.type === "file")
//       return {
//         ...returnValue,
//         allowMultiple: item.allowMultiple,
//         readFiles: item.readFiles || [],
//         docPreviewImgUrl: item.docPreviewImgUrl || "/images/Doc.jpg",
//         videoPreviewImgUrl: item.videoPreviewImgUrl || "/images/Video.jpg",
//         uploader: item.uploader,
//         deleter: item.deleter,
//         reorderer: item.reorderer,
//         "update:readFiles": (evt: ImgFromServer[]) => {
//           item.readFiles = evt;
//         },
//         acceptedFileTypes: item.fileType,
//         invalidFileTypeMessage: item.invalidFileTypeMessage,
//         maxFileSize: item.maxFileSize,
//         invalidFileSizeMessage: item.invalidFileSizeMessage,
//         fileLimit: item.fileLimit,
//         invalidFileLimitMessage: item.invalidFileLimitMessage,
//         valueType: item.valueType,
//       };
//     return returnValue;
//   }, [item, touched, errors]);

//   return memoizedFunction();
// }



import { useCallback, useContext } from "react";
import { DynamicFormContext } from "../context/DynamicFormContext";
import { InputNumberChangeEvent } from "primereact/inputnumber";
import { FormEvent } from "primereact/ts-helpers";
import { DropdownChangeEvent } from "primereact/dropdown";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { CheckboxChangeEvent } from "primereact/checkbox";
import { TreeSelectChangeEvent } from "primereact/treeselect";
import { AutoCompleteChangeEvent } from "primereact/autocomplete";

export function useIdFor(propId, item) {
  return `${propId}-${item.id}`;
}

export function useHydrateAttr(
  propId,
  item,
  onChange
) {
  const { updateFieldValue, touched, errors, value } = useContext(DynamicFormContext);

  // Update the field value in function of item
  const setItemValue = (val) => {
    updateFieldValue(item, val);
    onChange?.(val);
  };

  const memoizedFunction = useCallback(() => {
    const { globalMode } = useContext(DynamicFormContext);
    const isInvalid = !!(touched && errors[item.id]);
    const invalidClass = isInvalid ? "p-invalid" : "";
    const directClassesFields = ["input", "textarea"];
    const inputClassName = item.inputClassName || "";
    const conditionnalInputClass = directClassesFields.includes(item.type)
      ? inputClassName
      : "";
    const returnValue = {
      className: `w-full ${invalidClass} ${conditionnalInputClass}`,
      id: useIdFor(propId, item),
      disabled: !!item.disabled || !!item.readonly || globalMode === "question",
      placeholder: item.placeholder,
      value: item.value,
      title: item.title,
    };

    if (item.type === "input" || item.type === "textarea") {
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.target.value);
        },
      };
    }
    if (item.type === "date")
      return {
        ...returnValue,
        inputId: useIdFor(propId, item),
        inputClassName: item.inputClassName,
        id: null,
        onChange: (e) => {
          setItemValue(e.value);
        },
      };
    if (item.type === "daterange")
      return {
        ...returnValue,
        inputClassName: `w-full ${inputClassName}`,
        onChange: (e) => {
          setItemValue(e);
        },
        invalid: isInvalid,
        alignement: item.alignement,
        toLabel: item.toLabel,
        fromLabel: item.fromLabel,
        touchUI: item.touchUI,
      };
    if (item.type === "number")
      return {
        ...returnValue,
        inputClassName: `w-full ${inputClassName}`,
        onValueChange: (e) => {
          setItemValue(e.value);
        },
        inputId: useIdFor(propId, item),
        id: null,
        useGrouping: item.useGrouping ?? true,
        locale: "fr",
        invalid: isInvalid,
      };
    if (item.type === "numberrange")
      return {
        ...returnValue,
        inputClassName: `w-full ${inputClassName}`,
        onChange: (e) => {
          setItemValue(e);
        },
        invalid: isInvalid,
        alignement: item.alignement,
        toLabel: item.toLabel,
        fromLabel: item.fromLabel,
      };
    if (item.type === "password")
      return {
        ...returnValue,
        inputClassName: `w-full ${inputClassName}`,
        onChange: (e) => {
          setItemValue(e.target.value);
        },
        toggleMask: true,
        feedback: false,
        pt: { input: { autoComplete: "username" } },
        inputId: useIdFor(propId, item),
        id: null,
        invalid: isInvalid,
      };
    if (item.type === "mask")
      return {
        ...returnValue,
        autoClear: item.autoClear || true,
        mask: item.mask || "",
        inputClassName: `w-full ${inputClassName}`,
        id: useIdFor(propId, item),
      };
    if (item.type === "select")
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.value);
        },
        options: item.selectOptions || [],
        optionValue:
          typeof item.selectOptions[0] !== "string"
            ? item.selectValue || "value"
            : null,
        optionLabel:
          typeof item.selectOptions[0] !== "string"
            ? item.selectLabel || "label"
            : null,
        pt: { input: { className: `w-full ${inputClassName}` } },
        inputId: useIdFor(propId, item),
        filter: item.filter,
        id: null,
        invalid: isInvalid,
        virtualScrollerOptions:
          item.selectOptions?.length > 100 ? { itemSize: 32.5 } : undefined,
        emptyFilterMessage: "Pas de résultat",
        emptyMessage: "Pas d'options",
        showClear: item.showClear,
      };
    if (item.type === "multiselect") {
      const optionValue =
        typeof item.selectOptions[0] !== "string"
          ? item.selectValue || "value"
          : null;
      const optionLabel =
        typeof item.selectOptions[0] !== "string"
          ? item.selectLabel || "label"
          : null;

      const notInOptionsValues = (item.value || []).filter((v) => {
        return optionLabel && optionValue != null
          ? !item.selectOptions.some((o) => o[optionValue] === v)
          : !item.selectOptions.some((o) => o === v);
      });
      const nullOptions =
        optionLabel && optionValue
          ? notInOptionsValues.map((v) => ({
              [optionLabel]: "NULL",
              [optionValue]: v,
            }))
          : notInOptionsValues;
      const showNullOption = item.showNullOption ?? true;
      const options = showNullOption
        ? [...nullOptions, ...(item.selectOptions || [])]
        : item.selectOptions || [];

      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.value);
        },
        options,
        optionValue,
        optionLabel,
        pt: { input: { className: `w-full ${inputClassName}` } },
        inputId: useIdFor(propId, item),
        filter: item.filter,
        id: null,
        invalid: isInvalid,
        virtualScrollerOptions:
          item.selectOptions?.length > 100 ? { itemSize: 32.5 } : undefined,
        emptyFilterMessage: "Pas de résultat",
        emptyMessage: "Pas d'options",
        focusOnHover: false,
        onSelectAll: item.onSelectAll,
      };
    }
    if (item.type === "autocomplete")
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.value);
        },
        options: item.selectOptions || [],
        field: item.field || "name",
        inputClassName: `w-full ${inputClassName}`,
        pt: { container: { className: "w-full" } },
        inputId: useIdFor(propId, item),
        id: null,
        invalid: isInvalid,
        virtualScrollerOptions:
          item.selectOptions?.length > 100 ? { itemSize: 32.5 } : undefined,
        onCreateNew: (e) => item.onCreateNew?.(e, value),
        multiple: item.multiple,
        emptyMessage: "Pas d'options",
      };
    if (item.type === "addable-autocomplete")
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.value);
        },
        selectOptions: item.selectOptions || [],
        field: item.field || "name",
        idField: item.idField || "_id",
        inputClassName: `w-full ${inputClassName}`,
        pt: { container: { className: "w-full" } },
        inputId: useIdFor(propId, item),
        id: null,
        onSelect: item.onSelect,
        onCreateNew: item.onCreateNew,
        onDelete: item.onDelete,
        invalid: isInvalid,
        loading: item.loading,
        disabled: item.disabled,
        placeholder: item.placeholder,
        multiple: item.multiple,
        emptyMessage: "Pas d'options",
      };
    if (item.type === "treeselect")
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.value);
        },
        options: item.selectOptions || [],
        invalid: isInvalid,
        inputClassName: `w-full ${inputClassName}`,
        selectLabel: item.selectLabel || "label",
        selectValue: item.selectValue || "value",
        childrenKey: item.childrenKey || "children",
        inputId: useIdFor(propId, item),
        id: null,
        emptyFilterMessage: "Pas de résultat",
        emptyMessage: "Pas d'options",
      };
    if (item.type === "lazyselect")
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.value);
        },
        invalid: isInvalid,
        inputClassName: `w-full ${inputClassName}`,
        selectLabel: item.selectLabel,
        selectValue: item.selectValue,
        filter: item.filter,
        fetcher: item.fetcher || (() => {}),
        oneFetcher: item.oneFetcher || (() => {}),
        dataKey: item.dataKey,
        totalKey: item.totalKey,
        inputId: useIdFor(propId, item),
        id: null,
      };
    if (item.type === "radio")
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.value);
        },
        options: item.selectOptions || [],
        optionLabel: item.optionLabel || "label",
        optionValue: item.optionValue || "value",
        disabled: !!item.disabled || !!item.readonly,
      };
    if (item.type === "checkbox")
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.checked);
        },
        invalid: isInvalid,
        checked: value === item.value,
      };
    if (item.type === "checkboxgroup")
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.value);
        },
        invalid: isInvalid,
        options: item.selectOptions || [],
      };
    if (item.type === "radiobutton")
      return {
        ...returnValue,
        onChange: (e) => {
          setItemValue(e.value);
        },
        value: item.value,
        options: item.selectOptions || [],
        disabled: item.disabled,
        optionLabel: item.optionLabel || "label",
        optionValue: item.optionValue || "value",
        id: useIdFor(propId, item),
      };
    if (item.type === "tree") return {
      ...returnValue,
      onChange: (e) => {
        setItemValue(e.value);
      },
      options: item.selectOptions || [],
    };

    return returnValue;
  }, [item]);

  return memoizedFunction();
}
