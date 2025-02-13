"use client";

import useAuthStore from "@/app/store/auth/authStore";
import { IdName } from "@/app/types/global";
import axiosInstance, { baseURL } from "@/app/utils/axios";

import { handleTreatStream, parsePerStream } from "@/app/utils/stream";
import { Button } from "primereact/button";
import { TreeNode } from "primereact/treenode";
import { useEffect, useMemo, useState } from "react";
import { nodeTypes } from "@/app/types/custom-tree";
import CustomTreeComponent from "./CustomTreeComponent";
import {
  TreeTableSelectionEvent,
  TreeTableSelectionKeysType,
} from "primereact/treetable";
import PreviewModal from "./PreviewModal";
import { deepEqual } from "@/app/utils/objectManip";
import { showErrorToast, showToast } from "@/app/utils/toast";
import { dynamicErrorAxios } from "@/app/modules/utils/global";
import { Message } from "primereact/message";
import { fillEmptyValue, groupByKeys, removeParents } from "./objectUtils";

export type NewTreePost = IdName & {
  workName?: string;
  riskName?: string;
  measureName?: string;
  workId?: string;
  riskId?: string;
  measureId?: string;
  severity?: number;
  likelihood?: number;
};

type CheckedFormServer = {
  _id: string;
  checked: TreeTableSelectionKeysType;
};
type PostWithStreamingProps = { company: CompanyGet };
function PostWithStreaming({ company }: PostWithStreamingProps) {
  const { currentUser } = useAuthStore();

  /// Get
  const [perMeasure, setPerMeasure] = useState<NewTreePost[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);


  useEffect(() => {
    getWithNoError();
  }, []);

  const searchTemp = (_key?: string): TreeNode => {
    const key = _key ? _key + "-new" : "new";
    const keys = _key?.split("-") || [];
    const type = nodeTypes[keys.length] || "post";
    return {
      key,
      id: "search",
      data: { search: true, type },
      leaf: true,
      selectable: false,
    };
  };

  const addTemp = (_key?: string): TreeNode => {
    const key = _key ? _key + "-new" : "new";
    const keys = _key?.split("-") || [];
    const type = nodeTypes[keys.length] || "post";
    return {
      key,
      id: "new",
      data: { input: true, type },
      leaf: true,
      selectable: false,
    };
  };

  const treePost = useMemo<TreeNode[]>(() => {
    const _perMeasure = fillEmptyValue(perMeasure);
    const t = groupByKeys(
      _perMeasure,
      ["_id", "workId", "riskId", "measureId"],
      { begin: searchTemp, end: addTemp }
    );

    return t;
  }, [perMeasure]);

  const getWithNoError = async () => {
    try {
      setLoadingGet(true);
      const [postStream, checked] = await Promise.all([
        handleTreatStream(`${baseURL}/api/companies/tree-posts-streamed`, {
          headers: {
            "x-access-token": currentUser?.accessToken,
          },
        }),
        handleTreatStream(`${baseURL}/api/companies/checked-measures`, {
          headers: {
            "x-access-token": currentUser?.accessToken,
          },
        }),
      ]);
      const checkedData = JSON.parse(checked.blob);
      const init = JSON.parse(postStream.blob);
      setPerMeasure(init);
      setSelectedNodeKeys(checkedData);
      setLoadingGet(false);
      setHasError(false);
    } catch (error) {
      setLoadingGet(false);
      showErrorToast(error);
      setHasError(true);
    }
  };

  /// Selection
  const [selectedNodeKeys, setSelectedNodeKeys] =
    useState<CheckedFormServer | null>();
  const handleChangeSelection = (e: TreeTableSelectionEvent) => {
    setSelectedNodeKeys((s) =>
      s
        ? { ...s, checked: typeof e.value === "string" ? {} : e.value }
        : { checked: typeof e.value === "string" ? {} : e.value, _id: "" }
    );
  };


  /// Add
  const handleAddNew = (news: NewTreePost[]) => {
    const toAdd = news.filter((neww) => !deepEqual(neww, perMeasure));
    setPerMeasure((m) => {
      const removedParent = removeParents(fillEmptyValue(m), toAdd);
      return removedParent.concat(toAdd);
    });
  };

  /// Saving
  const [loading, setLoading] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);
  const handleSave = async () => {
    try {
      if (!selectedNodeKeys?.checked) return;
      setLoading(true);
      const checked = filterSelectedWithNew(selectedNodeKeys.checked);

      const response = await axiosInstance.put(
        `/api/companies/check-measures/${
          selectedNodeKeys?._id ? selectedNodeKeys._id : "new"
        }`,
        { checked }
      );
      setSelectedNodeKeys(response.data);
      setLoading(false);
      showToast({
        summary: "Succès",
        detail: "Enregistré avec succès",
        severity: "success",
      });
    } catch (error) {
      setLoading(false);
      showToast({
        summary: "Error",
        detail: dynamicErrorAxios(error),
        severity: "error",
      });
    }
  };

  const filterSelectedWithNew = (
    input: TreeTableSelectionKeysType
  ): TreeTableSelectionKeysType => {
    return Object.entries(input).reduce((acc, [key, value]) => {
      if (key.includes("new") || key.includes("undefined")) return acc;
      return { ...acc, [key]: value };
    }, {} as TreeTableSelectionKeysType);
  };

  // Preview
  const [openPreview, setOpenPreview] = useState(false);

  // Error
  const content = (
    <div className="flex items-center gap-2">
      <div>Une erreur s'est produite</div>
      <i
        className="pi pi-refresh cursor-pointer"
        title="Rafraîchir ?"
        onClick={getWithNoError}
      ></i>
    </div>
  );

  // ok
  const handleOk = (obj: any) => {
    setPerMeasure((m) => m.concat(obj));
  };
  return (
    <div className="card">
      {hasError ? (
        <Message
          className="border-0 border-l-4 border-red-500 text-red-500 bg-red-200 w-full justify-start"
          severity="error"
          content={content}
        />
      ) : (
        <></>
      )}
      {/* <RawDisplayer perMeasure={perMeasure} /> */}
      {/* <FalseAdd onOk={handleOk} /> */}
      <CustomTreeComponent
        value={treePost}
        selectionKeys={selectedNodeKeys?.checked}
        onSelectionChange={handleChangeSelection}
        selectionMode="checkbox"
        className="p-treetable-sm"
        stripedRows
        loading={loadingGet}
        onAdd={handleAddNew}
      />
      <PreviewModal
        company={company}
        onHide={() => setOpenPreview(false)}
        visible={openPreview}
      />

      <div className="mt-2 flex gap-2 justify-end">
        <Button
          label="Enregistrer"
          icon="pi pi-save"
          onClick={handleSave}
          loading={loading}
        ></Button>
        <Button
          label="Voir aperçu"
          icon="pi pi-eye"
          onClick={() => setOpenPreview(true)}
          loading={loading}
          severity="secondary"
        ></Button>
      </div>
    </div>
  );
}

export default PostWithStreaming;



// "use client";

// import { IdName } from "@/app/types/global";
// import axiosInstance, { baseURL } from "@/app/utils/axios";
// import { Button } from "primereact/button";
// import { TreeNode } from "primereact/treenode";
// import { useEffect, useMemo, useState } from "react";
// import { nodeTypes } from "@/app/types/custom-tree";
// import CustomTreeComponent from "./CustomTreeComponent";
// import {
//   TreeTableSelectionEvent,
//   TreeTableSelectionKeysType,
// } from "primereact/treetable";
// import PreviewModal from "./PreviewModal";
// import { deepEqual } from "@/app/utils/objectManip";
// import { showErrorToast, showToast } from "@/app/utils/toast";
// import { dynamicErrorAxios } from "@/app/modules/utils/global";
// import { Message } from "primereact/message";
// import { fillEmptyValue, groupByKeys, removeParents } from "./objectUtils";

// export type NewTreePost = IdName & {
//   workName?: string;
//   riskName?: string;
//   measureName?: string;
//   workId?: string;
//   riskId?: string;
//   measureId?: string;
//   severity?: number;
//   likelihood?: number;
// };

// type CheckedFormServer = {
//   _id: string;
//   checked: TreeTableSelectionKeysType;
// };
// type PostWithStreamingProps = { company: CompanyGet };

// async function fetchStreamedData(url: string) {
//   const response = await fetch(url);
//   if (!response.ok) throw new Error("Network response was not ok");
//   return response.json();
//   //currentuser 
// }
// function PostWithStreaming({ company }: PostWithStreamingProps) {
//   const [perMeasure, setPerMeasure] = useState<NewTreePost[]>([]);
//   const [hasError, setHasError] = useState<boolean>(false);
//   const [selectedNodeKeys, setSelectedNodeKeys] =
//     useState<CheckedFormServer | null>();
//   const [loading, setLoading] = useState(false);
//   const [loadingGet, setLoadingGet] = useState(false);
//   const [openPreview, setOpenPreview] = useState(false);

//   useEffect(() => {
//     getWithNoError();
//   }, []);

//   const searchTemp = (_key?: string): TreeNode => {
//     const key = _key ? _key + "-new" : "new";
//     const keys = _key?.split("-") || [];
//     const type = nodeTypes[keys.length] || "post";
//     return {
//       key,
//       id: "search",
//       data: { search: true, type },
//       leaf: true,
//       selectable: false,
//     };
//   };

//   const addTemp = (_key?: string): TreeNode => {
//     const key = _key ? _key + "-new" : "new";
//     const keys = _key?.split("-") || [];
//     const type = nodeTypes[keys.length] || "post";
//     return {
//       key,
//       id: "new",
//       data: { input: true, type },
//       leaf: true,
//       selectable: false,
//     };
//   };

//   const treePost = useMemo<TreeNode[]>(() => {
//     const _perMeasure = fillEmptyValue(perMeasure);
//     return groupByKeys(_perMeasure, ["_id", "workId", "riskId", "measureId"], {
//       begin: searchTemp,
//       end: addTemp,
//     });
//   }, [perMeasure]);

//   const getWithNoError = async () => {
//     try {
//       setLoadingGet(true);
//       const [postStream, checked] = await Promise.all([
//         fetchStreamedData(`${baseURL}/api/companies/tree-posts-streamed`),
//         fetchStreamedData(`${baseURL}/api/companies/checked-measures`),
//       ]);
//       setPerMeasure(postStream);
//       setSelectedNodeKeys(checked);
//       setLoadingGet(false);
//       setHasError(false);
//     } catch (error) {
//       setLoadingGet(false);
//       showErrorToast(error);
//       setHasError(true);
//     }
//   };

//   const handleChangeSelection = (e: TreeTableSelectionEvent) => {
//     setSelectedNodeKeys((s) =>
//       s
//         ? { ...s, checked: typeof e.value === "string" ? {} : e.value }
//         : { checked: typeof e.value === "string" ? {} : e.value, _id: "" }
//     );
//   };

//   const handleAddNew = (news: NewTreePost[]) => {
//     const toAdd = news.filter((neww) => !deepEqual(neww, perMeasure));
//     setPerMeasure((m) => {
//       const removedParent = removeParents(fillEmptyValue(m), toAdd);
//       return removedParent.concat(toAdd);
//     });
//   };

//   return (
//     <div className="card">
//       {hasError && (
//         <Message className="border-0 border-l-4 border-red-500 text-red-500 bg-red-200 w-full justify-start" severity="error" content={<div className="flex items-center gap-2"><div>Une erreur s'est produite</div><i className="pi pi-refresh cursor-pointer" title="Rafraîchir ?" onClick={getWithNoError}></i></div>} />
//       )}
//       <CustomTreeComponent
//         value={treePost}
//         selectionKeys={selectedNodeKeys?.checked}
//         onSelectionChange={handleChangeSelection}
//         selectionMode="checkbox"
//         className="p-treetable-sm"
//         stripedRows
//         loading={loadingGet}
//         onAdd={handleAddNew}
//       />
//       <PreviewModal company={company} onHide={() => setOpenPreview(false)} visible={openPreview} />
//     </div>
//   );
// }

// export default PostWithStreaming;
