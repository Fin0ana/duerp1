import { TreeNode } from "primereact/treenode";
import { NewTreePost } from "./PostWithStreaming";
import { TreeTableSelectionKeysType } from "primereact/treetable";
import { SelectAllValue, SelectionKeys } from "@/app/types/custom-tree";

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
    return Object.entries(grouped).map(([keyValue, items], id) => {
      const fullKey = parentKey ? `${parentKey}-${keyValue}` : keyValue;
      const fullId = parentId ? `${parentId}-${id}` : String(id);
      const isLeaf = remainingKeys.length === 0;
      const haveChildren = items[0][remainingKeys[0]];
      const localBeginning = begin ? [begin(fullKey)] : [];

      // Add the new element button
      const children: TreeNode[] =
        end && haveChildren && !isLeaf
          ? localBeginning
              .concat(groupRecursively(items, remainingKeys, fullKey, fullId))
              .concat(end(fullKey))
          : !isLeaf && end
          ? [end(fullKey)]
          : !isLeaf
          ? groupRecursively(items, remainingKeys, fullKey, fullId)
          : [];

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
    });
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
  input: NewTreePost[]
): Required<NewTreePost>[] => {
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


