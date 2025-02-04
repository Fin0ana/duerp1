import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import {
  Column,
  ColumnBodyOptions,
  ColumnPassThroughOptions,
} from "primereact/column";
import { InputText } from "primereact/inputtext";
import { TreeNode } from "primereact/treenode";
import {
  TreeTable,
  TreeTablePassThroughOptions,
  TreeTableProps,
  TreeTableSelectionEvent,
} from "primereact/treetable";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import ModalAddNewNode from "./ModalAddNewNode";
// import {
  // BodyTemplateProps,
  // NodeTypes,
  // nodeTypesFr,
  // SelectAllValue,
  // SelectionKeys,
// } from "@/types/custom-tree";

import { showToast } from "@/app/utils/toast";
import { dynamicErrorAxios } from "@/app/modules/utils/global";
import axiosInstance from "@/app/utils/axios";
import { IdName } from "@/app/types/global.d";
import { NewTreePost } from "./PostWithStreaming";
import { KeyString } from "@/app/modules/utils/types.d";
import { replaceElementInRecursiveArray } from "@/app/utils/objectManip";
import { strongStringCompare } from "@/app/utils/stringManip";
import {
  MultiStateCheckbox,
  MultiStateCheckboxChangeEvent,
} from "primereact/multistatecheckbox";
import { areAllNodesFullySelected, selectAllNodes } from "./objectUtils";
import { 
  NodeTypes, 
   BodyTemplateProps,
  nodeTypesFr,
  SelectAllValue,
  SelectionKeys, } from "@/app/types/custom-tree";

type CustomTreeComponentProps = TreeTableProps & {
  onAdd?: (news: NewTreePost[]) => void;
};

export type TreeNodeWithData = Omit<TreeNode, "data"> & {
  data: BodyTemplateProps;
};
function CustomTreeComponent({ onAdd, ...props }: CustomTreeComponentProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [currentNode, setCurrentNode] = useState<TreeNodeWithData>();
  const handleClickAddNew = (e: TreeNodeWithData) => () => {
    setCurrentNode(e);
    setOpen(true);
  };

  // Searching // Filter
  const [query, setSearch] = useState<KeyString>({});
  const filterWithinChildren = (value: TreeNode[]) => {
    let newValue = value;
    if (!newValue) return value;
    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        const element = query[key];

        // Case when searching whose are not post (with parent key)
        if (getParentNodeKey(key)) {
          newValue = replaceElementInRecursiveArray(
            newValue,
            "key",
            getParentNodeKey(key),
            (el) => {
              if (!element) return el;

              return {
                ...el,
                children: el.children?.filter((child) => {
                  return (
                    strongStringCompare(child.data.name, element, {
                      op: "startsWith",
                    }) || child.key?.toString().includes("new")
                  );
                }),
              };
            }
          );
          continue;
        }

        // Case when searching for post
        newValue = element
          ? newValue.filter((el, id) => {
              return (
                strongStringCompare(el.data.name, element, {
                  op: "startsWith",
                }) || el.key?.toString().includes("new")
              );
            })
          : newValue;
      }
    }
    return newValue;
  };
  const [value, setValue] = useState<TreeNode[] | undefined>();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const search = () => {
    if (!props.value) return;
    const _value = filterWithinChildren(props.value);
    setValue(_value);
  };

  // On adding new nodes
  const handleAddNew = async (
    _news: Record<string, any>[],
    type: NodeTypes
  ) => {
    try {
      const parentIds: string[] = String(currentNode?.key || "").split("-");
      parentIds.pop();
      const added: IdName[] = _news.map((n) => ({ _id: n._id, name: n.name }));

      if (onAdd) {
        const response = await axiosInstance.post(
          "/api/companies/add-new-values",
          { type, parentIds, added }
        );
        onAdd?.(response.data);
      }

      handleHideAddNew();
    } catch (error) {
      showToast({
        summary: "Erreur",
        detail: dynamicErrorAxios(error),
        severity: "error",
      });
    }
  };

  const handleHideAddNew = () => {
    setOpen(false);
    setCurrentNode(undefined);
  };

  const handleSearch =
    (treeNode: TreeNodeWithData) => (e: ChangeEvent<HTMLInputElement>) => {
      setSearch((s) => ({ ...s, [treeNode.key!]: e.target.value }));
    };
  const handleResetSearch = (treeNode: TreeNodeWithData) => () => {
    setSearch((s) => ({ ...s, [treeNode.key!]: "" }));
  };

  // Select
  const [select, setSelect] = useState<SelectAllValue>();

  const selectedAll = useMemo<SelectAllValue>(() => {
    if (!value) return "all";
    if (!props.selectionKeys || !Object.keys(props.selectionKeys).length)
      return;
    const selectionKeys = props.selectionKeys as SelectionKeys;
    const areAllSelected = areAllNodesFullySelected(value, selectionKeys);
    if (value && !areAllSelected) return "partial";
    return areAllNodesFullySelected(value, selectionKeys);
  }, [props.selectionKeys, select, value]);

  const handleSelectAll = (e: MultiStateCheckboxChangeEvent) => {
    if (!value) return;
    const val: SelectAllValue = e.value;

    setSelect(val);
    if (!val || val === "partial") {
      props.onSelectionChange?.({ value: {} } as TreeTableSelectionEvent);
      return;
    }
    if (val === "all") {
      props.onSelectionChange?.({
        value: selectAllNodes(value),
      } as TreeTableSelectionEvent);
      return;
    }
  };

  useEffect(() => {
    if (props.selectionKeys) return;
    if (!value) return;
    props.onSelectionChange?.({
      value: selectAllNodes(value),
    } as TreeTableSelectionEvent);
  }, [value]);

  // Templates
  const HeaderTemplate = () => {
    type MultiStateCheckBoxOption = { value: SelectAllValue; icon?: string };
    const options: MultiStateCheckBoxOption[] = [
      { value: "all", icon: "pi pi-check" },
      { value: "partial", icon: "pi pi-minus" },
    ];
    return (
      <div className="flex items-center gap-4">
        <MultiStateCheckbox
          value={selectedAll}
          onChange={handleSelectAll}
          options={options}
          optionValue="value"
        />
        <span>Nom</span>
      </div>
    );
  };

  const BodyTemplate = (e: TreeNodeWithData, opyion: ColumnBodyOptions) => {
    const type = nodeTypesFr[e.data.type];
    const a = type.sex === "F" ? "une nouvelle" : "un nouveau";
    const name = type.name;

    const iconMap = {
      post: "pi-user text-green-500",
      work: "pi-clipboard text-yellow-600",
      risk: "pi-exclamation-triangle text-red-500",
      measure: "pi-shield text-green-500",
    };
    return (
      <>
        {e.data.input ? (
          <>
            <Checkbox disabled checked={false}></Checkbox>
            <Button
              size="small"
              icon="pi pi-plus"
              severity="success"
              label={`Ajouter ${a} ${name}`}
              onClick={handleClickAddNew(e)}
            ></Button>
          </>
        ) : e.data.search ? (
          <span className="space-x-1">
            <span className="relative">
              <InputText
                value={query[e.key!] || ""}
                onChange={handleSearch(e)}
                className="p-inputtext-sm"
                placeholder={`Rechercher dans ${name}`}
              />
              {query[e.key!] ? (
                <i
                  className="absolute pi pi-times right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={handleResetSearch(e)}
                />
              ) : (
                <></>
              )}
            </span>
            <Button
              icon="pi pi-search"
              size="small"
              type="button"
              onClick={search}
            ></Button>
          </span>
        ) : (
          <>
            <i className={`pi ${iconMap[e.data.type]} pr-2`} />
            <span className="capitalize">{name}</span> : {e.data.name}
          </>
        )}
      </>
    );
  };

  function getParentNodeKey(childKey: string | undefined): string | undefined {
    if (!childKey) return;
    const parentKey = childKey.split("-").slice(0, -1).join("-");
    if (!parentKey) {
      return;
    }
    return parentKey;
  }
  function getParentNodeId(childKey: string | undefined): string | undefined {
    if (!childKey) return;
    const parentKey = childKey.split("-").at(-2);
    if (!parentKey) {
      return;
    }
    return parentKey;
  }

  // Format the id name from response to a valid treenode node
  function formatIdNameToTreeNode(input: IdName[]): TreeNode[] {
    return input.map((i) => {
      const key = String(currentNode?.key).replace("new", i._id);
      return {
        id: key,
        key,
        data: { _id: i._id, name: i.name, type: currentNode?.data.type },
        leaf: currentNode?.data.type === "measure",
      };
    });
  }

  // styling
  const rowClass = (node: TreeNodeWithData) => {
    if (!node.id) return {};
    const ids = node.id?.split("-").map((id) => parseInt(id));
    const opacityMap: {
      [key in NodeTypes]: { opacity: string; text: string };
    } = {
      post: { opacity: "bg-opacity-100", text: "white" },
      work: { opacity: "bg-opacity-75", text: "white" },
      risk: { opacity: "bg-opacity-50", text: "white" },
      measure: { opacity: "bg-opacity-25", text: "black" },
    };
    const type = node.data.type;
    const { opacity, text } = opacityMap[type];
    const id = ids[0];
    if (isNaN(id))
      return {
        "bg-gray-50": true,
      };
    return {
      [`bg-tree-row-1 ${opacity} text-${text}`]: id % 4 === 0,
      [`bg-tree-row-2 ${opacity} text-${text}`]: id % 4 === 1,
      [`bg-tree-row-3 ${opacity} text-${text}`]: id % 4 === 2,
      [`bg-tree-row-4 ${opacity} text-${text}`]: id % 4 === 3,
    };
  };
  const rowToggler: ColumnPassThroughOptions["rowToggler"] = {
    className: "text-inherit hover:bg-transparent",
  };

  return (
    <>
      <TreeTable
        {...props}
        rowClassName={rowClass}
        emptyMessage="Pas de données"
        value={value}
      >
        <Column
          body={BodyTemplate}
          header={HeaderTemplate}
          pt={{ rowToggler }}
          expander
        ></Column>
      </TreeTable>
      <ModalAddNewNode
        onHide={handleHideAddNew}
        visible={open}
        currentNode={currentNode}
        onAdd={handleAddNew}
      />
    </>
  );
}

export default CustomTreeComponent;

