import { FilterMatchMode } from "primereact/api";
import { TDynamicForm } from "../dynamicForm/types";
import { ChoosenFilterMatchMode } from "./types";

export const DEFAULT_PAGE_NUMBER = 0;
export const DEFAULT_PAGE_LIMIT = 10;
export const getDefaultValue = (fieldType: TDynamicForm["type"]) => {
  const mappedDefaults: { [key in typeof fieldType]: any } = {
    autocomplete: undefined,
    "addable-autocomplete": undefined,
    checkbox: [],
    date: "",
    file: undefined,
    filepond: undefined,
    input: "",
    lazyselect: undefined,
    mask: "",
    multiselect: [],
    number: null,
    password: "",
    radio: "",
    select: "",
    template: undefined,
    textarea: "",
    treeselect: "",
    daterange: undefined,
    numberrange: undefined,
  };
  return mappedDefaults[fieldType];
};

export const isDefaultValueSimple = (
  fieldType: TDynamicForm["type"],
  fieldValue: any
) => {
  const hasMultiValue =
    fieldType === "autocomplete" ||
    fieldType === "checkbox" ||
    fieldType === "multiselect";
  if (hasMultiValue) return fieldValue.length === 0;
  return fieldValue === getDefaultValue(fieldType);
};

export const isDefaultValue = (field: TDynamicForm) => {
  const hasMultiValue =
    field.type === "checkbox" ||
    field.type === "multiselect";
  if (hasMultiValue) return field.value.length === 0;
  return field.value === getDefaultValue(field.type);
};

export const getDefaultFilterType = (fieldType: TDynamicForm["type"]) => {
  const mappedDefaults: {
    [key in typeof fieldType]: ChoosenFilterMatchMode[keyof ChoosenFilterMatchMode];
  } = {
    autocomplete: FilterMatchMode.CONTAINS,
    "addable-autocomplete": FilterMatchMode.CONTAINS,
    checkbox: FilterMatchMode.CONTAINS,
    date: FilterMatchMode.EQUALS,
    file: FilterMatchMode.EQUALS,
    filepond: FilterMatchMode.EQUALS,
    input: FilterMatchMode.CONTAINS,
    lazyselect: FilterMatchMode.EQUALS,
    mask: FilterMatchMode.CONTAINS,
    multiselect: FilterMatchMode.IN,
    number: FilterMatchMode.EQUALS,
    password: FilterMatchMode.CONTAINS,
    radio: FilterMatchMode.EQUALS,
    select: FilterMatchMode.EQUALS,
    template: FilterMatchMode.CONTAINS,
    textarea: FilterMatchMode.CONTAINS,
    treeselect: FilterMatchMode.EQUALS,
    daterange: FilterMatchMode.BETWEEN,
    numberrange: FilterMatchMode.BETWEEN,
  };
  return mappedDefaults[fieldType];
};


