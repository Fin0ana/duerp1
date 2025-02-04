import { isArray } from "@/app/modules/utils/global";
import { KeyString } from "@/app/modules/utils/types";
import { IdName } from "@/app/types/global";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { useMemo, useState } from "react";

type CustomAutocompleteProps = AutoComplete["props"] & {
  value: KeyString[] | KeyString;
  onChange: (e: AutoCompleteChangeEvent) => void;
  options?: KeyString[];
  onCreateNew?: (e: KeyString[]) => void;
  field?: string;
  idField?: string;
  multiple?: boolean;
};

function CustomAutocomplete({
  options = [],
  value,
  onChange,
  onCreateNew = () => {},
  field = "name",
  idField = "_id",
  multiple = true,
  ...rest
}: CustomAutocompleteProps) {
  const [filteredOptions, setFilteredOptions] = useState<KeyString[]>([]);

  // transform the ["value1", "value2"] into [{ name: "value1" }, { name: "value2" }]
  // const _value = !isArray(value)
  //   ? value
  //   : value.map((v: string | KeyString) =>
  //       typeof v === "string" ? options.find((o) => o[field] === v) : v
  //     );

  const search = (e: AutoCompleteCompleteEvent) => {
    if (e.query.trim().length === 0) return;
    const _filteredOptions = options.filter((keyword) => {
      return keyword[field].toLowerCase().startsWith(e.query.toLowerCase());
    });
    const exactFilteredOptions = options.filter((keyword) => {
      return keyword[field].toLowerCase() === e.query.toLowerCase();
    });
    let __filteredOptions: KeyString[] = [];
    if (exactFilteredOptions.length > 0) {
      __filteredOptions = _filteredOptions;
    } else {
      __filteredOptions = [{ [field]: e.query }].concat(_filteredOptions);
    }
    setFilteredOptions(__filteredOptions);
  };

  const handleChange = (e: AutoCompleteChangeEvent) => {
    const values = e.value as KeyString[] | KeyString;
    onChange(e);
    setFilteredOptions([]);
    if (!isArray<KeyString>(values)) {
      (values[idField] || !values[field]) ? null : onCreateNew([values]);
      return;
    }
    const newKeywords = values.filter(
      (v) => typeof v !== "string" && !v[idField]
    );
    if (newKeywords.length <= 0) return;
    onCreateNew(newKeywords);
  };

  return (
    <>
      <AutoComplete
        {...rest}
        multiple={multiple}
        field={field}
        value={value}
        suggestions={filteredOptions}
        completeMethod={search}
        onChange={handleChange}
      />
    </>
  );
}

export default CustomAutocomplete;

