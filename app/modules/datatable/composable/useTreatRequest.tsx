import { FilterMatchMode } from "primereact/api";
import { ColumnFilterApplyClickEvent } from "primereact/column";
import { ChoosenFilterMatchMode, DatatableFilter } from "../types";
import { DataTableFilterMeta } from "primereact/datatable";
import { isArray } from "../../utils/global";

export type Presorter = {
  sortOrder: 0 | 1 | -1 | undefined;
  sortField: string;
};

export function useTreatSortRequest() {
  // Parse the request to match sortField and sortOrder
  const sortFunc = (sortStr: string, descVal: any, ascVal: any) =>
    sortStr ? (sortStr.startsWith("-") ? descVal : ascVal) : ascVal;

  const sortParser = {
    toReq(sortField: string, sortOrder: 0 | 1 | -1 | null): string | null {
      if (!sortField || !sortOrder) return "";
      const _sort = `${sortOrder < 0 ? "-" : ""}${sortField}`;
      return _sort;
    },
    toPreSort(req: string): Presorter {
      return {
        sortField: sortFunc(req, req.slice(1), req),
        sortOrder: sortFunc(req, -1, 1) || "",
      };
    },
  };

  return { sortFunc, sortParser };
}

const contraintsMap: Record<
  ChoosenFilterMatchMode[keyof ChoosenFilterMatchMode],
  DatatableFilter["op"]
> = {
  [FilterMatchMode.STARTS_WITH]: "startsWith",
  [FilterMatchMode.CONTAINS]: "includes",
  [FilterMatchMode.ENDS_WITH]: "endsWith",
  [FilterMatchMode.EQUALS]: "same",
  [FilterMatchMode.NOT_EQUALS]: "not",
  [FilterMatchMode.LESS_THAN]: "lt",
  [FilterMatchMode.LESS_THAN_OR_EQUAL_TO]: "lte",
  [FilterMatchMode.GREATER_THAN]: "gt",
  [FilterMatchMode.GREATER_THAN_OR_EQUAL_TO]: "gte",
  [FilterMatchMode.BETWEEN]: "between",
  [FilterMatchMode.IN]: "in",
};

export function useTreatFilterRequest() {
  const filterFunc = () => {};
  const filterParser = {
    toReq: (meta: any) => {
      const filters: DatatableFilter[] = Object.entries(meta)
        .map(([field, value]: any) => {
          return {
            field,
            op: contraintsMap[
              value.matchMode as ChoosenFilterMatchMode[keyof ChoosenFilterMatchMode]
            ],
            value: value.value,
          };
        })
        .filter((filter) =>
          isArray(filter.value) ? filter.value.length : filter.value
        );
      return filters;
    },
  };

  return { filterParser, filterFunc };
}


