import { IdName } from "@/app/types/global";
import axiosInstance, { baseURL } from "@/app/admin/payment/utils/axios";
import { Dialog, DialogProps } from "primereact/dialog";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Button } from "primereact/button";
import PdfDoc from "./PdfDoc";
import { _EditableTable } from "./EditableTable";
import { handleTreatStream } from "@/app/utils/stream";
import useAuthStore from "@/app/store/auth/AuthStore";
import { NewTreePost } from "./PostWithStreaming";
import {
  DuerpHistory,
  fillEmptyValue,
  groupByKeys,
  toDuerpName,
} from "./objectUtils";
import { TreeNodeWithData } from "./CustomTreeComponent";
import { Skeleton } from "primereact/skeleton";
import { showErrorToast } from "@/app/utils/toast";
import { useDebounce } from "react-use";

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

  useDebounce(
    () => {
      if (!props.visible || !treePost?.length) return;
      const minimalist = DuerpHistory.extractMinimalTree(treePost);
      saveOnDocVersion(minimalist);
    },
    1000,
    [props.visible, treePost]
  );
  const saveOnDocVersion = async (duerp: MinimalTreeNode[]) => {
    try {
      const toSend = {
        company: company.name,
        siret: company.siret,
        siren: company.siren,
        category: company.category,
        classement: company.classement,
        date: new Date(),
        domain: company.domainName,
        duerp,
      };
      const response = await axiosInstance.post("/api/duerp-history/", toSend);
    } catch (error) {
      showErrorToast(error);
    }
  };

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
          fileName={toDuerpName(new Date())}
        >
          {Template}
        </PDFDownloadLink>
      </div>
      {loading ? (
        <Skeleton width="100%" height="50rem"></Skeleton>
      ) : perMeasure.length > 200 ? (
        // <_EditableTable data={treePost} company={company} />
        <div>Visualisation impossible à cause de la longueur du document</div>
      ) : (
        <PDFViewer width={"100%"} height={"100%"}>
          <PdfDoc data={treePost} company={company} />
        </PDFViewer>
      )}
      {/* <Prettify>{treePost}</Prettify> */}
    </Dialog>
  );
}

export default PreviewModal;
