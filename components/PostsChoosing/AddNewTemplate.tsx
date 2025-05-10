import { type NodeTypes, nodeTypesFr } from "@/app/types/custom-tree";
import { Button } from "primereact/button";
import { getChildType } from "./objectUtils";

type AddTemplateProps = {
  handleClickAddNew: () => void;
  type?: NodeTypes;
};
const AddTemplate = ({ handleClickAddNew, type }: AddTemplateProps) => {
  const childType: NodeTypes | undefined = getChildType(type);

  if (!childType) return <></>;
  const nodeTypeObject = nodeTypesFr[childType];
  const a = nodeTypeObject.sex === "F" ? "une nouvelle" : "un nouveau";
  const name = nodeTypeObject.name;
  return (
    <Button
      size="small"
      icon="pi pi-plus"
      severity="success"
      label={`Ajouter ${a} ${name}`}
      onClick={handleClickAddNew}
    ></Button>
  );
};

export default AddTemplate;
