// "use client";
// import React, {
//   ChangeEvent,
//   Fragment,
//   MouseEvent,
//   Suspense,
//   forwardRef,
//   useCallback,
//   useEffect,
//   useImperativeHandle,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   DataTable,
//   DataTableFilterMeta,
//   DataTableSelectionMultipleChangeEvent,
//   DataTableSelectionSingleChangeEvent,
//   DataTableStateEvent,
// } from "primereact/datatable";
// import {
//   Column,
//   ColumnFilterApplyClickEvent,
//   ColumnFilterElementTemplateOptions,
// } from "primereact/column";
// import { IconField } from "primereact/iconfield";
// import { InputIcon } from "primereact/inputicon";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";
// import {
//   asyncTimeout,
//   dynamicError,
//   isArray,
//   debounce,
//   compareTwoStrings,
// } from "../../utils/global";
// import {
//   DEFAULT_PAGE_LIMIT,
//   DEFAULT_PAGE_NUMBER,
//   getDefaultFilterType,
//   getDefaultValue,
// } from "../constants";
// import type {
//   TPaginatedData,
//   TDatatableHeader,
//   TPrimeTableRequestParams,
//   TAdminDatatableProps,
//   DatatableFilter,
// } from "../types";
// import { KeyString } from "../../utils/types";
// import {
//   useClickAway,
//   useDebounce,
//   useEffectOnce,
//   useLocalStorage,
//   useThrottleFn,
// } from "react-use";
// import { showToast } from "../../utils/global";
// import {
//   Presorter,
//   useTreatFilterRequest,
//   useTreatSortRequest,
// } from "../composable/useTreatRequest";
// import { InputTextarea } from "primereact/inputtextarea";
// import { FilterMatchMode } from "primereact/api";
// import DynamicFormCore from "../../dynamicForm/components/bases/DynamicFormCore";
// import { TDynamicForm } from "../../dynamicForm/types";
// import { ColumnGroup } from "primereact/columngroup";
// import { Row } from "primereact/row";
// import { getDepth } from "../../utils/global";
// export type TAdminDatatableMethods = {
//   refresh: () => Promise<void>;
// };
// const _AdminDataTable = forwardRef<
//   TAdminDatatableMethods,
//   TAdminDatatableProps
// >(
//   (
//     {
//       headers,
//       noDataText = "Pas de données",
//       hasSearch = false,
//       size,
//       selection,
//       setSelection = () => {},
//       dataId = "_id",
//       lazy,
//       datas,
//       fetcher,
//       paramsFormatter,
//       dataKey = "data",
//       totalKey = "total",
//       perPage,
//       captureQuery,
//       loading: loadingProp,
//       rowClassName,
//     },
//     ref
//   ) => {
//     // Getter
//     const router = useRouter();
//     const query = useSearchParams();

//     const queryObj: KeyString = useMemo(() => {
//       const _query: KeyString = {};
//       query.forEach((value, key) => {
//         _query[key] = value;
//       });
//       return _query;
//     }, [query]);

//     const [loading, setLoading] = useState(false);

//     const formatToLaravelRequest = (req: TPrimeTableRequestParams) => {
//       return {
//         page: req.page + 1,
//         pagination: req.limit,
//         sort: req.sort || undefined,
//         search: query.get("search") as string,
//         ...(req.filter || {}),
//       };
//     };
//     const formatToMyExpressRequest = (req: TPrimeTableRequestParams) => {
//       return {
//         page: req.page,
//         limit: req.limit,
//         sort: req.sort || undefined,
//         search: req.search || undefined,
//         filter: req.filter || undefined,
//       };
//     };

//     const formatGetter =
//       lazy && paramsFormatter ? paramsFormatter : formatToMyExpressRequest;

//     const refresh = async () => {
//       await asyncTimeout(50);
//       try {
//         if (!fetcher) return;
//         setLoading(true);
//         await fetcher(
//           formatGetter({
//             page,
//             limit,
//             sort: queryObj.sort,
//             search: queryObj.search,
//             filter: queryObj.filter,
//           })
//         );
//         if (queryObj.search) setSearch(queryObj.search);
//         setLoading(false);
//       } catch (error) {
//         showToast({
//           closable: false,
//           life: 3000,
//           severity: "error",
//           summary: "Erreur",
//           detail: dynamicError(error),
//         });
//         console.error(error);
//         setLoading(false);
//       }
//     };
//     const [prevRoute, setPrevRoute] = useLocalStorage(
//       "previousRouteDatatable",
//       ""
//     );
//     const captureRouteParams = () => {
//       captureQuery && query && setPrevRoute(query.toString());
//     };

//     useEffect(() => {
//       if (!lazy) return;
//       captureRouteParams();
//       refresh();
//     }, [
//       queryObj.page,
//       queryObj.limit,
//       queryObj.sort,
//       queryObj.search,
//       queryObj.filter,
//     ]);

//     useImperativeHandle(ref, () => ({
//       refresh,
//     }));

//     // Pagination
//     const totalRecords = useMemo(() => {
//       if (!lazy) return undefined;
//       const total = datas?.[totalKey || "total"];
//       return typeof total === "number" ? total : 0;
//     }, [datas]);

//     const [noQPage, setNoQPage] = useState<number | undefined>(
//       DEFAULT_PAGE_NUMBER
//     );
//     const [noQLimit, setNoQLimit] = useState<number | undefined>(
//       DEFAULT_PAGE_LIMIT
//     );
//     const page = useMemo(() => {
//       const pageParam = lazy ? query.get("page") : noQPage;
//       return +(pageParam || DEFAULT_PAGE_NUMBER);
//     }, [queryObj.page, noQPage]);

//     const limit = useMemo(() => {
//       const limitParam = lazy ? query.get("limit") : noQLimit;
//       return +(limitParam || perPage || DEFAULT_PAGE_LIMIT);
//     }, [queryObj.limit, noQLimit]);

//     const first = useMemo(() => page * limit, [page, limit]);

//     const onPage = (event: DataTableStateEvent) => {
//       const { page, rows } = event;
//       if (!lazy) {
//         setNoQPage(page);
//         setNoQLimit(rows);
//         return;
//       }
//       const newQuery = {
//         ...queryObj,
//         page: page?.toString(),
//         limit: rows?.toString(),
//       };
//       router.push(`?${objToReq(newQuery)}`);
//     };

//     // Search
//     const [search, setSearch] = useState("");
//     const DEBOUNCE_TIME = 1000;

//     const inputSearchRef = useRef<HTMLInputElement>(null);

//     const debouncedChangeHandler = useCallback(
//       debounce((newValue) => {
//         if (!lazy) return;
//         const newQuery = {
//           ...queryObj,
//           search: newValue,
//         };
//         router.push(`?${objToReq(newQuery)}`);
//       }, DEBOUNCE_TIME),
//       []
//     );

//     const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
//       const _search = e.target.value;
//       setSearch(_search);
//       if (_search && _search.trim().length < 3) return;
//       debouncedChangeHandler(_search);
//     };

//     const onResetSearch = () => {
//       const _search = "";
//       setSearch(_search);
//       debouncedChangeHandler(_search);
//       inputSearchRef.current?.focus();
//     };

//     const objToReq = (newQuery: KeyString) => {
//       return Object.entries(newQuery)
//         .map(
//           ([key, value]) =>
//             `${key}=${
//               typeof value === "object" ? JSON.stringify(value) : value
//             }`
//         )
//         .join("&");
//     };

//     // Sort
//     const { sortParser } = useTreatSortRequest();
//     const [noQSort, setNoQSort] = useState<string | null>("");
//     const onSort = (event: DataTableStateEvent) => {
//       const { sortField = "", sortOrder = 0 } = event;
//       if (!lazy) {
//         setNoQSort(sortParser.toReq(sortField, sortOrder));
//         return;
//       }
//       const newQuery = {
//         ...queryObj,
//         sort: sortParser.toReq(sortField, sortOrder),
//       };
//       router.push(`?${objToReq(newQuery)}`);
//     };

//     const sort = useMemo<Presorter | undefined>(() => {
//       const sortParam = (lazy ? query.get("sort") : noQSort) || "";
//       return sortParser.toPreSort(sortParam);
//     }, [queryObj.sort, noQSort]);

//     // Filter
//     const { filterParser } = useTreatFilterRequest();

//     const [noQFilter, setNoQFilter] = useState<DatatableFilter[] | null>([]);
//     const hasFilter = useMemo(() => {
//       return headers.some((header) => header.filter);
//     }, [headers]);

//     const initFilter = useMemo(() => {
//       return headers.reduce(
//         (acc, curr) =>
//           curr.filter
//             ? {
//                 ...acc,
//                 [curr.id]: {
//                   value: getDefaultValue(curr.filter.type),
//                   matchMode: getDefaultFilterType(curr.filter.type),
//                 },
//               }
//             : acc,
//         {} as KeyString
//       );
//     }, [headers]);

//     const [filters, setFilters] = useState<DataTableFilterMeta | undefined>(
//       initFilter
//     );

//     const onFilter = (e: DataTableStateEvent) => {
//       setFilters(e.filters);
//     };

//     const onFilterApplyClick = () => {
//       pushToNewFilter(filters);
//     };
//     const onFilterResetClick = (header: TDatatableHeader) => () => {
//       if (!filters || !header.filter) return;
//       const _filters: DataTableFilterMeta = {
//         ...filters,
//         [header.id]: {
//           ...filters[header.filter.id],
//           value: getDefaultValue(header.filter.type),
//         },
//       };
//       pushToNewFilter(_filters);
//     };

//     const resetFilter = () => {
//       setFilters(initFilter);
//       pushToNewFilter(initFilter);
//     };

//     const pushToNewFilter = (newFilters: DataTableFilterMeta | undefined) => {
//       if (!lazy) {
//         setNoQFilter(filterParser.toReq(newFilters));
//         return;
//       }
//       const newQuery = {
//         ...queryObj,
//         filter: filterParser.toReq(newFilters),
//       };
//       router.push(`?${objToReq(newQuery)}`);
//     };

//     const verifiedRowFilterTemplate =
//       (header: TDatatableHeader) =>
//       ({ value, filterApplyCallback }: ColumnFilterElementTemplateOptions) => {
//         if (!header.filter) return;
//         const item: TDynamicForm = {
//           ...header.filter,
//           value: value || getDefaultValue(header.filter.type),
//           id: ``,
//           label: "",
//           placeholder: `Filtre ${header.label}`,
//         };

//         return (
//           <DynamicFormCore
//             item={item}
//             id={`${header.id}-filter`}
//             onChange={filterApplyCallback}
//           />
//         );
//       };

//     // Select
//     const updateSelectedData = (
//       e: DataTableSelectionMultipleChangeEvent<any[]>
//     ) => {
//       setSelection((val) => {
//         const first = e.value[0];

//         if (!e.value.length && first)
//           return val.some((el) =>
//             e.value.some((el2) => el[dataId] === el2[dataId])
//           )
//             ? val.filter((el) => el[dataId] === e.value[0][dataId])
//             : [...val, first];

//         return e.value;
//       });
//     };

//     // Edit
//     const [chosenOne, setChosenOne] = useState<KeyString>();
//     const [chosenHeader, setChosenHeader] = useState<TDatatableHeader>();
//     const [isCellEdited, setIsCellEdited] = useState(false);
//     const editorRef = useRef<HTMLTextAreaElement>(null);
//     const handleChooseEdition =
//       (header: TDatatableHeader, cell: KeyString) => async () => {
//         if (header.transformerFn || header.template) return;
//         setChosenHeader(header);
//         setChosenOne(cell);
//         asyncTimeout(500).then(() => {
//           editorRef.current?.select();
//         });
//       };

//     const handleEditCell =
//       (header: TDatatableHeader) => (e: ChangeEvent<HTMLTextAreaElement>) => {
//         setChosenOne((v) => ({
//           ...v,
//           [header.id]: e.target.value,
//         }));
//         setIsCellEdited(true);
//       };

//     const handleConfirmEdit = async () => {
//       if (!chosenHeader || !chosenOne || !isCellEdited) {
//         setChosenOne(undefined);
//         return;
//       }
//       await chosenHeader.onChangeCell?.({
//         _id: chosenOne._id,
//         [chosenHeader.id]: chosenOne[chosenHeader.id],
//       });

//       setIsCellEdited(false);
//       setChosenOne(undefined);
//     };

//     useClickAway(editorRef, handleConfirmEdit);

//     // Special header
//     const headerDepth = getDepth(headers) + 1;
//     const childrenHeaders: TDatatableHeader[] = headers.reduce((acc, curr) => {
//       if (!curr.children?.length) return acc;
//       return [...acc, ...curr.children];
//     }, [] as TDatatableHeader[]);
//     const headerGroup = (
//       <ColumnGroup>
//         <Row>
//           {selection && (
//             <Column
//               selectionMode="multiple"
//               headerStyle={{ width: "3rem" }}
//               rowSpan={headerDepth}
//             />
//           )}
//           {headers.map((header) => (
//             <Column
//               key={header.id}
//               field={header.children?.length ? undefined : header.id}
//               header={header.label}
//               rowSpan={header.children?.length ? 1 : 2}
//               colSpan={header.children?.length || 1}
//               sortable={header.sortable}
//               filter={!!header.filter}
//               filterElement={verifiedRowFilterTemplate(header)}
//               filterField={header.id}
//               showFilterMatchModes={false}
//               onFilterApplyClick={onFilterApplyClick}
//               onFilterClear={onFilterResetClick(header)}
//             ></Column>
//           ))}
//         </Row>
//         <Row>
//           {childrenHeaders.map((header) => (
//             <Column
//               key={header.id}
//               field={header.id}
//               header={header.label}
//               rowSpan={1}
//               colSpan={1}
//             ></Column>
//           ))}
//         </Row>
//       </ColumnGroup>
//     );

//     // The column body (put in a function bc it repeats)
//     const BodyColumn = (header: TDatatableHeader) => (
//       <Column
//         key={header.id}
//         field={header.id}
//         headerClassName={header.noWrapHeader ? "white-space-nowrap " : ""}
//         pt={{
//           headerContent: {
//             className: header.center ? "justify-center " : "",
//           },
//         }}
//         body={(slotProps) => (
//           <span onDoubleClick={handleChooseEdition(header, slotProps)}>
//             {header.template ? (
//               <header.template {...slotProps} />
//             ) : header.transformerFn ? (
//               header.transformerFn(slotProps[header.id])
//             ) : header.advancedEdit ? (
//               "edit piaf"
//             ) : header.simpleEdit &&
//               chosenHeader?.id === header.id &&
//               chosenOne?._id === slotProps._id ? (
//               <InputTextarea
//                 className="p-1 w-full"
//                 value={chosenOne?.[header.id] || ""}
//                 onChange={handleEditCell(header)}
//                 autoResize
//                 ref={editorRef}
//               ></InputTextarea>
//             ) : (
//               slotProps[header.id] || (
//                 <span className="text-gray-300">Vide</span>
//               )
//             )}
//           </span>
//         )}
//         className={
//           header.columnClassName + " " + (header.center ? "text-center " : "")
//         }
//         style={header.columnStyle}
//       />
//     );

//     // Display
//     const dataToDisplay = useMemo(() => {
//       if (!lazy) {
//         if (!search) return datas;

//         return (
//           datas?.filter((data) => {
//             return headers.some((header) =>
//               compareTwoStrings(data[header.id], search)
//             );
//           }) || []
//         );
//       }
//       const data = datas?.[dataKey || "data"];
//       return isArray(data) ? data : [];
//     }, [datas, search]);

//     return (
//       <div>
//         <div className="flex justify-content-between align-items-center">
//           <div className={`my-2 w-full ${hasSearch ? "" : "hidden"}`}>
//             <IconField
//               className="relative w-full lg:w-[25rem]"
//               iconPosition="left"
//             >
//               <InputIcon className="pi pi-search"> </InputIcon>
//               <InputText
//                 value={search}
//                 onChange={onSearch}
//                 className="w-full"
//                 placeholder="Rechercher..."
//                 ref={inputSearchRef}
//               />
//               {search ? (
//                 <div
//                   className="absolute top-1/2 -translate-x-3 -translate-y-1/2 right-0"
//                   onClick={onResetSearch}
//                 >
//                   <i className="pi pi-times text-sm cursor-pointer"></i>
//                 </div>
//               ) : (
//                 <></>
//               )}
//             </IconField>
//           </div>
//           <div
//             className={`flex gap-2 ${hasSearch || selection ? "" : "hidden"}`}
//           >
//             {selection && (
//               <div className="flex items-center">
//                 <Button
//                   label="Déselectionner"
//                   size="small"
//                   disabled={!selection.length}
//                   onClick={() => setSelection([])}
//                 />
//               </div>
//             )}
//             {hasFilter && (
//               <span className="flex items-center">
//                 <Button
//                   icon="pi pi-filter-slash"
//                   size="small"
//                   onClick={resetFilter}
//                 />
//               </span>
//             )}
//           </div>
//         </div>
//         <DataTable
//           lazy={lazy}
//           value={dataToDisplay}
//           stripedRows
//           loading={loadingProp || loading}
//           className="w-full"
//           paginator
//           rows={limit}
//           first={first}
//           onPage={onPage}
//           rowsPerPageOptions={[5, 10, 20, 50, 100]}
//           totalRecords={totalRecords}
//           size={size === "medium" ? undefined : size || "small"}
//           selection={selection || []}
//           onSelectionChange={updateSelectedData}
//           selectionMode={selection ? "checkbox" : null}
//           dataKey={dataId}
//           paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
//           currentPageReportTemplate="{first} à {last} dans {totalRecords}"
//           removableSort
//           onSort={onSort}
//           sortMode="single"
//           sortField={sort?.sortField}
//           sortOrder={sort?.sortOrder}
//           filterDisplay="menu"
//           filters={filters}
//           onFilter={onFilter}
//           emptyMessage={noDataText}
//           headerColumnGroup={headerGroup}
//           rowClassName={rowClassName}
//         >
//           {selection && (
//             <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
//           )}
//           {headers.map((header) =>
//             !header.children?.length
//               ? BodyColumn(header)
//               : header.children.map((header2) => BodyColumn(header2))
//           )}
//         </DataTable>
//       </div>
//     );
//   }
// );

// const AdminDataTable = forwardRef<TAdminDatatableMethods, TAdminDatatableProps>(
//   (props, ref) => {
//     const dataTableRef = useRef<TAdminDatatableMethods>(null);

//     useImperativeHandle(ref, () => ({
//       refresh:
//         dataTableRef.current === null
//           ? async () => {}
//           : dataTableRef.current?.refresh,
//     }));

//     return (
//       <Suspense fallback={<>datatable</>}>
//         <_AdminDataTable ref={dataTableRef} {...props}></_AdminDataTable>
//       </Suspense>
//     );
//   }
// );

// export default AdminDataTable;

// // Utility functions

// const Filter = {
//   toReq: ({ filters }: DataTableStateEvent) => {
//     return Object.entries(filters).reduce((acc, [filterKey, filterValue]) => {
//       return {
//         ...acc,
//         [`filter[${filterKey}]`]:
//           typeof filterValue !== "string" && "value" in filterValue
//             ? filterValue.value
//             : filterValue,
//       };
//     }, {});
//   },
//   resetFilter: (filters: DataTableFilterMeta) => {
//     return Object.entries(filters).reduce((acc, [key]) => {
//       return { ...acc, [key]: "" };
//     }, {});
//   },
// };

// // const RecursiveColumn = (headers: TDatatableHeader[]) => {
// //   return headers.map((header) =>
// //     header.children?.length ? (
// //       <Column
// //         key={header.id}
// //         header={header.label}
// //         colSpan={header.children.length}
// //         rowSpan={getDepth(header.children)}
// //       >
// //         {RecursiveColumn(header.children)}
// //       </Column>
// //     ) : (
// //       <Column
// //         field={header.id}
// //         header={header.label}
// //         rowSpan={headerDepth}
// //         colSpan={(header.children?.length || 0) + 1}
// //       ></Column>
// //     )
// //   );
// // };


"use client";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { debounce } from "lodash";
import {
  asyncTimeout,
  dynamicError,
  showToast
} from "../../utils/global";
import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_NUMBER
} from "../constants";
import {
  useTreatFilterRequest,
  useTreatSortRequest
} from "../composable/useTreatRequest";

const AdminDataTable = forwardRef((props, ref) => {
  const {
    headers,
    noDataText = "Pas de données", 
    hasSearch = false,
    lazy,
    datas,
    fetcher,
    paramsFormatter,
    perPage,
    captureQuery,
    loading: loadingProp
  } = props;

  const router = useRouter();
  const query = useSearchParams();

  const queryObj = useMemo(() => {
    const _query = {};
    query.forEach((value, key) => {
      _query[key] = value;
    });
    return _query;
  }, [query]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const inputSearchRef = useRef(null);

  const DEBOUNCE_TIME = 1000;

  const formatToMyExpressRequest = (req) => {
    return {
      page: req.page,
      limit: req.limit,
      sort: req.sort || undefined,
      search: req.search || undefined,
      filter: req.filter || undefined
    };
  };

  const formatGetter = lazy && paramsFormatter ? paramsFormatter : formatToMyExpressRequest;

  const refresh = async () => {
    await asyncTimeout(50);
    try {
      if (!fetcher) return;
      setLoading(true);
      await fetcher(
        formatGetter({
          page: queryObj.page || DEFAULT_PAGE_NUMBER,
          limit: queryObj.limit || DEFAULT_PAGE_LIMIT,
          sort: queryObj.sort,
          search: queryObj.search,
          filter: queryObj.filter
        })
      );
      setLoading(false);
    } catch (error) {
      showToast({
        closable: false,
        life: 3000,
        severity: "error",
        summary: "Erreur",
        detail: dynamicError(error)
      });
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh
  }));

  useEffect(() => {
    if (lazy) {
      refresh();
    }
  }, [queryObj.page, queryObj.limit, queryObj.sort, queryObj.search, queryObj.filter]);

  const debouncedChangeHandler = useCallback(
    debounce((newValue) => {
      if (!lazy) return;
      const newQuery = {
        ...queryObj,
        search: newValue
      };
      router.push(`?${objToReq(newQuery)}`);
    }, DEBOUNCE_TIME),
    [queryObj, router]
  );

  const onSearch = (e) => {
    const _search = e.target.value;
    setSearch(_search);
    if (_search && _search.trim().length < 3) return;
    debouncedChangeHandler(_search);
  };

  const onResetSearch = () => {
    setSearch("");
    debouncedChangeHandler("");
    inputSearchRef.current?.focus();
  };

  const objToReq = (newQuery) => {
    return Object.entries(newQuery)
      .map(([key, value]) => `${key}=${typeof value === "object" ? JSON.stringify(value) : value}`)
      .join("&");
  };

  const { sortParser } = useTreatSortRequest();
  const { filterParser } = useTreatFilterRequest();

  const onSort = (event) => {
    const { sortField = "", sortOrder = 0 } = event;
    if (!lazy) return;
    const newQuery = {
      ...queryObj,
      sort: sortParser.toReq(sortField, sortOrder)
    };
    router.push(`?${objToReq(newQuery)}`);
  };

  const onFilter = (e) => {
    setFilters(e.filters);
  };

  const resetFilter = () => {
    setFilters({});
    const newQuery = {
      ...queryObj,
      filter: {}
    };
    router.push(`?${objToReq(newQuery)}`);
  };

  return (
    <div>
      {hasSearch && (
        <div className="search-bar">
          <InputText
            ref={inputSearchRef}
            value={search}
            onChange={onSearch}
            placeholder="Rechercher..."
          />
          <Button label="Réinitialiser" onClick={onResetSearch} />
        </div>
      )}
      <DataTable
        value={datas?.data}
        paginator={true}
        rows={perPage || DEFAULT_PAGE_LIMIT}
        totalRecords={datas?.total}
        lazy={lazy}
        loading={loadingProp || loading}
        onSort={onSort}
        onFilter={onFilter}
        filters={filters}
      >
        {headers.map((header) => (
          <Column key={header.id} field={header.id} header={header.label} />
        ))}
      </DataTable>
    </div>
  );
});

export default AdminDataTable;




