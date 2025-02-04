import { useMemo } from "react";
import { TPaginatedData } from "../types";

type Keys = { totalKey: string; dataKey: string };

export function usePagination<T>(
  paginated: TPaginatedData<T> | undefined,
  keys?: Keys
): [data: T, total: number] {
  if (!paginated) return [[] as T, 0];
  const { totalKey = "total", dataKey = "data" } = keys || {};
  const _data = paginated[dataKey];
  const _total = paginated[totalKey];
  const data: T = typeof _data !== "number" ? _data : ([] as T);
  const total: number = typeof _total === "number" ? _total : 0;
  return [data, total];
}

