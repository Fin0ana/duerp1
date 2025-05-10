import { Button } from "primereact/button";
import {
  Column,
  ColumnBodyOptions,
  ColumnPassThroughOptions,
} from "primereact/column";
import { TreeNode } from "primereact/treenode";
import {
  TreeTable,
  TreeTableEvent,
  TreeTableExpandedKeysType,
  TreeTableProps,
  TreeTableSelectionEvent,
  TreeTableSelectionKeysType,
  TreeTableTogglerTemplateOptions,
} from "primereact/treetable";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import ModalAddNewNode from "./ModalAddNewNode";
import {
  NodeTypes,
  nodeTypes,
  nodeTypesFr,
  type BodyTemplateProps,
  type SelectAllValue,
  type SelectionKeys,
} from "@/app/types/custom-tree";
import { showErrorToast, showToast } from "@/app/utils/toast";
import { NewTreePost } from "./PostWithStreaming";
import { KeyString } from "@/app/modules/utils/types";
import { replaceElementInRecursiveArray } from "@/app/utils/objectManip";
import {
  MultiStateCheckbox,
  MultiStateCheckboxChangeEvent,
} from "primereact/multistatecheckbox";
import {
  areAllNodesFullySelected,
  ComputePercentageUtils,
  getParentNodeKey,
  selectAllNodes,
} from "./objectUtils";
import SearchTemplate from "./SearchTemplate";
import AddTemplate from "./AddNewTemplate";
import { Menu } from "primereact/menu";
import { classNames } from "primereact/utils";
import { useTreeOperations } from "@/app/hooks/useHorizontalTree";
import { PercentageTemplate } from "./HorizontalView/PercentageTemplate";
import { useWorkPercentStore } from "@/app/store/work/workPercent";
import { useComputePercent } from "@/app/hooks/useComputePercentage";
import { useDebounce } from "react-use";

type CustomTreeComponentProps = TreeTableProps & {
  onAdd?: (news: NewTreePost[]) => void;
  onSearch?: (query: KeyString) => void;
  onSave?: () => Promise<void>;
  search?: KeyString;
};

export type TreeNodeWithData = Omit<TreeNode, "data" | "children"> & {
  children?: TreeNodeWithData[];
  data: BodyTemplateProps;
};

function CustomTreeComponent({
  onAdd,
  onSearch,
  onSave,
  search,
  ...props
}: CustomTreeComponentProps) {
  const {
    value,
    handleClickAddNew,
    handleHideAddNew,
    open,
    childType,
    handleAddNew,
  } = useTreeOperations({ value: props.value as TreeNodeWithData[], onAdd });

  const [valueWithPercent, setValueWithPercent] =
    useState<TreeNodeWithData[]>();

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
    setValueWithPercent(value);
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

  const BodyTemplate = (e: TreeNodeWithData, options: ColumnBodyOptions) => {
    const type = nodeTypesFr[e.data.type];
    const name = type.name;
    const isExpanded = !!e.key && !!expandedKeys?.[e.key];
    const hasChildren = !!e.children?.length;

    const iconMap = {
      post: "pi-user text-primary-400",
      work: "pi-clipboard text-yellow-600",
      risk: "pi-exclamation-triangle text-red-500",
      measure: "pi-shield text-green-500",
    };

    const menu = useRef<Menu>(null);

    const items = [
      {
        template: (
          <>
            {hasChildren || (e.key && search?.[e.key]) ? (
              <span>
                <SearchTemplate query={search} setQuery={onSearch} e={e} />
              </span>
            ) : (
              <></>
            )}
            <span>
              <AddTemplate
                type={e.data.type}
                handleClickAddNew={handleClickAddNew(e)}
              />
            </span>
          </>
        ),
      },
    ];
    const closetTrRef = (el: HTMLSpanElement): void => {
      rowRefs.current[e.key!] = el?.closest("tr") || null;
    };
    return (
      <>
        {e.data.input ? (
          <AddTemplate handleClickAddNew={handleClickAddNew()} />
        ) : e.data.search ? (
          <SearchTemplate query={search} setQuery={onSearch} e={e} />
        ) : (
          <span
            ref={closetTrRef}
            className="inline-flex items-center justify-between flex-grow"
          >
            <div className="">
              <i className={`pi ${iconMap[e.data.type]} pr-2`} />
              <span className="capitalize">{name}</span> : {e.data.name}
            </div>
            <div className="flex flex-wrap gap-2 justify-end items-center">
              {e.data.type === "work" ? (
                <PercentageTemplate
                  node={e}
                  onPercentChange={onPercentChange}
                />
              ) : (
                <></>
              )}
              {isExpanded ? (
                <>
                  <div className="hidden lg:inline-flex flex-wrap flex-grow-0 justify-end items-center gap-2">
                    {items[0].template}
                  </div>
                  <div className="inline-block lg:hidden">
                    <Button
                      icon="pi pi-ellipsis-v"
                      onClick={(event) => menu.current?.toggle(event)}
                      aria-controls="popup_menu_left"
                      aria-haspopup
                      size="small"
                    ></Button>
                    <Menu
                      className="w-full max-w-[18rem]"
                      pt={{ menuitem: { className: "flex flex-col gap-2" } }}
                      popup={true}
                      ref={menu}
                      model={items}
                    ></Menu>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </span>
        )}
      </>
    );
  };

  const TogglerTemplate = (
    node: TreeNode,
    options: TreeTableTogglerTemplateOptions
  ) => {
    if (!node) {
      return;
    }
    const level = nodeTypes.findIndex((n) => n === node.data.type);
    const expanded = options.expanded;
    const leaf = node.leaf;

    const togglerStyle: CSSProperties = {
      marginLeft: `${level * 1.2}rem`,
      marginRight: "0.5rem",
      visibility: leaf ? "hidden" : "visible",
      border: "1px solid",
      width: "1.2rem",
      height: "1.2rem",
      marginBlock: "0.63rem",
    };
    const iconClassName = classNames(`text-xs p-tree-toggler-icon pi pi-fw`, {
      "pi-plus": !expanded,
      "pi-minus": expanded,
    });

    return (
      <button
        type="button"
        className="p-treetable-toggler text-inherit hover:bg-gray-200/50 flex items-center justify-center rounded-sm"
        tabIndex={-1}
        onClick={options.onClick}
        style={togglerStyle}
      >
        <span className={iconClassName} aria-hidden="true"></span>
      </button>
    );
  };

  // Percentage
  const handleExpand = (event: TreeTableEvent) => {
    const node = event.node as TreeNodeWithData;
    if (node.data.type !== "post") return;
    getPercentsOnChosenIdChange(node);
  };

  const selectionKeys = useMemo(
    () => props.selectionKeys as TreeTableSelectionKeysType,
    [props.selectionKeys]
  );

  const { workPercents, setWorkPercentForPost, getWorkPercentForPost } =
    useWorkPercentStore();

  // Expand
  const getPercentsOnChosenIdChange = async (chosenPost: TreeNodeWithData) => {
    const workPercentsForPost = await getWorkPercentForPost(
      String(chosenPost.key)
    );
    const _value = replaceElementInRecursiveArray(
      value as TreeNode[],
      "key",
      chosenPost.key,
      (chosenPost) => {
        const _chosenPost = { ...chosenPost } as TreeNodeWithData;
        setCheckedAndPercentage({
          mutableChosenPost: _chosenPost,
          workPercentsForPost,
          selectionKeys,
        });
        _chosenPost.children?.sort((a, b) => currPercent(b) - currPercent(a));
        return _chosenPost;
      }
    ) as TreeNodeWithData[];
    setChosenPost(undefined);
    setValueWithPercent(_value);
  };

  // Change check state
  const currPercent = (work: TreeNodeWithData) =>
    work.data.checked ? work.data.percent ?? -1 : -1;
  const getPercentsOnCheck = (e: TreeTableSelectionEvent) => {
    props.onSelectionChange?.(e);
    const newSelection = e.value as TreeTableSelectionKeysType;
    const prevSelection = props.selectionKeys as TreeTableSelectionKeysType;

    // Find newly checked keys
    const checkedKeys = Object.keys(newSelection).filter(
      (key) => !prevSelection[key] && String(key).split("-").length === 2
    );

    // Find newly unchecked keys
    const uncheckedKeys = Object.keys(prevSelection).filter(
      (key) => !newSelection[key] && String(key).split("-").length === 2
    );

    const parentKey = getParentNodeKey(checkedKeys[0] || uncheckedKeys[0]);

    const _value = replaceElementInRecursiveArray(
      value as TreeNode[],
      "key",
      parentKey,
      (chosenPost) => {
        const _chosenPost = { ...chosenPost } as TreeNodeWithData;
        setCheckedAndPercentage({
          mutableChosenPost: _chosenPost,
          workPercentsForPost: workPercents[String(_chosenPost.key)],
          selectionKeys: newSelection,
          changeType: "checking",
        });
        _chosenPost.children?.sort((a, b) => currPercent(b) - currPercent(a));
        setChosenPost(_chosenPost);
        return _chosenPost;
      }
    ) as TreeNodeWithData[];

    setValueWithPercent(_value);
  };
  const { setCheckedAndPercentage } = useComputePercent();
  const [chosenPost, setChosenPost] = useState<TreeNodeWithData>();

  // Percent input
  const onPercentChange = (percent: number, node: TreeNodeWithData) => {
    if (!value) return;
    const parentKey = getParentNodeKey(String(node.key));
    const _value = replaceElementInRecursiveArray(
      value,
      "key",
      parentKey,
      (el) => {
        const _chosenPost = { ...el } as TreeNodeWithData;
        const currentWork = _chosenPost.children?.find(
          (work) => work.key === node.key
        );
        if (!currentWork) return el;
        currentWork.data.percent = percent;
        currentWork.data.status = "manual";
        setCheckedAndPercentage({
          mutableChosenPost: _chosenPost,
          selectionKeys,
          workPercentsForPost: workPercents[el.key!],
          changeType: "input",
        });

        _chosenPost.children?.sort((a, b) => currPercent(b) - currPercent(a));
        setChosenPost(_chosenPost);
        return _chosenPost;
      }
    ) as TreeNodeWithData[];
    setValueWithPercent(_value);
  };
  const percentToSend = useMemo<WorkPercentPost[]>(() => {
    if (!chosenPost?.children || !chosenPost.key) return [];
    const _percentToSend: WorkPercentGet[] =
      ComputePercentageUtils.convertTreeNodeToWorkPercent(
        chosenPost?.children,
        workPercents[chosenPost.key]
      );
    return _percentToSend;
  }, [chosenPost]);
  useDebounce(
    async () => {
      try {
        if (!chosenPost?.key) return;
        const areTheSame = ComputePercentageUtils.areTwoWorkPercentsTheSame(
          percentToSend,
          workPercents[chosenPost.key]
        );
        if (areTheSame) return;
        const response = await setWorkPercentForPost(
          String(chosenPost.key),
          percentToSend
        );
        await onSave?.();
      } catch (error) {
        showErrorToast(error);
      }
    },
    2000,
    [percentToSend]
  );

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
      // In tailwind.config.ts
      [`bg-tree-row-1 ${opacity} border-black text-black`]: id % 4 === 0,
      [`bg-tree-row-2 ${opacity} border-${text} text-${text}`]: id % 4 === 1,
      [`bg-tree-row-3 ${opacity} border-${text} text-${text}`]: id % 4 === 2,
      [`bg-tree-row-4 ${opacity} border-${text} text-${text}`]: id % 4 === 3,
    };
  };
  const rowToggler: ColumnPassThroughOptions["rowToggler"] = {
    className: "text-inherit hover:bg-transparent",
  };

  const [expandedKeys, setEexpandedKeys] = useState<
    TreeTableExpandedKeysType | undefined
  >();

  // SVG
  const svgRef = useRef<SVGSVGElement>(null);
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Calcul du décalage de base en fonction de la largeur de l'écran
  const baseIndent = window.innerWidth < 1920 ? 1.2 * 13 : 1.2 * 16; // en pixels

  // Fonction qui dessine les lignes sur le SVG
  // depth correspond au niveau de hiérarchie (0 pour la racine, 1 pour ses enfants, etc.)
  const updateLines = () => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = svgRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    svg.innerHTML = ""; // Nettoyer le SVG

    const drawLinesForNode = (node: TreeNode, depth: number) => {
      // On dessine uniquement si le nœud est déplié et possède des enfants
      if (!node.children || !expandedKeys?.[node.key!]) return;

      // Récupération de la position du parent
      const parentRow = rowRefs.current[node.key!];
      if (!parentRow) return;
      const parentRect = parentRow.getBoundingClientRect();
      // Position effective du parent : on ajoute le décalage correspondant à son niveau

      const parentX = parentRect.left - containerRect.left + baseIndent * depth;
      const parentY =
        parentRect.top - containerRect.top + parentRect.height / 2;

      node.children.forEach((child) => {
        const childRow = rowRefs.current[child.key!];
        if (!childRow) return;
        const childRect = childRow.getBoundingClientRect();
        // Le niveau de l'enfant est depth+1
        const childX =
          childRect.left - containerRect.left + baseIndent * (depth + 1);
        const childY = childRect.top - containerRect.top + childRect.height / 2;

        // Calcul d'un point intermédiaire pour créer des segments horizontaux et verticaux
        const midX = (parentX + childX) / 2;
        // Construction du chemin en 3 segments :
        //  • Du parent jusqu'à midX horizontalement
        //  • De midX passant verticalement du parent à l'enfant
        //  • De midX à l'enfant horizontalement
        const d = `M ${parentX} ${parentY} L ${midX} ${parentY} L ${midX} ${childY} L ${childX} ${childY}`;
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("d", d);
        path.setAttribute("stroke", "#FFFFFF");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", "2");
        svg.appendChild(path);

        // Recurse sur les descendants si on n'a pas atteint le niveau maximum (3 niveaux de descendant)
        if (depth < 2) {
          drawLinesForNode(child, depth + 1);
        }
      });
    };

    // Lancer le dessin pour chaque nœud racine (niveau 0)
    value?.forEach((node) => {
      drawLinesForNode(node, 0);
    });
  };

  useEffect(() => {
    updateLines();
  }, [value, expandedKeys]);

  return (
    <div ref={containerRef} className="relative">
      {/* SVG pour dessiner les lignes */}
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 800,
        }}
      />
      <TreeTable
        {...props}
        rowClassName={rowClass}
        emptyMessage="Pas de données"
        value={valueWithPercent}
        expandedKeys={expandedKeys}
        onToggle={(e) => setEexpandedKeys(e.value)}
        togglerTemplate={TogglerTemplate}
        onExpand={handleExpand}
        onSelectionChange={getPercentsOnCheck}
      >
        <Column
          body={BodyTemplate}
          header={HeaderTemplate}
          pt={{ rowToggler }}
          expander
          className="inline-flex items-center w-full"
        ></Column>
      </TreeTable>
      <ModalAddNewNode
        onHide={handleHideAddNew}
        visible={open}
        type={childType}
        onAdd={handleAddNew}
      />
    </div>
  );
}

export default CustomTreeComponent;
