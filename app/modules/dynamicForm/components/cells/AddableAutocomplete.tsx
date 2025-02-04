// import React, { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
// import {
//   AutoComplete,
//   AutoCompleteChangeEvent,
//   AutoCompleteCompleteEvent,
//   AutoCompleteSelectEvent,
// } from "primereact/autocomplete";
// import { KeyString } from "../../../utils/types";
// import { Chip } from "primereact/chip";
// import { isArray } from "../../../../utils/objectManip";

// type AddableAutoCompleteProps = {
//   value: KeyString[] | KeyString | undefined;
//   onChange: (e: AutoCompleteChangeEvent) => void;
//   onSelect?: (e: AutoCompleteSelectEvent) => void;
//   selectOptions?: KeyString[];
//   onCreateNew?: (e: string) => Promise<void>;
//   onDelete?: (item: KeyString) => void;
//   field?: string;
//   idField?: string;
//   multiple?: boolean;
//   loading?: boolean;
//   disabled?: boolean;
//   placeholder?: string
//   className?: string
// };

// export default function AddableAutoComplete({
//   value,
//   onChange,
//   onSelect,
//   selectOptions = [],
//   field = "name",
//   idField = "_id",
//   onCreateNew,
//   onDelete,
//   multiple = false,
//   loading,
//   disabled,
//   placeholder,
//   className,
// }: AddableAutoCompleteProps) {
//   const [suggestions, setSuggestions] = useState<KeyString[]>();

//   const search = (event: AutoCompleteCompleteEvent) => {
//     let _suggestions: KeyString[] = [];
//     const _selectOptions = [...selectOptions];
//     const query = event.query.trim();
//     let newElement: KeyString = { name: query, _id: "new", new: true };
//     if (!hasExactTermIn(query)) {
//       _selectOptions.unshift(newElement);
//     }
//     if (!query.length) {
//       _suggestions = _selectOptions;
//       setSuggestions(_suggestions);
//       return;
//     }

//     _suggestions = _selectOptions.filter((country) => {
//       return country[field].toLowerCase().includes(event.query.toLowerCase());
//     });

//     setSuggestions(_suggestions);
//   };

//   const hasExactTermIn = (query: string) => {
//     return !!suggestions?.some(
//       (s) => query.toLowerCase() === String(s[field]).toLowerCase()
//     );
//   };

//   const itemTemplate = (item: KeyString) => {
//     return item.new ? (
//       <div className="flex items-center gap-2">
//         Ajouter :{" "}
//         <Chip
//           className="border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50"
//           label={item.name}
//         ></Chip>
//       </div>
//     ) : (
//       <div className="flex justify-between items-center">
//         <div>{item[field]}</div>
//         {onDelete ? (
//           <div onClick={handleDelete(item)}>
//             <i className="pi pi-times"></i>
//           </div>
//         ) : (
//           <></>
//         )}
//       </div>
//     );
//   };

//   /**
//    * Replace the newly added option to existant
//    */
//   const trueValue = useMemo<KeyString[] | KeyString | undefined>(() => {
//     if (!value) return value;
//     if (isArray(value)) {
//       return value.map((v) => {
//         const idIfExists =
//           selectOptions.find((option) => option[field] === v[field])?.[
//             idField
//           ] || "new";
//         return v[idField] === "new" ? { ...v, [idField]: idIfExists } : v;
//       });
//     }
//     const idIfExists =
//       selectOptions.find((option) => option[field] === value[field])?.[
//         idField
//       ] || "new";
//     return value[idField] === "new"
//       ? { ...value, [idField]: idIfExists }
//       : value;
//   }, [selectOptions, value]);

//   // Add new
//   const handleSelect = async (e: AutoCompleteSelectEvent) => {
//     if (e.value?._id === "new") {
//       await onCreateNew?.(e.value.name);
//     }
//     onSelect?.(e);
//   };

//   // Delete
//   const handleDelete = (item: KeyString) => (e: MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     onDelete?.(item);
//   };

//   return (
//     <div className="relative">
//       <AutoComplete
//         pt={{
//           root: { className: "w-full" },
//           container: { className: "w-full" },
//         }}
//         field={field}
//         value={trueValue}
//         suggestions={suggestions}
//         completeMethod={search}
//         onChange={onChange}
//         itemTemplate={itemTemplate}
//         multiple={multiple}
//         onSelect={handleSelect}
//         inputClassName="w-full"
//         disabled={loading || disabled}
//         placeholder={placeholder}
//         className={className}
//       />
//       {loading ? (
//         <div className="absolute top-1/2 -translate-y-1/2 right-3">
//           <i className="pi pi-spin pi-spinner"></i>
//         </div>
//       ) : (
//         <></>
//       )}
//     </div>
//   );
// }


import React, { useState, useMemo } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Chip } from "primereact/chip";
import { isArray } from "../../../../utils/objectManip";

export default function AddableAutoComplete({
  value,
  onChange,
  onSelect,
  selectOptions = [],
  field = "name",
  idField = "_id",
  onCreateNew,
  onDelete,
  multiple = false,
  loading,
  disabled,
  placeholder,
  className,
}) {
  const [suggestions, setSuggestions] = useState([]);

  const search = (event) => {
    let _suggestions = [];
    const _selectOptions = [...selectOptions];
    const query = event.query.trim();
    let newElement = { name: query, _id: "new", new: true };
    if (!hasExactTermIn(query)) {
      _selectOptions.unshift(newElement);
    }
    if (!query.length) {
      _suggestions = _selectOptions;
      setSuggestions(_suggestions);
      return;
    }

    _suggestions = _selectOptions.filter((country) => {
      return country[field].toLowerCase().includes(event.query.toLowerCase());
    });

    setSuggestions(_suggestions);
  };

  const hasExactTermIn = (query) => {
    return !!suggestions?.some(
      (s) => query.toLowerCase() === String(s[field]).toLowerCase()
    );
  };

  const itemTemplate = (item) => {
    return item.new ? (
      <div className="flex items-center gap-2">
        Ajouter :{" "}
        <Chip
          className="border border-blue-500 text-blue-500 bg-transparent hover:bg-blue-50"
          label={item.name}
        ></Chip>
      </div>
    ) : (
      <div className="flex justify-between items-center">
        <div>{item[field]}</div>
        {onDelete ? (
          <div onClick={handleDelete(item)}>
            <i className="pi pi-times"></i>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const trueValue = useMemo(() => {
    if (!value) return value;
    if (isArray(value)) {
      return value.map((v) => {
        const idIfExists =
          selectOptions.find((option) => option[field] === v[field])?.[idField] || "new";
        return v[idField] === "new" ? { ...v, [idField]: idIfExists } : v;
      });
    }
    const idIfExists =
      selectOptions.find((option) => option[field] === value[field])?.[idField] || "new";
    return value[idField] === "new"
      ? { ...value, [idField]: idIfExists }
      : value;
  }, [selectOptions, value]);

  const handleSelect = async (e) => {
    if (e.value?._id === "new") {
      await onCreateNew?.(e.value.name);
    }
    onSelect?.(e);
  };

  const handleDelete = (item) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(item);
  };

  return (
    <div className="relative">
      <AutoComplete
        pt={{
          root: { className: "w-full" },
          container: { className: "w-full" },
        }}
        field={field}
        value={trueValue}
        suggestions={suggestions}
        completeMethod={search}
        onChange={onChange}
        itemTemplate={itemTemplate}
        multiple={multiple}
        onSelect={handleSelect}
        inputClassName="w-full"
        disabled={loading || disabled}
        placeholder={placeholder}
        className={className}
      />
      {loading ? (
        <div className="absolute top-1/2 -translate-y-1/2 right-3">
          <i className="pi pi-spin pi-spinner"></i>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
