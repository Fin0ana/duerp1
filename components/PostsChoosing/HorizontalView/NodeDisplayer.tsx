import {
  HTMLAttributes,
  MemoExoticComponent,
  ReactElement,
  useMemo,
} from "react";
import { TreeNodeWithData } from "../CustomTreeComponent";
import {
  MultiStateCheckbox,
  MultiStateCheckboxChangeEvent,
} from "primereact/multistatecheckbox";
import { SelectAllValue } from "@/app/types/custom-tree";
import { TreeTableCheckboxSelectionKeyType } from "primereact/treetable";

type NodeDisplayerProps = HTMLAttributes<HTMLLabelElement> & {
  active?: boolean;
  node: TreeNodeWithData;
  checkedState?: boolean | TreeTableCheckboxSelectionKeyType | undefined;
  onCheck?: (e: MultiStateCheckboxChangeEvent, node: TreeNodeWithData) => void;
  TemplateCenter?:
    | MemoExoticComponent<
        (options: {
          node: TreeNodeWithData;
          onPercentChange?: (e: number, node: TreeNodeWithData) => void;
        }) => ReactElement
      >
    | ((props: { node: TreeNodeWithData }) => ReactElement);
  onPercentChange?: (e: number, node: TreeNodeWithData) => void;
};
const NodeDisplayer = ({
  active,
  node,
  checkedState,
  onCheck,
  TemplateCenter,
  onPercentChange,
  ...props
}: NodeDisplayerProps) => {
  type MultiStateCheckBoxOption = { value: SelectAllValue; icon?: string };
  const activeClass = active
    ? "text-primary-500 bg-primary-50 border-primary-500 "
    : "";

  const options: MultiStateCheckBoxOption[] = [
    { value: "all", icon: "pi pi-check" },
    { value: "partial", icon: "pi pi-minus" },
  ];

  const formattedCheckedState = useMemo<SelectAllValue>(() => {
    if (typeof checkedState === "boolean")
      return checkedState ? "all" : undefined;
    if (checkedState?.checked) return "all";
    if (checkedState?.partialChecked) return "partial";
    return undefined;
  }, [checkedState]);

  const handleCheck = (e: MultiStateCheckboxChangeEvent) => {
    onCheck?.(e, node);
  };

  return node.data.search ? (
    <></>
  ) : node.data.input ? (
    <></>
  ) : (
    <span
      {...props}
      className={
        "px-2 py-3 border rounded-md flex items-center justify-between gap-2 " +
        activeClass +
        props.className
      }
    >
      <span className="inline-flex gap-2 items-center">
        <MultiStateCheckbox
          value={formattedCheckedState}
          onChange={handleCheck}
          options={options}
          optionValue="value"
          id={String(node.key)}
        />
        <span>{node.data.name}</span>
      </span>
      <span className="flex gap-2 items-center">
        {TemplateCenter ? (
          <span>
            <TemplateCenter node={node} onPercentChange={onPercentChange} />
          </span>
        ) : (
          <></>
        )}
        {node.data.type !== "measure" ? (
          <span>
            <i className="pi pi-chevron-right"></i>
          </span>
        ) : (
          <></>
        )}
      </span>
    </span>
  );
};

export default NodeDisplayer;
