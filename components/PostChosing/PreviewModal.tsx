
import { IdName } from "@/app/types/global";
import { baseURL } from "@/app/utils/axios";
import { Dialog, DialogProps } from "primereact/dialog";
import {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Button } from "primereact/button";
import { formatDateTime } from "@/app/utils/stringManip";
import PdfDoc from "./PdfDoc";
import { _EditableTable } from "./EditableTable";
import { handleTreatStream } from "@/app/utils/stream";
import useAuthStore from "@/app/store/auth/authStore";
import { NewTreePost } from "./PostWithStreaming";
import { TreeNode } from "primereact/treenode";
import { fillEmptyValue, groupByKeys } from "./objectUtils";
import { TreeNodeWithData } from "./CustomTreeComponent";
import { RawDisplayer } from "./testingUtils";
import { Skeleton } from "primereact/skeleton";

type PreviewModalProps = { company: CompanyGet } & DialogProps;

type TMeasure = IdName;
type TRisk = IdName & {
  rowSpan?: number;
  measure?: TMeasure[];
  likelihood?: Level;
  severity?: Level;
};
type TWork = IdName & { rowSpan: number; risk?: TRisk[] };
export type OutputMeasure = IdName & { work?: TWork[] };

function PreviewModal({ company, ...props }: PreviewModalProps) {
  const [data, setData] = useState<OutputMeasure[]>([]);
  // const [transformedData, setTransformedData] = useState<OutputMeasure[]>([]);
  const { currentUser } = useAuthStore();
  const [perMeasure, seetPerMeasure] = useState<NewTreePost[]>([]);
  const [loading, setLoading] = useState(false);
  const treePost = useMemo<TreeNodeWithData[]>(() => {
    const _perMeasure = fillEmptyValue(perMeasure);
    const t = groupByKeys(_perMeasure, [
      "_id",
      "workId",
      "riskId",
      "measureId",
    ]) as TreeNodeWithData[];

    return t;
  }, [perMeasure]);

  const getStreamedPdfData = async () => {
    try {
      setLoading(true);
      const response = await handleTreatStream(
        `${baseURL}/api/companies/pdf-data`,
        {
          headers: {
            "x-access-token": currentUser?.accessToken,
          },
        }
      );
      const _data: NewTreePost[] = JSON.parse(response.blob);
      seetPerMeasure(_data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    if (!props.visible) return;
    getStreamedPdfData();
  }, [props.visible]);

  // Download template
  const Template = (({ blob, url, loading, error }: any) => (
    <Button
      label={loading ? "Chargement..." : "Télécharger DUERP PDF"}
      icon="pi pi-cloud-download"
      loading={loading}
    ></Button>
  )) as unknown as ReactNode;

  return (
    <Dialog
      header="Aperçu du DUERP"
      style={{ minWidth: "100vw", minHeight: "100vh" }}
      blockScroll
      maximized
      draggable={false}
      {...props}
    >
      <div className="flex justify-end my-2">
        <PDFDownloadLink
          document={<PdfDoc data={treePost} company={company} />}
          fileName={`[${formatDateTime(new Date(), {
            dateOnly: true,
          })}] Document Unique d'Evaluation de Risques Professionnels`}
        >
          {Template}
        </PDFDownloadLink>
      </div>
      {loading ? (
        <Skeleton width="100%" height="50rem"></Skeleton>
      ) : perMeasure.length > 200 ? (
        <_EditableTable data={treePost} company={company} />
      ) : (
        <PDFViewer width={"100%"} height={"100%"}>
          <PdfDoc data={treePost} company={company} />
        </PDFViewer>
      )}
    </Dialog>
  );
}

export default PreviewModal;


// 'use client'
// import { Dialog, DialogProps } from "primereact/dialog";
// import { useEffect, useState } from "react";
// import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// import { Button } from "primereact/button";
// import { Skeleton } from "primereact/skeleton";
// import PdfDoc from "./PdfDoc";
// import { _EditableTable } from "./EditableTable";

// // Types
// type PreviewModalProps = { company: CompanyGet } & DialogProps;
// type TMeasure = IdName;
// type TRisk = IdName & {
//   rowSpan?: number;
//   measure?: TMeasure[];
//   likelihood?: Level;
//   severity?: Level;
// };
// type TWork = IdName & { rowSpan: number; risk?: TRisk[] };
// export type OutputMeasure = IdName & { work?: TWork[] };

// function PreviewModal({ company, ...props }: PreviewModalProps) {
//   const [data, setData] = useState<OutputMeasure[]>([]);
//   const [perMeasure, setPerMeasure] = useState<OutputMeasure[]>([]);
//   const [loading, setLoading] = useState(false);

//   const getStreamedPdfData = async () => {
//     try {
//       setLoading(true);
//       // Suppression de l'appel API contenant currentUser
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     if (!props.visible) return;
//     getStreamedPdfData();
//   }, [props.visible]);

//   return (
//     <Dialog
//       header="Aperçu du DUERP"
//       style={{ minWidth: "100vw", minHeight: "100vh" }}
//       blockScroll
//       maximized
//       draggable={false}
//       {...props}
//     >
//       <div className="flex justify-end my-2">
//         <PDFDownloadLink
//           document={<PdfDoc data={[]} company={company} />}
//           fileName="DUERP.pdf"
//         >
//         </PDFDownloadLink>
//       </div>
//       {loading ? (
//         <Skeleton width="100%" height="50rem"></Skeleton>
//       ) : perMeasure.length > 200 ? (
//         <_EditableTable data={[]} company={company} />
//       ) : (
//         <PDFViewer width={"100%"} height={"100%"}>
//           <PdfDoc data={[]} company={company} />
//         </PDFViewer>
//       )}
//     </Dialog>
//   );
// }

// export default PreviewModal;
