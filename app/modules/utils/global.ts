import { AxiosError } from "axios";
import type { KeyString } from "./types";
import { Toast, ToastMessage } from "primereact/toast";
import { createRef } from "react";

export const dynamicError = (error: any): string => {
  return error?.response?.data ? error.response.data.message : error.message;
};

type AxiosErrorData = {
  message?: string;
  header?: {
    statut: number;
    message: string;
  };
};

export function dynamicErrorAxios(error: unknown): string {
  let message = "Une erreur inconnue est survenue.";

  // Vérification si l'erreur est une erreur Axios
  if (isAxiosError<AxiosErrorData>(error)) {
    if (error.response) {
      // Réponse du serveur avec un code d'erreur (4xx, 5xx)
      message = `Erreur ${error.response.status}: ${
        error.response.data.header?.message ||
        error.response.data?.message ||
        error.response.statusText ||
        error.message
      }`;
    } else if (error.request) {
      // Aucune réponse reçue (problème de réseau ou serveur non joignable)
      message = "Aucune réponse du serveur. Vérifiez votre connexion.";
    } else {
      // Erreur avant la requête (ex. mauvaise configuration)
      message = `Erreur de requête: ${error.message}`;
    }
  }
  // Vérification si l'erreur est une erreur de validation Yup (ou autre)
  else if (isValidationError(error)) {
    message = error.errors ? error.errors.join(", ") : "Erreur de validation.";
  }
  // Cas des erreurs JavaScript générales
  else if (error instanceof Error) {
    message = error.message;
  }

  return message;
}

// Fonction utilitaire pour vérifier si c'est une erreur Axios
function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError<T>).isAxiosError !== undefined;
}

// Fonction utilitaire pour vérifier si c'est une erreur de validation (ex : Yup)
function isValidationError(
  error: unknown
): error is { name: string; errors: string[] } {
  return (error as { name: string }).name === "ValidationError";
}

export async function asyncTimeout(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export function filterWithinDescendant(
  arr: any[],
  filterFn: (el: any) => boolean,
  childrenKey: string = "children"
) {
  if (!Array.isArray(arr)) return arr;

  function copy(o: any) {
    return Object.assign({}, o);
  }

  return arr.map(copy).filter(function f(o) {
    if (filterFn(o)) return true;

    if (o[childrenKey]) {
      return !!(o[childrenKey] = o[childrenKey].map(copy).filter(f)).length;
    }
  });
}

/**
 *  This function takes an array of objects and copy it with keys defined in the keyMappings
 * @param arrayToCopy
 * @param keyMappings An array of array of string that take the first string and copy to the second
 */
export function copyKeys(
  arrayToCopy: KeyString[],
  keyMappings: [string, string | ((object: KeyString) => any)][]
): KeyString[] {
  return arrayToCopy.map((item) => {
    const newItem: KeyString = { ...item };
    keyMappings.forEach(([newKey, key]) => {
      if (
        typeof key !== "string" ||
        Object.prototype.hasOwnProperty.call(newItem, key)
      ) {
        newItem[newKey] = typeof key === "string" ? newItem[key] : key(newItem);
        // delete newItem[key]
      }
    });
    // Recursively copy keys in children arrays
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = copyKeys(newItem.children, keyMappings);
    }
    return newItem;
  });
}

export function isArray<T extends any>(el: unknown): el is T[] {
  if (typeof el === "object" && Array.isArray(el)) return true;
  return false;
}

export function hasType<T>(obj: any, properties: readonly string[]): obj is T {
  return (
    obj &&
    typeof obj === "object" &&
    properties.every((property) => property in obj)
  );
}

export function oneOf<T = string>(
  element: any,
  equals: readonly T[]
): element is T {
  return equals.some((item) => item === element);
}

export function isDeepEqual(obj1: KeyString, obj2: KeyString) {
  if (obj1 === null && obj2 === null) {
    return true;
  }

  if (obj1 === null || obj2 === null) {
    return false;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 !== "object") {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export const debounce = (func: (...args2: any[]) => any, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const compareTwoStrings = (
  string1: unknown,
  string2: unknown
): boolean => {
  if (typeof string1 !== "string" || typeof string2 !== "string") return false;
  return string1.toLocaleLowerCase().includes(string2.toLocaleLowerCase());
};

export function getDepth(
  obj: Record<string, any>[],
  childrenKey: string = "children",
  depth: number = 0
): number {
  if (!obj.length) return depth;
  return Math.max(
    ...obj.map((node) =>
      node[childrenKey]
        ? getDepth(node[childrenKey], childrenKey, depth + 1)
        : depth
    )
  );
}

export const toastRef = createRef<Toast>();

export const showToast = (_options: ToastMessage) => {
  const options: ToastMessage = { ..._options, life: _options.life || 10000 };
  if (toastRef.current) {
    toastRef.current.show(options);
  }
};

