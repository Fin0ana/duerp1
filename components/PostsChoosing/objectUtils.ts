import { TreeNode } from "primereact/treenode";
import { NewTreePost } from "./PostWithStreaming";
import { TreeTableSelectionKeysType } from "primereact/treetable";
import {
  nodeOrder,
  NodeTypes,
  SelectAllValue,
  SelectionKeys,
} from "@/app/types/custom-tree";
import { KeyString } from "@/app/modules/utils/types";
import {
  compareArrays,
  deepEqualFromAssert,
  diffArrays,
  isArray,
  replaceElementInRecursiveArray,
} from "@/app/utils/objectManip";
import { strongStringCompare } from "@/app/utils/stringManip";
import { TreeNodeWithData } from "./CustomTreeComponent";
import { formatDateTime } from "@/app/utils/stringManip";

export function removeParents(
  existingPosts: NewTreePost[],
  newPosts: NewTreePost[]
): NewTreePost[] {
  // Détermine si `potentialParent` est parent de `child`
  function isParent(potentialParent: NewTreePost, child: NewTreePost): boolean {
    if (
      potentialParent._id === child._id &&
      (!child.workId || potentialParent.workId === "") &&
      (!child.riskId || potentialParent.riskId === "") &&
      (!child.measureId || potentialParent.measureId === "")
    ) {
      return true;
    }

    if (
      potentialParent.workId &&
      child.workId?.startsWith(potentialParent.workId) &&
      (!child.riskId || potentialParent.riskId === "") &&
      (!child.measureId || potentialParent.measureId === "")
    ) {
      return true;
    }

    if (
      potentialParent.riskId &&
      child.riskId?.startsWith(potentialParent.riskId) &&
      (!child.measureId || potentialParent.measureId === "")
    ) {
      return true;
    }

    if (
      potentialParent.measureId &&
      child.measureId?.startsWith(potentialParent.measureId)
    ) {
      return true;
    }

    return false;
  }

  // Filtre les parents de newPosts dans existingPosts
  return existingPosts.filter(
    (existingPost) =>
      !newPosts.some((newPost) => isParent(existingPost, newPost))
  );
}
/**
 * Groupe per _id, workId & riskId
 * @param array The array from backend
 * @param keyLists The keys from the array element for grouping
 * @param insert A TreeNode object to insert at the beginning/end of each grouped
 * @returns
 */
export function groupByKeys(
  array: NewTreePost[],
  keyLists: (keyof NewTreePost)[],
  insert?: {
    begin?: (key?: string) => TreeNode;
    end?: (key?: string) => TreeNode;
  }
): TreeNode[] {
  const mapped: Partial<
    Record<keyof NewTreePost, { name: keyof NewTreePost; type: string }>
  > = {
    _id: { name: "name", type: "post" },
    workId: { name: "workName", type: "work" },
    riskId: { name: "riskName", type: "risk" },
    measureId: { name: "measureName", type: "measure" },
    name: { name: "name", type: "post" },
    workName: { name: "workName", type: "work" },
    riskName: { name: "riskName", type: "risk" },
    measureName: { name: "measureName", type: "measure" },
  };
  const begin = insert?.begin;
  const end = insert?.end;

  function groupRecursively(
    data: NewTreePost[],
    keys: (keyof NewTreePost)[],
    parentKey = "",
    parentId = ""
  ): TreeNode[] {
    const [currentKey, ...remainingKeys] = keys;

    // Regroupement par la clé actuelle
    const grouped = data.reduce<Record<string, NewTreePost[]>>((acc, item) => {
      const keyValue = item[currentKey] as unknown as string; // Assure que la clé est une chaîne
      if (!acc[keyValue]) {
        acc[keyValue] = [];
      }
      acc[keyValue].push(item);
      return acc;
    }, {});

    // Construction de la structure de sortie
    const getName = (items: NewTreePost[]): string | undefined | number => {
      const currentNode = mapped[currentKey];
      return currentNode ? items[0]?.[currentNode.name] : "";
    };
    const getObject = (items: NewTreePost[]) => {
      return items[0];
    };
    return Object.entries(grouped)
      .map(([keyValue, items], id) => {
        const fullKey = parentKey ? `${parentKey}-${keyValue}` : keyValue;
        const fullId = parentId ? `${parentId}-${id}` : String(id);
        const isLeaf = remainingKeys.length === 0;
        const haveChildren = items.some((item) => item[remainingKeys[0]]);
        const localBeginning = begin ? [begin(fullKey)] : [];
        const localEnding = end ? [end(fullKey)] : [];

        const children: TreeNode[] =
          isLeaf || !haveChildren
            ? localBeginning.concat([]).concat(localEnding)
            : localBeginning
                .concat(groupRecursively(items, remainingKeys, fullKey, fullId))
                .concat(localEnding);

        return {
          key: fullKey,
          id: fullId,
          data: {
            name: getName(items),
            id: keyValue,
            type: mapped[currentKey]?.type,
            severity: getObject(items).severity,
            likelihood: getObject(items).likelihood,
          },
          leaf: isLeaf,
          children,
        };
      })
      .filter((el) => el.data.id);
  }

  const firstBeginning = begin ? [begin()] : [];
  const body = end
    ? groupRecursively(array, keyLists).concat(end())
    : groupRecursively(array, keyLists);
  return firstBeginning.concat(body);
}

export const getAllKeys = (nodes: TreeNode[]): TreeTableSelectionKeysType => {
  const keys: TreeTableSelectionKeysType = {};
  const collectKeys = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      keys[node.key!] = { checked: true, partialChecked: false };
      if (node.children) {
        collectKeys(node.children); // Récursion pour les enfants
      }
    }
  };
  collectKeys(nodes);
  return keys;
};

export function selectAllNodes(nodes: TreeNode[]): SelectionKeys {
  const selectionKeys: {
    [key: string]: { checked: boolean; partialChecked: boolean };
  } = {};

  const updateSelectionRecursively = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (!node.key) continue;
      if (String(node.key).includes("new")) {
        continue; // Ignorer les nœuds contenant "new" dans leur clé
      }

      // Ajouter le nœud comme sélectionné
      selectionKeys[node.key] = { checked: true, partialChecked: false };

      // Parcourir récursivement les enfants
      if (node.children) {
        updateSelectionRecursively(node.children);
      }
    }
  };

  updateSelectionRecursively(nodes);

  return selectionKeys;
}

/**
 * Vérifie si tous les nœuds sont entièrement sélectionnés dans le TreeTable.
 * Ignore les nœuds dont la clé contient "new".
 * @param nodes - Liste des TreeNodes à vérifier.
 * @param selectionKeys - Objet représentant les clés sélectionnées ({ checked, partialChecked }).
 * @returns true si tous les nœuds (hors "new") sont sélectionnés, sinon false.
 */
export function areAllNodesFullySelected(
  nodes: TreeNode[],
  selectionKeys: SelectionKeys
): SelectAllValue {
  if (!selectionKeys) return undefined;
  const checkNodesRecursively = (nodes: TreeNode[]): SelectAllValue => {
    for (const node of nodes) {
      if (node.key && (node.key as string).includes("new")) {
        continue; // Ignorer les nœuds contenant "new"
      }

      const selectionState = selectionKeys[node.key as string];

      // Si le nœud n'est pas sélectionné ou est partiellement sélectionné
      if (!selectionState || !selectionState.checked) {
        return undefined;
      }

      // Vérifier les enfants récursivement
      if (node.children && !checkNodesRecursively(node.children)) {
        return undefined;
      }
    }
    return "all"; // Tous les nœuds (et leurs enfants) sont entièrement sélectionnés
  };

  return checkNodesRecursively(nodes);
}

/**
 *  Remplit tous les undefined en empty string
 * @param input
 * @returns
 */
export const fillEmptyValue = (
  input: NewTreePost[] | undefined
): Required<NewTreePost>[] => {
  if (!isArray(input)) return [];
  return input.map((i) => ({
    ...i,
    measureId: i.measureId || "",
    measureName: i.measureName || "",
    riskId: i.riskId || "",
    riskName: i.riskName || "",
    workId: i.workId || "",
    workName: i.workName || "",
    likelihood: i.likelihood || 2,
    severity: i.severity || 2,
  }));
};

export function getParentNodeKey(
  childKey: string | undefined
): string | undefined {
  if (!childKey) return;
  const parentKey = childKey.split("-").slice(0, -1).join("-");
  if (!parentKey) {
    return;
  }
  return parentKey;
}

export function getIds(key: string | number | undefined): string[] {
  return String(key).split("-");
}

export function getChildType(type?: NodeTypes): NodeTypes | undefined {
  if (!type) return "post";
  const order = nodeOrder.findIndex((n) => n === type);
  const childType =
    order < 0 || order > nodeOrder.length ? undefined : nodeOrder[order + 1];
  return childType;
}

export const filterWithinChildren = (
  value: NewTreePost[],
  queries: KeyString
): NewTreePost[] => {
  let newValue = value;
  if (!newValue) return value;
  for (const key in queries) {
    if (!Object.prototype.hasOwnProperty.call(queries, key)) continue;
    const query = queries[key];
    if (key === "new") {
      newValue = value.filter((val) => {
        return strongStringCompare(val.name, query, { op: "startsWith" });
      });
      continue;
    }

    const keys = key.split("-");
    const [id, workId, riskId, measureId] = keys;
    newValue = value.filter((val) => {
      switch (keys.length) {
        case 3: {
          return true;
        }
        case 2: {
          return true;
        }
        case 1: {
          return id !== val._id || strongStringCompare(val.workName, query);
        }
        default:
          return true;
      }
    });
  }
  return newValue;
};

export function _filter(value: TreeNode[], queries: KeyString) {
  let newValue: TreeNode[] = [];
  for (const key in queries) {
    const query = queries[key];
    if (key === "new-search") {
      return value.filter((v) =>
        strongStringCompare(v.data.name, query, { op: "startsWith" })
      );
    }
    newValue = replaceElementInRecursiveArray(value, "key", key, (el) => {
      if (!query) return el;

      return {
        ...el,
        children: el.children?.filter((child) => {
          return strongStringCompare(child.data.name, query, {
            op: "startsWith",
          });
        }),
      };
    });
  }

  return newValue;
}

export const getElderDescendant = (node: TreeNodeWithData, level: number) => {
  let elder = node.children?.[0];
  if (level < 0 || level > 2) return elder;
  for (let index = 0; index < level; index++) {
    elder = elder?.children?.[0];
  }

  return elder;
};

export const toDuerpName = (date?: Date | string) => {
  return `${
    date
      ? `[${formatDateTime(new Date(date), {
          dateOnly: true,
        })}] `
      : ""
  }Document Unique d'Evaluation de Risques Professionnels`;
};

export class ComputePercentageUtils {
  constructor() {}

  /** Get the total % of the manual edited percentage */
  static getManualTotal(mutableChosenPost?: TreeNodeWithData) {
    const totalInChosenPost =
      mutableChosenPost?.children?.reduce<number>(
        (acc, curr) =>
          acc +
          (curr.data.checked &&
          curr.data.status === "manual" &&
          curr.data.percent
            ? curr.data.percent
            : 0),
        0
      ) || 0;
    return /* totalInWorkPercent || */ totalInChosenPost;
  }

  static getAutoPercentCount(node: TreeNodeWithData) {
    const children = node.children;
    if (!children) return 0;
    return children.reduce(
      (acc, curr) =>
        acc + (curr.data.checked && curr.data.status !== "manual" ? 1 : 0),
      0
    );
  }
  static getManualTotalFromBack(workPercents?: WorkPercentGet[]) {
    const totalInChosenPost =
      workPercents?.reduce<number>(
        (acc, curr) =>
          acc + (curr.status === "manual" && curr.percent ? curr.percent : 0),
        0
      ) || 0;
    return totalInChosenPost;
  }

  static getAutoPercentCountFromBack(workPercents: WorkPercentGet[]) {
    return workPercents.reduce(
      (acc, curr) => acc + (curr.status !== "manual" ? 1 : 0),
      0
    );
  }

  /**
   * Convert raw tree node data form to the valid API request
   * @param treeNodes
   * @param workPercent
   * @returns
   */
  static convertTreeNodeToWorkPercent(
    treeNodes: TreeNodeWithData[],
    workPercent?: WorkPercentGet[]
  ): WorkPercentGet[] {
    return treeNodes
      .filter((treeNodes) => treeNodes.data.checked)
      .map((treeNode) => {
        const currentWorkPercent = workPercent?.find((wp) => {
          const [postId, workId] = getIds(treeNode.key);
          return postId === wp.postId && workId === wp.workId;
        });
        const [postId, workId] = getIds(treeNode.key);
        return {
          _id: currentWorkPercent?._id,
          percent: treeNode.data.percent || 0,
          status: treeNode.data.status || "auto",
          postId,
          workId,
        };
      });
  }

  static areTwoWorkPercentsTheSame(
    workPercent1: WorkPercentGet[],
    workPercent2: WorkPercentGet[]
  ): boolean {
    if (!workPercent1 || !workPercent2) return workPercent1 === workPercent2;
    if (workPercent1.length === 0 && workPercent2.length === 0) return true;

    const _workPercent1 = workPercent1.map((wp) => ({
      workId: wp.workId,
      postId: wp.postId,
      percent: wp.percent,
      status: wp.status,
    }));
    const _workPercent2 = workPercent2.map((wp) => ({
      workId: wp.workId,
      postId: wp.postId,
      percent: wp.percent,
      status: wp.status,
    }));

    const areTheSame = compareArrays(_workPercent1, _workPercent2);

    return areTheSame;
  }
}

export class DuerpHistory {
  constructor() {}

  static extractMinimalTree(nodes: TreeNode[]): MinimalTreeNode[] {
    return (nodes as TreeNodeWithData[]).map((node) => {
      const extracted: any = { name: node.data.name };

      if (node.children && node.children.length > 0) {
        extracted.children = this.extractMinimalTree(node.children);
      }

      if (node.data.severity != undefined && node.data.type === "risk") {
        extracted.severity = node.data.severity;
      }

      if (node.data.likelihood != undefined && node.data.type === "risk") {
        extracted.likelihood = node.data.likelihood;
      }

      return extracted;
    });
  }
}
