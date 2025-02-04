import { KeyString } from "./types";

export function getFromPath(obj: KeyString, path: string, defaultValue = undefined) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? defaultValue;
}
