import { CSSProperties, Dispatch, SetStateAction } from "react";
import type { Ref } from "vue";
import type { LocationQueryValue } from "vue-router";
import { KeyString } from "../utils/types";
import { TDynamicForm } from "../dynamicForm/types";
import { FilterMatchMode } from "primereact/api";

export type TDatatableHeader<T = any> = {
  label: string;
  id: string;
  sortable?: boolean;
  filter?: TDynamicForm;
  numeric?: boolean;
  noWrapHeader?: boolean;
  columnClassName?: string;
  columnStyle?: CSSProperties;
  transformerFn?: (value: any) => any;
  template?: (value: T) => JSX.Element;
  center?: boolean;
  simpleEdit?: boolean;
  advancedEdit?: {};
  onChangeCell?: (value: KeyString) => Promise<any>;
  children?: TDatatableHeader[];
};

export type TDatatableData = {
  [key: string]: any;
};

type TLinkPaginatedResponse = {
  url: string | null;
  label: string;
  active: boolean;
};

export type TPaginatedData<ListType> = {
  data?: ListType;
  total?: number;
  [totalOrData: string]: ListType | number;
};

export type TGetParams = {
  page?: number;
  limit?: number;
  sort?: { asc: string; [key: string]: string };
  filter?: any;
};

export type TPrimeTableRequestParams = {
  page: Ref<number>;
  limit: Ref<number>;
  sort?: Ref<LocationQueryValue | undefined>;
  filter?: Ref<{ [key: string]: string } | undefined>;
  search?: Ref<LocationQueryValue | undefined>;
};

export type LaravelRequest = {
  page: number;
  limit: number;
  sort?: LocationQueryValue | undefined;
  filter?: { [key: string]: string } | undefined;
  search?: LocationQueryValue | undefined;
};

type TCommonProps = {
  headers: TDatatableHeader[];
  noDataText?: string;
  hasSearch?: boolean;
  size?: "small" | "medium" | "large";
  selection?: any[];
  setSelection?: Dispatch<SetStateAction<any[]>>;
  /**
   * Name of the field that uniquely identifies a record in the data. Should be a unique business key to prevent re-rendering.
   */
  dataId?: string;
  perPage?: number;
  captureQuery?: boolean;
  loading?: boolean;
  rowClassName?: (
    data: any,
    options: DataTableRowClassNameOptions<any[]>
  ) => string | object | undefined;
};

type TIsLazyProps = {
  lazy: true;
  datas?: TPaginatedData<any[]>;
  fetcher?: (params?: any) => Promise<TPaginatedData<any[]>>;
  paramsFormatter?: (req: TPrimeTableRequestParams) => Record<string, any>;
  /**
   * The key of the paginated data
   */
  dataKey?: string;
  totalKey?: string;
};

type TIsNotLazyProps = {
  lazy?: false;
  datas?: any[];
  fetcher?: (params?: any) => Promise<any[]>;
  paramsFormatter?: (req: TPrimeTableRequestParams) => Record<string, any>;
  /**
   * The key of the paginated data
   */
  dataKey?: string;
  totalKey?: string;
};

export type TAdminDatatableProps = TCommonProps &
  (TIsLazyProps | TIsNotLazyProps);
interface DatatableFilter {
  field: string;
  op:
    | "includes"
    | "startsWith"
    | "endsWith"
    | "same"
    | "lt"
    | "lte"
    | "gt"
    | "gte"
    | "between"
    | "not"
    | "in";
  value: string | number | Date;
}

export type ChoosenFilterMatchMode = Pick<
  typeof FilterMatchMode,
  | "STARTS_WITH"
  | "CONTAINS"
  | "ENDS_WITH"
  | "EQUALS"
  | "NOT_EQUALS"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL_TO"
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "BETWEEN"
  | "IN"
>;

export type ExpressParams = {
  page: number;
  limit: number;
  sort: any;
  search: any;
  filter: any;
};

