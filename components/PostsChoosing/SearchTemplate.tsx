import { TreeNode } from "primereact/treenode";
import { TreeNodeWithData } from "./CustomTreeComponent";
import { ChangeEvent } from "react";
import { nodeTypesFr } from "@/app/types/custom-tree";
import { KeyString } from "@/app/modules/utils/types";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";

type SearchTemplateProps = {
  e: TreeNodeWithData;
  query?: KeyString;
  setQuery?: (search: KeyString) => void;
};
const SearchTemplate = (props: SearchTemplateProps) => {
  const { e, query = {} } = props;
  const type = nodeTypesFr[e.data.type];
  const name = type.name;

  const handleSearch =
    (treeNode: TreeNodeWithData) => (e: ChangeEvent<HTMLInputElement>) => {
      props.setQuery?.({ ...query, [treeNode.key!]: e.target.value });
    };

  const handleResetSearch = (treeNode: TreeNodeWithData) => () => {
    props.setQuery?.({ ...query, [treeNode.key!]: "" });
  };

  return (
    <span className="relative">
      <div className="p-icon-field p-icon-field-right">
        <InputIcon className="pi pi-search"></InputIcon>
        <InputText
          value={query[e.key!] || ""}
          onChange={handleSearch(e)}
          className="p-inputtext-sm w-full"
          placeholder={`Rechercher ${name}`}
        />
        {query[e.key!] ? (
          <i
            className="absolute pi pi-times right-8 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={handleResetSearch(e)}
          />
        ) : (
          <></>
        )}
      </div>
    </span>
  );
};

export default SearchTemplate;
