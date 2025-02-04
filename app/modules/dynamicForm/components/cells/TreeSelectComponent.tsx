import { copyKeys, filterWithinDescendant } from "../../../utils/global";
import { KeyString } from "../../../utils/types";
import { InputText } from "primereact/inputtext";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { useEffect, useMemo, useRef, useState } from "react";
import { SelectValues } from "../../types";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

type TreeSelectComponentProps = {
  value: string;
  onChange: (e: TreeSelectChangeEvent) => void;
  inputId: string;
  options: { [key: string]: string }[];
  selectLabel?: string;
  selectValue?: string;
  childrenKey?: string;
  disabled: boolean;
};

function TreeSelectComponent({
  value,
  onChange,
  inputId,
  options,
  selectValue,
  selectLabel,
  childrenKey,
  disabled,
}: TreeSelectComponentProps) {
  const treatedCategories = useMemo(() => {
    const autoGetValue = (item: KeyString, key: string) => {
      if (typeof item !== "object") return item;
      return item[key] || item[selectLabel || "label"];
    };
    return copyKeys(options, [
      ["key", (item) => autoGetValue(item, selectValue || "value")],
      ["label", (item) => autoGetValue(item, selectLabel || "label")],
      ["children", childrenKey || "children"],
      ["selectable", (el) => !el[childrenKey || "children"]?.length],
      ["data", selectLabel || "label"],
    ]);
  }, [options]);

  const selectedValue = useMemo<KeyString>(() => {
    if (!value) return {};
    return { [value]: true };
  }, [value]);

  // Filter
  const [search, setSearch] = useState("");
  const filterRef = useRef<HTMLInputElement>(null);
  const resultCategories = useMemo(
    () =>
      filterWithinDescendant(treatedCategories, (el) =>
        el[selectLabel || "label"]?.toLowerCase().includes(search.toLowerCase())
      ),
    [search, treatedCategories]
  );
  return (
    <TreeSelect
      inputId={inputId}
      value={value}
      onChange={onChange}
      options={resultCategories}
      emptyMessage="Pas d'options"
      panelHeaderTemplate={
        <div className="px-4 mt-2">
          <IconField iconPosition="right" className=" w-full">
            <InputIcon className="pi pi-search"></InputIcon>
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
              placeholder="Rechercher"
              size="small"
              ref={filterRef}
            />
          </IconField>
          {/* {JSON.stringify(treatedCategories, null, 2)} */}
        </div>
      }
      disabled={disabled}
    ></TreeSelect>
  );
}

export default TreeSelectComponent;

