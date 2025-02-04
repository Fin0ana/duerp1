import { InputNumber } from "primereact/inputnumber";
import { ErrorType, ItemState, TDynamicForm } from "../../types";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import { MultiSelect } from "primereact/multiselect";
import { InputMask } from "primereact/inputmask";
import { useHydrateAttr } from "../../composables/dynamicForm";
import { ChangeEventHandler, memo, useContext } from "react";
import RadioGroup from "../cells/RadioGroup";
import CheckboxGroup from "../cells/CheckboxGroup";
import TreeSelectComponent from "../cells/TreeSelectComponent";
import LazyPaginatedSelect from "../cells/LazyPaginatedSelect";
import { DynamicFormContext } from "../../context/DynamicFormContext";
import CustomAutocomplete from "../cells/CustomAutocomplete";
import DateRange from "../cells/DateRange";
import NumberRange from "../cells/NumberRange";
import AddableAutoComplete from "../cells/AddableAutocomplete";

type DynamicFormCoreProps = {
  item?: TDynamicForm;
  onChange?: (value: any) => void;
  id: string
};

const DynamicFormCore = memo(({ item, onChange, id }: DynamicFormCoreProps) => {
  if (!item || item.type === "template") return <></>;
  // Render components
  type FormType = TDynamicForm["type"];
  type FormTypeMap = { [key in FormType]: any };

  const mappedForm: Omit<FormTypeMap, "template"> = {
    number: { component: InputNumber },
    input: { component: InputText },
    textarea: { component: InputTextarea },
    date: { component: Calendar },
    select: { component: Dropdown },
    password: { component: Password },
    radio: { component: RadioGroup },
    checkbox: { component: CheckboxGroup },
    file: { component: /* InputFile */ <></> },
    filepond: { component: /* FilepondInput */ <></> },
    multiselect: { component: MultiSelect },
    treeselect: { component: TreeSelectComponent },
    lazyselect: { component: LazyPaginatedSelect },
    mask: { component: InputMask },
    autocomplete: { component: CustomAutocomplete },
    "addable-autocomplete": { component: AddableAutoComplete },
    daterange: { component: DateRange },
    numberrange: { component: NumberRange },
  };

  const Component = mappedForm[item.type].component;

  // Hydrate props
  const attrs = (item: TDynamicForm) => useHydrateAttr(id, item, onChange);

  return <Component {...attrs(item)} />;
});

export default DynamicFormCore;


