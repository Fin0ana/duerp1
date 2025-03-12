import {
  Fragment,
  MouseEvent,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TreeNodeWithData } from "../CustomTreeComponent";
import { TreeNode } from "primereact/treenode";
import {
  TreeTableSelectionEvent,
  TreeTableSelectionKeysType,
} from "primereact/treetable";
import { NewTreePost } from "../PostWithStreaming";
import { KeyString } from "@/app/modules/utils/types";
import NodeDisplayer from "./NodeDisplayer";
import {
  useHoverCard,
  usePropagate,
  useTreeOperations,
} from "@/app/hooks/useHorizontalTree";
import { MultiSelectChangeEvent } from "primereact/multiselect";
import { useAssignIdToMultiStateCheckboxes } from "@/app/hooks/useMultiStateCheck";
import { BlockUI } from "primereact/blockui";
import SearchTemplate from "../SearchTemplate";
import AddTemplate from "../AddNewTemplate";
import ModalAddNewNode from "../ModalAddNewNode";
import { useWorkPercentStore } from "@/app/store/work/workPercent";
import { useComputePercent } from "@/app/hooks/useComputePercentage";
import { PercentageTemplate } from "./PercentageTemplate";
import { useDebounce, usePrevious } from "react-use";
import { ComputePercentageUtils } from "../objectUtils";
import { showErrorToast, showToast } from "@/app/utils/toast";
import { motion } from "framer-motion";

type HorizontalTreeProps = {
  value: TreeNode[];
  selectionKeys: TreeTableSelectionKeysType | undefined;
  onSelectionChange: (e: TreeTableSelectionEvent) => void;
  loading: boolean;
  onAdd: (news: NewTreePost[]) => void;
  onSearch: (query: KeyString) => void;
  search: KeyString | undefined;
  onSave?: () => Promise<void>;
};
const HorizontalTree = ({
  onAdd,
  onSelectionChange,
  onSearch,
  loading,
  search,
  selectionKeys,
  value: _value,
  onSave,
}: HorizontalTreeProps) => {
  // Add new
  const {
    value,
    handleClickAddNew,
    handleHideAddNew,
    open,
    childType,
    handleAddNew,
  } = useTreeOperations({ value: _value as TreeNodeWithData[], onAdd });

  // Global declarations
  const { handleHoverCard, chosenPostId, chosenWorkId, chosenRiskId } =
    useHoverCard(value);
  const [chosenPost, setChosenPost] = useState<TreeNodeWithData | undefined>(); // Natao useState fa tsy useMemo satria misy conditions mampiova azy maromaro
  const findElement = (
    array: TreeNodeWithData[] | undefined,
    key: string | number | null | undefined
  ) => {
    if (key == null || !array) return;
    return typeof key === "number"
      ? array.at(key)
      : array.find((item) => item.data?.id === key);
  };
  const chosenWork = useMemo(
    () => findElement(chosenPost?.children, chosenWorkId),
    [chosenPost, chosenWorkId]
  );
  const chosenRisk = useMemo(
    () => findElement(chosenWork?.children, chosenRiskId),
    [chosenWork, chosenRiskId]
  );

  // percent declarations
  const {
    pendingPost,
    workPercents,
    getWorkPercentForPost,
    setWorkPercentForPost,
  } = useWorkPercentStore();

  const { setCheckedAndPercentage } = useComputePercent();
  const percentToSend = useMemo<WorkPercentPost[]>(() => {
    if (!chosenPost?.children || !chosenPost.key) return [];
    const _percentToSend: WorkPercentGet[] =
      ComputePercentageUtils.convertTreeNodeToWorkPercent(
        chosenPost?.children,
        workPercents[chosenPost.key]
      );
    return _percentToSend;
  }, [chosenPost]);

  const getPercentsOnChosenIdChange = async () => {
    const _chosenPost = findElement(value, chosenPostId);
    if (!_chosenPost || String(_chosenPost.key).includes("new")) return;
    const __chosenPost: TreeNodeWithData = { ..._chosenPost };
    const workPercentsForPost = await getWorkPercentForPost(
      String(_chosenPost.key)
    );
    setCheckedAndPercentage({
      mutableChosenPost: __chosenPost,
      workPercentsForPost,
      selectionKeys,
    });
    setChosenPost(__chosenPost);
  };

  const getPercentsOnCheck = () => {
    if (!chosenPost || String(chosenPost.key).includes("new")) return;
    const __chosenPost: TreeNodeWithData = { ...chosenPost };
    setCheckedAndPercentage({
      mutableChosenPost: __chosenPost,
      workPercentsForPost: workPercents[String(chosenPost.key)],
      selectionKeys,
      changeType: "checking",
    });
    setChosenPost(__chosenPost);
  };

  // Global calls
  useEffect(() => {
    if (!firstValue || loading) return;
    // Index 1 because the first node in value is search temp
    handleHoverCard(1, "post")();
  }, [loading]);

  // Click
  const { updateSelectionKeys } = usePropagate(value);
  const handleClickCard = (
    e: MultiSelectChangeEvent,
    node: TreeNodeWithData
  ) => {
    const downValue = e.value === "all";
    const _selectionKeys = updateSelectionKeys(node, downValue, selectionKeys);

    onSelectionChange({
      value: _selectionKeys,
      originalEvent: null,
    } as unknown as TreeTableSelectionEvent);
  };

  // Percent calls
  useEffect(() => {
    getPercentsOnChosenIdChange();
  }, [chosenPostId, value]);

  useEffect(() => {
    getPercentsOnCheck();
  }, [selectionKeys]);

  const onPercentChange = (percent: number, node: TreeNodeWithData) => {
    if (!chosenPost) return;
    const _chosenPost = { ...chosenPost };
    const currentWork = _chosenPost.children?.find(
      (work) => work.key === node.key
    );
    if (!currentWork) return;
    currentWork.data.percent = percent;
    currentWork.data.status = "manual";
    setCheckedAndPercentage({
      mutableChosenPost: _chosenPost,
      selectionKeys,
      workPercentsForPost: workPercents[chosenPost.key!],
      changeType: "input",
    });
    setChosenPost(_chosenPost);
  };
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

  // Id
  useAssignIdToMultiStateCheckboxes(chosenPost, chosenWork, chosenRisk);
  const firstValue = useMemo(() => findElement(value, 1), [value]);

  // Sort
  const sortedWorks = useMemo(() => {
    const key = chosenPost?.key;
    if (!chosenPost?.children || !key) return [];
    const currPercent = (postId: string, workId: string) =>
      workPercents[key]?.find(
        (wp) => wp.postId === postId && wp.workId === workId
      )?.percent ?? -1;
    return chosenPost.children.sort(
      (a, b) =>
        currPercent(String(key), String(b.data.id)) -
        currPercent(String(key), String(a.data.id))
    );
  }, [chosenPost?.children, JSON.stringify(workPercents)]);

  return (
    <BlockUI blocked={loading || pendingPost}>
      <div className="min-w-[959px] min-h-52 max-w-full overflow-scroll">
        <ModalAddNewNode
          onHide={handleHideAddNew}
          visible={open}
          type={childType}
          onAdd={handleAddNew}
        />
        <div className="grid grid-cols-4 gap-5">
          <div className="col-span-1 flex flex-col gap-2">
            <h1 className="font-bold text-xl text-primary-900 pb-3">
              <div>Postes</div>
              <div>&nbsp;</div>
            </h1>

            {value?.[0] ? (
              <SearchTemplate
                query={search}
                setQuery={onSearch}
                e={value?.[0]}
              />
            ) : (
              <></>
            )}
            <ScrollLimit>
              {value
                ?.filter((node) => !node.data.search || !node.data.input)
                .map((node, id) => (
                  <NodeDisplayer
                    key={`${node.key}-${id}`}
                    checkedState={selectionKeys?.[node.key!]}
                    node={node}
                    onMouseEnter={handleHoverCard(node.data.id || 0, "post")}
                    active={chosenPost?.key === node.key}
                    onCheck={handleClickCard}
                  />
                ))}
            </ScrollLimit>
            <AddTemplate handleClickAddNew={handleClickAddNew()} />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <h1 className="font-bold text-xl text-primary-900 pb-3">
              <div>Tâches pour</div>
              <div title={chosenPost?.data.name} className="truncate">
                {chosenPost?.data.name}
              </div>
            </h1>
            {chosenPost ? (
              <SearchTemplate
                query={search}
                setQuery={onSearch}
                e={chosenPost}
              />
            ) : (
              <></>
            )}
            <ScrollLimit>
              {sortedWorks?.map((node, id) => (
                <motion.div
                  key={node.key}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <NodeDisplayer
                    checkedState={selectionKeys?.[node.key!]}
                    node={node}
                    onMouseEnter={handleHoverCard(node.data.id || 0, "work")}
                    active={chosenWork?.key === node.key}
                    onCheck={handleClickCard}
                    className={`group`}
                    TemplateCenter={PercentageTemplate}
                    onPercentChange={onPercentChange}
                    title={String(node.key)}
                  />
                </motion.div>
              ))}
            </ScrollLimit>
            {chosenPost ? (
              <AddTemplate
                handleClickAddNew={handleClickAddNew(chosenPost)}
                type="post"
              />
            ) : (
              <></>
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <h1 className="font-bold text-xl text-primary-900 pb-3">
              <div>Risques pour</div>
              <div title={chosenWork?.data.name} className="truncate">
                {chosenWork?.data.name}
              </div>
            </h1>
            {chosenWork ? (
              <SearchTemplate
                query={search}
                setQuery={onSearch}
                e={chosenWork}
              />
            ) : (
              <></>
            )}
            <ScrollLimit>
              {chosenWork?.children?.map((node, id) => (
                <NodeDisplayer
                  checkedState={selectionKeys?.[node.key!]}
                  key={node.key}
                  node={node}
                  onMouseEnter={handleHoverCard(node.data.id || 0, "risk")}
                  active={chosenRisk?.key === node.key}
                  onCheck={handleClickCard}
                />
              ))}
            </ScrollLimit>
            {chosenWork ? (
              <AddTemplate
                handleClickAddNew={handleClickAddNew(chosenWork)}
                type="work"
              />
            ) : (
              <></>
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-2">
            <h1 className="font-bold text-xl text-primary-900 pb-3">
              <div>Mesures pour</div>
              <div title={chosenRisk?.data.name} className="truncate">
                {chosenRisk?.data.name}
              </div>
            </h1>
            {chosenRisk ? (
              <SearchTemplate
                query={search}
                setQuery={onSearch}
                e={chosenRisk}
              />
            ) : (
              <></>
            )}
            <ScrollLimit>
              {chosenRisk?.children?.map((node, id) => (
                <NodeDisplayer
                  checkedState={selectionKeys?.[node.key!]}
                  key={node.key}
                  node={node}
                  onCheck={handleClickCard}
                />
              ))}
            </ScrollLimit>
            {chosenRisk ? (
              <AddTemplate
                handleClickAddNew={handleClickAddNew(chosenRisk)}
                type="risk"
              />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2">
          {/* <div className="col-span-1">
            <Prettify>
              {chosenPost?.key && workPercents[chosenPost.key]}
            </Prettify>
          </div> */}
          {/* <div className="col-span-1">
            <Prettify>{percentToSend}</Prettify>
          </div> */}
          {/* <div className="col-span-1">
            <Prettify>{chosenPost?.children?.map((w) => w.data)}</Prettify>
          </div> */}
        </div>
      </div>
    </BlockUI>
  );
};

export default HorizontalTree;

type ScrollLimitProps = {
  children?: ReactElement | ReactElement[];
};
function ScrollLimit({ children }: ScrollLimitProps) {
  return (
    <div className="max-h-[25rem] overflow-y-auto flex flex-col gap-2">
      {children}
    </div>
  );
}
