import React, { Dispatch, SetStateAction } from "react";
import type { TPaginatedData, LaravelRequest } from "../datatable/types.d";
import type { KeyString } from "../utils/types";
import { ISchema, Reference } from "yup";
import { FormikErrors } from "formik";

export type ItemState = [TDynamicForm, Dispatch<SetStateAction<TDynamicForm>>];

export type TDynamicForm = CommonType &
  (
    | Input
    | PrimeDate
    | Select
    | Number
    | Checkbox
    | Radio
    | Template
    | Image
    | MultiSelect
    | TreeSelect
    | PaginatedLazySelect
    | Mask
    | AutocompleteSelect
    | AddableAutocompleteSelect
    | DateRange
    | NumberRange
  );

type SubmitTemplate = {
  onSubmit: (value: FormResult, formData?: FormData) => void;
  pending: boolean | undefined;
  onCancel: (() => void) | undefined;
  value: FormResult;
  formData?: FormData;
};

export type DynamicFormProps = {
  value: TDynamicForm[];
  setValue: Dispatch<SetStateAction<TDynamicForm[]>>;
  id: string;
  submitLoading?: boolean;
  getLoading?: boolean;
  paginated?: boolean;
  limit?: number;
  submitLabel?: string;
  submitIcon?: string;
  cancelLabel?: string;
  cancelIcon?: string;
  onSubmit?: (value: FormResult, formData?: FormData) => void;
  onCancel?: () => void;
  globalMode?: FormType;
  onEdit?: (form: TDynamicForm[]) => void;
  submitTemplate?: (submitData: SubmitTemplate) => React.JSX;
  fullHeight?: boolean;
  noSubmit?: boolean;
  onChange?: (value: KeyString) => void;
};
export type DynamicFormSubmitOptions = { noCallBack?: boolean };
export type DynamicFormMethods = {
  submit: (
    options?: DynamicFormSubmitOptions
  ) => Promise<FormResult | void | undefined>;
};

export type SelectValues = string | number | boolean;

export type LabelValue = { label: string; value: SelectValues };

export type FileTypes = "image" | "video" | "doc";

export type TempImgFromServer = {
  path: string;
  name: string;
  original_url?: string;
};
export type ImgFromServer = {
  id: number;
  model_type: string;
  model_id: number;
  uuid: string;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string;
  disk: string;
  conversions_disk: string;
  size: number;
  manipulations: [];
  custom_properties: [];
  generated_conversions: [];
  responsive_images: [];
  order_column: number;
  created_at: string;
  updated_at: string;
  original_url: string;
  preview_url: string;
};

type FormId = TDynamicForm["id"];
export type FormResult = { [key in FormId]: any };

export type PossibleFormType = TDynamicForm["type"];

type CommonType = {
  id: string;
  label: string | React.JSX;
  validation?: ISchema<any> | Reference | string;
  // | ((value?: SelectValues) => boolean | string);
  containerClass?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  inputClassName?: string;
  order?: number;
  additionnalInfo?:
    | string
    | React.JSX
    | ((v: TDynamicForm) => string | React.JSX);
  section?: string;
  title?: string | React.JSX | ((v: TDynamicForm) => string | React.JSX);
};

type Input = {
  type: "input" | "textarea" | "password";
  value: string;
};
type PrimeDateValue = Date | (Date | null)[] | Date[] | null | undefined;
type PrimeDate = {
  type: "date";
  value: PrimeDateValue;
};

type Select = {
  type: "select";
  selectOptions: (KeyString | SelectValues)[];
  filter?: boolean;
  value: SelectValues | null;
  selectValue?: string;
  selectLabel?: string;
  virtualScrollerOptions?: { itemSize: number };
  showClear?: boolean;
};

export type PaginatedLazySelect = {
  type: "lazyselect";
  selectLabel?: string;
  selectValue?: string;
  filter?: boolean;
  value: SelectValues | null;
  fetcher: (p: LaravelRequest) => Promise<TPaginatedData<any>>;
  oneFetcher: (id: string | number) => Promise<any>;
  dataKey?: string;
  totalKey?: string;
};

type TreeSelect = {
  type: "treeselect";
  selectOptions: KeyString[];
  filter?: boolean;
  value?: SelectValues;
  selectLabel?: string;
  selectValue?: string;
  childrenKey?: string;
};

type MultiSelect = {
  type: "multiselect";
  selectOptions: (KeyString | SelectValues)[];
  filter?: boolean;
  value: SelectValues[];
  selectValue?: string;
  selectLabel?: string;
  onSelectAll?: (v: any[]) => void;
  showNullOption?: boolean; // Default 'true'
};

type AutocompleteSelect = {
  type: "autocomplete";
  selectOptions: KeyString[];
  value: KeyString[] | KeyString | undefined;
  field?: string;
  idField?: string;
  onCreateNew?: (e: KeyString[], self?: TDynamicForm[]) => void;
  multiple?: boolean;
};

type AddableAutocompleteSelect = {
  type: "addable-autocomplete";
  value: KeyString[] | KeyString | undefined;
  onSelect?: (e: AutoCompleteSelectEvent) => void;
  selectOptions?: KeyString[];
  onCreateNew?: (e: string) => void;
  onDelete?: (item: KeyString) => void;
  field?: string;
  idField?: string;
  multiple?: boolean;
  loading?: boolean;
};

type Number = {
  type: "number";
  value: number | null;
  prefix?: string;
  suffix?: string;
  useGrouping?: boolean;
};

interface Mask {
  type: "mask";
  value: string;
  mask?: string;
  autoClear?: boolean;
}

type Radio = {
  type: "radio";
  selectOptions: (KeyString | SelectValues)[];
  value: SelectValues | undefined;
  alignement?: "vertical" | "horizontal";
  selectValue?: string;
  selectLabel?: string;
  optionTitle?: string | ((v: KeyString | SelectValues) => string);
};

type Checkbox = {
  type: "checkbox";
  selectOptions: (KeyString | SelectValues)[];
  value: SelectValues[];
  alignement?: "vertical" | "horizontal";
  selectValue?: string;
  selectLabel?: string;
  optionTitle?: string | ((v: KeyString | SelectValues) => string);
  onCheck?: (v: SelectValues) => void;
  onUncheck?: (v: SelectValues) => void;
};

type Template = {
  type: "template";
  value: any;
  template?: (props: {
    item: TDynamicForm;
    setItem: (item: TDynamicForm) => void;
    form?: TDynamicForm[]
  }) => React.JSX;
  options?: any;
};

type ImageValue = ImgFromServer | TempImgFromServer;
export type InputFileModelValue = "formData" | "directUpload";

type DirectUpload = {
  valueType?: "directUpload" | undefined;
  uploader: (file: File) => Promise<TempImgFromServer>;
  value?: ImageValue | ImageValue[];
};

type FormDataUpload = {
  valueType: "formData";
  uploader?: undefined;
  value?: File[];
};

type Image = {
  type: "file" | "filepond";
  fileType: FileTypes;
  deleter?: (file_id: number) => Promise<void>;
  allowMultiple?: boolean;
  readFiles?: ImgFromServer[];
  maxFileSize?: number;
  docPreviewImgUrl?: string;
  videoPreviewImgUrl?: string;
  reorderer?: (product_id: number, reordered_ids: number[]) => Promise<void>;
  invalidFileSizeMessage?: string;
  invalidFileTypeMessage?: string;
  fileLimit?: number;
  invalidFileLimitMessage?: string;
} & (DirectUpload | FormDataUpload);

type DateRangeValue = {
  to: Date | undefined;
  from: Date | undefined;
  delayMs?: number;
} | null;
type DateRange = {
  type: "daterange";
  value?: DateRangeValue;
  toLabel?: string;
  fromLabel?: string;
  alignement?: "vertical" | "horizontal";
  touchUI?: boolean;
};

type NumberRangeValue = {
  to: number | null;
  from: number | null;
  difference?: number;
} | null;
type NumberRange = {
  type: "numberrange";
  value?: NumberRangeValue;
  toLabel?: string;
  fromLabel?: string;
  alignement?: "vertical" | "horizontal";
};

type ErrorType =
  | string
  | string[]
  | FormikErrors<any>
  | FormikErrors<any>[]
  | undefined;

export type FormType = "question" | "answer";

export type Option = KeyString | SelectValues;

export type DynamicFormState = [
  TDynamicForm[],
  Dispatch<SetStateAction<TDynamicForm[]>>
];

// File
export type FileToSend = {
  image: string;
  name: string;
  collectionName: string;
};

export interface ImgurResponse {
  status: number;
  success: boolean;
  data: ImgurData;
}

export interface ImgurData {
  deletehash: string;
  account_id?: string | null;
  account_url?: string | null;
  title?: string | null;
  description?: string | null;
  name: string;
  type: string;
  width: number;
  height: number;
  size: number;
  views: number;
  link: string;
  tags: any[];
  datetime: number;
  collectionName: string;
}


