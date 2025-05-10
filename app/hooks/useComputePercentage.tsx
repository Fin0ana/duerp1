import { TreeNodeWithData } from "@/components/PostsChoosing/CustomTreeComponent";
import { TreeTableSelectionKeysType } from "primereact/treetable";
import { ComputePercentageUtils } from "@/components/PostsChoosing/objectUtils";

type UseComputePercentArgs = {
  // selectionKeys: TreeTableSelectionKeysType | undefined;
  onPercentChange?: (e: number, node: TreeNodeWithData) => void;
};
export function useComputePercent() {
  // Set the checked attribute inside chosenPost children
  function setChecked(
    mutableChosenPost: TreeNodeWithData,
    selectionKeys: TreeTableSelectionKeysType | undefined
  ) {
    mutableChosenPost.children = mutableChosenPost.children?.map((work) => {
      const checked =
        !!selectionKeys &&
        Object.entries(selectionKeys).some(
          ([key, value]) =>
            key === work.key &&
            value &&
            (typeof value === "object"
              ? value.checked || value.partialChecked
              : value)
        );
      const data: TreeNodeWithData["data"] = { ...work.data, checked: checked };
      return { ...work, data };
    });
    return mutableChosenPost;
  }

  function findCurrentWorkPercent(
    workPercents: WorkPercentGet[] | undefined,
    postId: string | undefined,
    workId: string | undefined
  ) {
    return workPercents?.find(
      (workPercent) =>
        workPercent.postId === postId && workPercent.workId === workId
    );
  }

  type SetCheckedAndPercentageOptions = {
    /** A changeable chosen post */
    mutableChosenPost: TreeNodeWithData | undefined;
    /** The work percentage from backend */
    workPercentsForPost: WorkPercentGet[];
    /** Tree table selection state */
    selectionKeys: TreeTableSelectionKeysType | undefined;
    /**
     * It's the hook that triggers this function
     * @defaultValue "id"
     */
    changeType?: "id" | "checking" | "input";
  };
  function setCheckedAndPercentage({
    mutableChosenPost,
    workPercentsForPost,
    selectionKeys,
    changeType = "id",
  }: SetCheckedAndPercentageOptions) {
    if (!mutableChosenPost) return;
    setChecked(mutableChosenPost, selectionKeys);
    if (changeType === "checking" || changeType === "input") {
      setPercentageFromChecking(mutableChosenPost);

      return mutableChosenPost;
    }
    setPercentageFromIdChanges(mutableChosenPost, workPercentsForPost);
    return mutableChosenPost;
  }

  function setPercentageFromIdChanges(
    mutableChosenPost: TreeNodeWithData,
    workPercentsForPost: WorkPercentGet[]
  ) {
    mutableChosenPost.children = mutableChosenPost.children?.map((work) => {
      const currentWorkPercent = findCurrentWorkPercent(
        workPercentsForPost,
        String(mutableChosenPost.key),
        work.data.id
      );
      if (!currentWorkPercent) return work;
      const data = structuredClone(work.data);
      data.percent = currentWorkPercent.percent;
      data.status = currentWorkPercent.status;
      return {
        ...work,
        data,
      };
    });
  }

  function setPercentageFromChecking(mutableChosenPost: TreeNodeWithData) {
    mutableChosenPost.children = mutableChosenPost.children?.map((work) => {
      if (work.data.status === "manual") return work;

      const percentLeft =
        100 - ComputePercentageUtils.getManualTotal(mutableChosenPost);
      const autoCount =
        ComputePercentageUtils.getAutoPercentCount(mutableChosenPost);

      const oneAutoPercent = autoCount
        ? Math.floor((percentLeft * 100) / autoCount) / 100
        : 0;

      const data = structuredClone(work.data);
      data.percent = oneAutoPercent;
      data.status = "auto";

      return { ...work, data };
    });
  }

  return { setCheckedAndPercentage };
}
