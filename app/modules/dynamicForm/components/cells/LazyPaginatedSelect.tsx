import {
  Dropdown,
  DropdownChangeEvent,
  DropdownFilterEvent,
} from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntersection, useDebounce } from "react-use";
import { SelectValues } from "../../types";
import { LaravelRequest, TPaginatedData } from "../../../datatable/types.d";
import { KeyString } from "../../../utils/types";

type LazyPaginatedSelectProps = {
  value: SelectValues;
  onChange: (e: DropdownChangeEvent) => void;
  selectLabel?: string;
  selectValue?: string;
  filter?: boolean;
  fetcher: (p: LaravelRequest) => Promise<TPaginatedData<any>>;
  oneFetcher: (id: string | number) => Promise<any>;
  dataKey?: string;
  totalKey?: string;
  inputId: string;
  disabled: boolean;
};

function LazyPaginatedSelect({
  value,
  onChange,
  selectLabel = "label",
  selectValue = "value",
  filter,
  fetcher,
  oneFetcher,
  dataKey = "data",
  totalKey = "total",
  inputId,
  disabled,
}: LazyPaginatedSelectProps) {
  // Options
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<KeyString[]>([]);
  const [isLast, setIsLast] = useState(false);

  const optionsWithSkels = useMemo<KeyString[]>(() => {
    const skels = isLast
      ? []
      : Array.from({ length: 5 }, (v, k) => ({
          [selectLabel]: "Chargement...",
          [selectValue]: `${inputId}-option-${k}`,
        }));

    return options.concat(skels);
  }, [options, isLast]);

  const getOptions = async (page: number, search: string = "") => {
    try {
      setLoading(true);
      const response = await fetcher({ page, limit: 10, search });
      const data = response[dataKey] || [];

      if (page === 0) setOptions(data);
      else setOptions((val) => [...val, ...data]);
      setTotalPage(
        Math.ceil(
          (response?.[totalKey] || 0) / (response?.[dataKey].length || 0)
        )
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    getOptions(0);
  }, []);

  // infinite scroll
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [shown, setShown] = useState(false);
  const [search, setSearch] = useState("");

  const target = useRef(null);
  const conditionnalRef = (el: any, option: KeyString) => {
    const index = optionsWithSkels.findIndex(
      (el) => el[selectValue] === option[selectValue]
    );

    if (index !== options.length) return;

    target.current = el;
  };

  const intersect = useIntersection(target, {});

  const onLazyLoad = async () => {
    if (page + 1 >= totalPage) {
      setIsLast(true);
      return;
    }
    setIsLast(false);
    setPage((p) => p + 1);
    await getOptions(page + 1, search);
  };

  const _setShown = (value: boolean) => () => {
    setShown(value);
  };

  useEffect(() => {
    if (!intersect?.isIntersecting || !shown) return;
    onLazyLoad();
  }, [intersect?.isIntersecting, shown]);

  // Search
  const onFilter = (e: DropdownFilterEvent) => {
    setSearch(e.filter);
  };

  useDebounce(
    () => {
      getOptions(0, search);
    },
    500,
    [search]
  );

  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={optionsWithSkels}
      optionValue={selectValue}
      optionLabel={selectLabel}
      loading={loading}
      inputId={inputId}
      onShow={_setShown(true)}
      onHide={_setShown(false)}
      filter={filter}
      onFilter={onFilter}
      itemTemplate={(option) => (
        <>
          {option[selectLabel] === "Chargement..." ? (
            <div ref={(el) => conditionnalRef(el, option)}>
              <Skeleton width="100%" className="text-transparent">
                {option[selectLabel]}
              </Skeleton>
            </div>
          ) : (
            option[selectLabel]
          )}
        </>
      )}
      disabled={disabled}
    ></Dropdown>
  );
}

export default LazyPaginatedSelect;


