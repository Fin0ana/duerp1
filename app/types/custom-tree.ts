import {
  TreeTableCheckboxSelectionKeyType,
  TreeTableSelectionKeysType,
} from "primereact/treetable";

export const nodeTypes = ["post", "work", "risk", "measure"] as const;

export type NodeTypes = (typeof nodeTypes)[number];
export type NodeAsKey = { [k in NodeTypes]: { name: string; sex: "F" | "M" } };
export const nodeTypesFr: NodeAsKey = {
  post: { name: "poste", sex: "M" },
  work: { name: "tâche", sex: "F" },
  risk: { name: "risque", sex: "M" },
  measure: { name: "mesure", sex: "F" },
};
export const nodeOrder: NodeTypes[] = ["post", "work", "risk", "measure"];

export type BodyTemplateProps = {
  name?: string;
  input?: boolean;
  id?: string;
  search?: boolean;
  type: NodeTypes;
  severity?: number;
  likelihood?: number;
  rowSpan?: number
};

export type CheckedFormServer = {
  _id: string;
  checked: TreeTableSelectionKeysType;
};

export type SelectAllValue = "all" | "partial" | undefined;

export type SelectionKeys =
  | { [k: string]: TreeTableCheckboxSelectionKeyType }
  | undefined
  | null;
