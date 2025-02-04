import { Dispatch, SetStateAction, useEffect } from "react";
import type { DynamicFormState, TDynamicForm } from "../types";
import {
  getDefaultValue,
  isDefaultValue,
  isDefaultValueSimple,
} from "../../datatable/constants";
import { KeyString } from "../../utils/types";
import { isArray } from "../../utils/global";

export function useFillFormKey(
  [formToFill, setFormToFill]: DynamicFormState,
  fieldId: string,
  _fieldKey: string,
  filler: any
) {
  const index = formToFill.findIndex((el) => el.id === fieldId);
  if (!formToFill[index]) return;
  const fieldKey = _fieldKey as keyof TDynamicForm;
  const _formToFill = formToFill.slice();
  if (!Object.prototype.hasOwnProperty.call(formToFill[index], fieldKey))
    return;
  if (typeof filler === "function") {
    _formToFill[index][fieldKey] = filler(
      _formToFill[index][fieldKey],
      _formToFill[index]
    );
    setFormToFill(_formToFill);
    return;
  }
  if (formToFill[index].type === "number") {
    _formToFill[index][fieldKey] = Number(filler);
    setFormToFill(_formToFill);
    return;
  }
  _formToFill[index][fieldKey] = filler;
  setFormToFill(_formToFill);
}

export function setValue(
  [formToFill, setFormToFill]: DynamicFormState,
  fieldId: string,
  filler: any
) {
  useFillFormKey([formToFill, setFormToFill], fieldId, "value", filler);
}

export function usePrefillForm(
  formToFillState: DynamicFormState,
  formBack?: { [key: string]: any },
  arrayOptions?: { key: string; value: string }
) {
  if (typeof formBack !== "object" || !formBack) return;

  if (isArray<KeyString>(formBack)) {
    const { key, value } = arrayOptions || { key: "key", value: "value" };
    formBack.forEach((data) => {
      setValue(formToFillState, data[key], data[value]);
    });
    return;
  }
  Object.keys(formBack).forEach((key) => {
    setValue(formToFillState, key, formBack[key]);
  });
}

export function getOneValueFromKey(
  formToFetch: TDynamicForm[],
  fieldId: string,
  _fieldKey: string
) {
  const form = formToFetch.find((el) => el.id === fieldId);
  if (!form) return;
  const fieldKey = _fieldKey as keyof TDynamicForm;
  return form[fieldKey];
}

export function getValue(formToFetch: TDynamicForm[], fieldId: string) {
  return getOneValueFromKey(formToFetch, fieldId, "value");
}

export function useResetForm(formToFillState: DynamicFormState) {
  const formattedForm = formToFillState[0].reduce((acc, curr) => {
    return { ...acc, [curr.id]: getDefaultValue(curr.type) };
  }, {} as KeyString);
  Object.keys(formattedForm).forEach((key) => {
    useFillFormKey(formToFillState, key, "value", formattedForm[key]);
  });
}

// Disable all fields in each array
export function useConditionnalDisabling(
  formToFillState: DynamicFormState,
  dependentFieldsIds: string[][]
) {
  const values = dependentFieldsIds.reduce(
    (acc, curr) => [
      ...acc,
      ...curr.map((fieldId) => getValue(formToFillState[0], fieldId)),
    ],
    []
  );

  // Check each value update if one field value is changed, when it's changed, disabled all the remaining field
  useEffect(() => {
    dependentFieldsIds.forEach((fieldIds) => {
      const allAreDefaultValue = fieldIds.every((fieldId) =>
        isDefaultValueSimple(
          getOneValueFromKey(formToFillState[0], fieldId, "type"),
          getValue(formToFillState[0], fieldId)
        )
      );
      fieldIds.forEach((fieldId) => {
        if (allAreDefaultValue) {
          useFillFormKey(formToFillState, fieldId, "disabled", false);
          return;
        }
        useFillFormKey(formToFillState, fieldId, "disabled", setDisabledState);
      });
    });
  }, values);

  // The disabling is triggered when it's the default value
  const setDisabledState = (
    _: boolean | undefined,
    state: TDynamicForm
  ): boolean => {
    return isDefaultValue(state) ? true : false;
  };
}


