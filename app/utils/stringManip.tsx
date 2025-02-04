type FormatDateOptions = {
  dateOnly?: boolean;
};
export function formatDateTime(
  dateInput: unknown,
  options: FormatDateOptions = {},
  locale: string = "fr-FR"
): string {
  if (!(dateInput instanceof Date) && typeof dateInput !== "string") return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // weekday: "long",
  };

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    ...dateOptions,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const formatter = new Intl.DateTimeFormat(
    locale,
    options.dateOnly ? dateOptions : dateTimeOptions
  );
  return formatter.format(date);
}

export function formatDateYYYYMMDD(date?: Date) {
  return (date ? new Date(date) : new Date())
    .toISOString()
    .split("T")[0]
    .replaceAll("-", "");
}

export function formatNumberFr(
  number: unknown,
  options?: { withCurrency: boolean }
) {
  const _options: any = options?.withCurrency
    ? {
        style: "currency",
        currency: "EUR",
      }
    : {};

  if (typeof number === "number" && !isNaN(number)) {
    return new Intl.NumberFormat("fr-FR", _options).format(number);
  } else if (typeof number === "string") {
    return new Intl.NumberFormat("fr-FR", _options).format(commaToDot(number));
  } else {
    return new Intl.NumberFormat("fr-FR", _options).format(0);
  }
}

function commaToDot(str: unknown) {
  if (typeof str === "string") {
    const replaced = Number(str.replace(",", "."));
    return isNaN(replaced) ? 0 : replaced;
  } else if (typeof str === "number" && !isNaN(str)) return str;
  else return 0;
}

/**
 * 
 * @param str1 
 * @param str2 
 * @param options default operator includes
 * @returns 
 */
export function strongStringCompare(
  str1: unknown,
  str2: unknown,
  options: { op?: "includes" | "startsWith" | "endsWith" } = {}
): boolean {
  const { op = "includes" } = options;
  if (typeof str1 !== "string" || typeof str2 !== "string")
    return str1 === str2;
  return str1.toLowerCase()[op](str2.toLowerCase());
}

export function sortAooWithKeys<T>(
  array: T[],
  comparisonKeys: Partial<Record<keyof T, 1 | -1>>
): T[] {
  return [...array].sort((a, b) => {
    for (const key of Object.keys(comparisonKeys) as (keyof T)[]) {
      const order = comparisonKeys[key]!;
      const aValue = a[key];
      const bValue = b[key];

      if (aValue != null && bValue != null) {
        const comparison = String(aValue).localeCompare(String(bValue));
        if (comparison !== 0) {
          return order * comparison; // Apply sorting order
        }
      } else if (aValue != null) {
        return order; // `a` comes first if `bValue` is null/undefined
      } else if (bValue != null) {
        return -order; // `b` comes first if `aValue` is null/undefined
      }
    }
    return 0; // Equal values or no comparison keys matched
  });
}


export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "Ko", "Mo", "Go", "To", "Po"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = sizes[i];

  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  return `${value} ${size}`;
}

