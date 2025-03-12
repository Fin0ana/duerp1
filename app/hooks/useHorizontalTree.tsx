import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { TreeNodeWithData } from "@/components/PostsChoosing/CustomTreeComponent";
import { NodeTypes, SelectAllValue } from "../types/custom-tree";
import { useDebounce } from "react-use";
import {
  getChildType,
  getElderDescendant,
  getIds,
  getParentNodeKey,
} from "@/components/PostsChoosing/objectUtils";
import { TreeTableSelectionKeysType } from "primereact/treetable";
import { ObjectUtils } from "primereact/utils";
import { showErrorToast } from "../utils/toast";
import axiosInstance from "../admin/payment/utils/axios";
import { NewTreePost } from "@/components//PostsChoosing/PostWithStreaming";

export const useHoverCard = (value?: TreeNodeWithData[]) => {
  const [chosenPost, setChosenPost] = useState<TreeNodeWithData>();
  const [chosenWork, setChosenWork] = useState<TreeNodeWithData>();
  const [chosenRisk, setChosenRisk] = useState<TreeNodeWithData>();
  const [hoveredNode, setHoveredNode] = useState<{
    node: TreeNodeWithData;
    type: NodeTypes;
  } | null>(null);
  const [chosenPostId, setChosenPostId] = useState<number | string>();
  const [chosenWorkId, setChosenWorkId] = useState<number | string>();
  const [chosenRiskId, setChosenRiskId] = useState<number | string>();
  const [hoveredNodeId, setHoveredNodeId] = useState<{
    id: number | string;
    type: NodeTypes;
  } | null>(null);

  const _updateChosens = () => {
    if (!hoveredNode) return;

    const { node, type } = hoveredNode;
    switch (type) {
      case "post":
        setChosenPost(node);
        setChosenWork(getElderDescendant(node, 0));
        setChosenRisk(getElderDescendant(node, 1));
        break;
      case "work":
        setChosenWork(node);
        setChosenRisk(getElderDescendant(node, 0));
        break;
      case "risk":
        setChosenRisk(node);
        break;
      default:
        break;
    }
  };

  const updateChosens = () => {
    if (!hoveredNodeId) return;

    const { id, type } = hoveredNodeId;
    switch (type) {
      case "post":
        setChosenPostId(id);
        setChosenWorkId(0);
        setChosenRiskId(0);
        break;
      case "work":
        setChosenWorkId(id);
        setChosenRiskId(0);
        break;
      case "risk":
        setChosenRiskId(id);
        break;
      default:
        break;
    }
  };

  // Débouncer la mise à jour de l'état
  useDebounce(
    updateChosens,
    300, // Délai de debounce (ajuste selon tes besoins)
    [hoveredNodeId, hoveredNode] // Se réexécute seulement si hoveredNode change
  );

  // Fonction de gestion du hover
  return {
    _handleHoverCard: useCallback(
      (node: TreeNodeWithData, type: NodeTypes) => () => {
        setHoveredNode({ node, type });
      },
      []
    ),
    handleHoverCard: useCallback(
      (id: number | string, type: NodeTypes) => () => {
        setHoveredNodeId({ id, type });
      },
      []
    ),
    chosenPost,
    chosenWork,
    chosenRisk,
    chosenPostId,
    chosenWorkId,
    chosenRiskId,
  };
};

export const usePropagate = (value?: TreeNodeWithData[]) => {
  /**
   * Propagate the check status in ancestors and descendants
   * @param node
   * @param check
   * @param _selectionKeys
   * @returns
   */
  function updateSelectionKeys(
    node: TreeNodeWithData,
    check: boolean,
    _selectionKeys: TreeTableSelectionKeysType | undefined
  ) {
    const key = String(node.key);
    const selectionKeys = { ..._selectionKeys };
    // Mettre à jour le nœud actuel
    if (check) {
      selectionKeys[key] = { checked: true, partialChecked: false };
    } else {
      delete selectionKeys[key];
    }

    // Mettre à jour les descendants récursivement
    function updateChildrenRecursively(
      nodes: TreeNodeWithData[],
      isChecked: boolean
    ) {
      for (const node of nodes) {
        if (isChecked) {
          selectionKeys[node.key!] = { checked: true, partialChecked: false };
        } else {
          delete selectionKeys[node.key!];
        }
        if (node.children) {
          updateChildrenRecursively(node.children, isChecked);
        }
      }
    }

    const parentKey = getParentNodeKey(key);
    const siblings: TreeNodeWithData[] = parentKey
      ? (ObjectUtils as any).findChildrenByKey(value, parentKey)
      : value;
    const currentNode = siblings.find((n) => n.key === key);
    if (currentNode) {
      updateChildrenRecursively([currentNode], check);
    }
    // Mettre à jour les ancêtres
    function updateParents(nodeKey: string | null) {
      if (!nodeKey) return;

      const parentKey = getParentNodeKey(nodeKey);
      if (!parentKey) return;

      const siblings: TreeNodeWithData[] = (
        ObjectUtils as any
      ).findChildrenByKey(value, parentKey);

      const allChecked = siblings.every((child) => {
        const selected = selectionKeys[child.key!];
        return typeof selected === "boolean" ? selected : selected?.checked;
      });
      const someChecked = siblings.some((child) => selectionKeys[child.key!]);

      if (allChecked) {
        selectionKeys[parentKey] = { checked: true, partialChecked: false };
      } else if (someChecked) {
        selectionKeys[parentKey] = { checked: false, partialChecked: true };
      } else {
        delete selectionKeys[parentKey];
      }

      updateParents(parentKey);
    }

    updateParents(key);
    return selectionKeys;
  }

  return { updateSelectionKeys };
};

type UseTreeOperations = {
  value: TreeNodeWithData[] | undefined;
  onAdd?: (news: NewTreePost[]) => void;
};
export const useTreeOperations = ({
  value: _value,
  onAdd,
}: UseTreeOperations) => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentNode, setCurrentNode] = useState<TreeNodeWithData>();
  const childType = getChildType(currentNode?.data.type);
  const handleClickAddNew = (e?: TreeNodeWithData) => () => {
    setCurrentNode(e);
    setOpen(true);
  };

  // Searching // Filter
  const value = useMemo<TreeNodeWithData[] | undefined>(() => _value, [_value]);

  // On adding new nodes
  const handleAddNew = async (
    _news: Record<string, any>[],
    type: NodeTypes
  ) => {
    try {
      const parentIds: string[] = String(currentNode?.key || "").split("-");
      // parentIds.pop();
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
      showErrorToast(error);
    }
  };

  const handleHideAddNew = () => {
    setOpen(false);
    setCurrentNode(undefined);
  };

  return {
    open,
    currentNode,
    childType,
    handleClickAddNew,
    value,
    handleAddNew,
    handleHideAddNew,
  };
};
