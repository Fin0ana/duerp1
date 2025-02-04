import { CSSProperties, Fragment, useMemo } from "react";
import { OutputMeasure } from "./PreviewModal";
import { TreeNode } from "primereact/treenode";
import Prettify from "@/app/components/common/misc/Prettify";
import { formatDateTime } from "@/app/utils/stringManip";
import { TreeNodeWithData } from "./CustomTreeComponent";

type EditableTableProps = { data: OutputMeasure[]; company: CompanyGet };
const EditableTable = ({ data, company }: EditableTableProps) => {
  return (
    <table className="pdf-table">
      {data?.map((p) => (
        <Fragment key={p._id}>
          <thead>
            <tr>
              <th colSpan={7}>Poste: {p.name}</th>
            </tr>
            <tr>
              <th>Tâche</th>
              <th>Risque</th>
              <th className="w-5">S</th>
              <th className="w-5">F</th>
              <th>Prévention</th>
              <th className="w-5">Niv.</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            {p.work?.map((w) =>
              w.risk?.map((r, rId) =>
                r.measure?.map((m, mId) => (
                  <tr key={`${p._id}-${w._id}-${r._id}-${m._id}`}>
                    {rId === 0 && mId === 0 && (
                      <td rowSpan={w.rowSpan || 1}>{w.name}</td>
                    )}
                    {mId === 0 && (
                      <Fragment>
                        <td rowSpan={r.rowSpan || 1}>{r.name}</td>
                        <td rowSpan={r.rowSpan || 1}>{r.severity}</td>
                        <td rowSpan={r.rowSpan || 1}>{r.likelihood}</td>
                      </Fragment>
                    )}
                    <td>{m.name}</td>
                    <td>4</td>
                    <td>So sleepy</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </Fragment>
      ))}
    </table>
  );
};

type _EditableTableProps = { data: TreeNodeWithData[]; company: CompanyGet };
export const _EditableTable = ({ data, company }: _EditableTableProps) => {
  const dataToShow = useMemo<TreeNodeWithData[]>(() => {
    const _data = data;
    _data.forEach((post) => {
      post.children?.forEach((work) => {
        work.children?.forEach((risk) => {
          // Set rowSpan for each risk based on the number of measures it has
          risk.data.rowSpan = risk.children?.length || 0;
        });

        // Set rowSpan for each work based on the total number of measures in all risks
        work.data.rowSpan =
          work.children?.reduce(
            (sum, risk) => sum + (risk.data.rowSpan || 0),
            0
          ) || 0;
      });
    });
    return _data;
  }, [data]);
  return (
    <table className="pdf-table">
      {dataToShow?.map((p) => (
        <Fragment key={p.key}>
          <thead>
            <tr>
              <th colSpan={7}>Poste: {p.data.name}</th>
            </tr>
            <tr>
              <th>Tâche</th>
              <th>Risque</th>
              <th className="w-5">S</th>
              <th className="w-5">F</th>
              <th>Prévention</th>
              <th className="w-5">Niv.</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            {p.children?.map((w) =>
              w.children?.map((r, rId) =>
                r.children?.map((m, mId) => (
                  <tr key={m.key}>
                    {rId === 0 && mId === 0 && (
                      <td rowSpan={w.data.rowSpan || 1}>{w.data.name}</td>
                    )}
                    {mId === 0 && (
                      <Fragment>
                        <td rowSpan={r.data.rowSpan || 1}>{r.data.name}</td>
                        <td rowSpan={r.data.rowSpan || 1}>{r.data.severity}</td>
                        <td rowSpan={r.data.rowSpan || 1}>
                          {r.data.likelihood}
                        </td>
                      </Fragment>
                    )}
                    <td>{m.data.name}</td>
                    <td>{r.data.severity + r.data.likelihood}</td>
                    <td>So sleepy</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </Fragment>
      ))}
    </table>
  );
};

export default EditableTable;

