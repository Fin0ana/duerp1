import { Dispatch, SetStateAction, createContext } from "react";
import { FormType, TDynamicForm } from "../types";
import { KeyString } from "../../utils/types";

type DynamicFormContextValue = {
  value: TDynamicForm[];
  setValue?: Dispatch<SetStateAction<TDynamicForm[]>>;
  updateFieldValue: (
    form: TDynamicForm,
    newValue: TDynamicForm["value"]
  ) => void;
  updateFieldFromKey: (
    form: TDynamicForm,
    key: keyof TDynamicForm,
    newValue: any
  ) => void;
  errors: KeyString;
  setErrors: Dispatch<SetStateAction<KeyString>>;
  touched: boolean;
  setTouched: Dispatch<SetStateAction<boolean>>;
  id: string;
  globalMode: FormType;
  getLoading?: boolean;
  chosenEdited?: TDynamicForm | undefined;
  setChosenEdited: Dispatch<SetStateAction<TDynamicForm | undefined>>;
  chosenId: number | undefined;
  setChosenId: Dispatch<SetStateAction<number | undefined>>;
};

export const DynamicFormContext = createContext<DynamicFormContextValue>({
  value: [],
  setValue: () => {},
  updateFieldValue: (form, newValue) => {},
  updateFieldFromKey: (form, key, newValue) => {},
  errors: {},
  setErrors: () => {},
  touched: false,
  setTouched: () => {},
  id: "",
  globalMode: "answer",
  getLoading: false,
  chosenEdited: undefined,
  setChosenEdited: () => {},
  chosenId: undefined,
  setChosenId: () => {},
});

export const DynamicFormProvider = DynamicFormContext.Provider;

