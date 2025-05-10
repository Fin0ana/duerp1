import { formatDateTime } from "@/app/utils/stringManip";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { TreeNodeWithData } from "./CustomTreeComponent";
import { PostNAChild, RiskNAChild, WorkNAChild } from "./NAViews";

export const REACT_PDF_PAGE_WIDTH = 595;
const TOTAL_PADDING = 10 * 2;
const TOTAL_WIDTH = REACT_PDF_PAGE_WIDTH - TOTAL_PADDING;
const LITTLE_CELL_NUMBER = 3;
const LITTLE_CELL_WIDTH = 30;
const LARGE_CELL_NUMBER = 4;
const LARGE_CELL_WIDTH =
  (TOTAL_WIDTH - LITTLE_CELL_NUMBER * LITTLE_CELL_WIDTH) / LARGE_CELL_NUMBER;

export const docStyle = StyleSheet.create({
  page: { padding: 10, fontSize: 8 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 7,
  },
  cell: {
    border: "1px solid #eae9e9",
    borderBottom: "1px solid #eae9e9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 8,
  },
  headerCell: {
    backgroundColor: "#f5f5f5",
    fontWeight: 600,
  },
  simpleCell: {
    borderRight: "1px solid #eae9e9",
  },
  mostRightCell: {
    borderRight: "1px solid #eae9e9",
  },
  mostBottomCell: {
    borderBottom: "1px solid #eae9e9",
  },
  flexRow: {
    flexDirection: "row",
  },
  largeCell: {
    flexGrow: 1,
    maxWidth: LARGE_CELL_WIDTH, // 579pt total
    minWidth: LARGE_CELL_WIDTH,
  },
  narrowCell: {
    flexGrow: 1,
    maxWidth: LITTLE_CELL_WIDTH,
    minWidth: LITTLE_CELL_WIDTH,
  },
  flexCol: {
    flexDirection: "column",
  },
  textGray: {
    color: "gray",
  },
});

export const largeHeaderCell = [
  docStyle.cell,
  docStyle.simpleCell,
  docStyle.largeCell,
  docStyle.headerCell,
];
export const narrowHeaderCell = [
  docStyle.cell,
  docStyle.simpleCell,
  docStyle.narrowCell,
  docStyle.headerCell,
];

type _PdfDocProps = { data: TreeNodeWithData[]; company: CompanyGet };
function PdfDoc({ data, company }: _PdfDocProps) {
  return (
    <Document
      title={`[${formatDateTime(
        new Date()
      )}] Document Unique d'Evaluation de Risques Professionnels`}
    >
      <Page size={"A4"} style={docStyle.page}>
        {/* Company info */}
        <View style={docStyle.header}>
          <View>
            <Text>{company.name}</Text>
            {company.siren ? <Text>N° SIREN : {company.siren}</Text> : <></>}
            {company.siret ? <Text>N° SIRET : {company.siret}</Text> : <></>}
            {company.domainName ? (
              <Text>Domaine d'activité : {company.domainName}</Text>
            ) : (
              <></>
            )}
            <Text>ID : {company._id}</Text>
          </View>
          <View>
            <Text>Fait le : {formatDateTime(new Date())}</Text>
            <Text>Version 1</Text>
          </View>
        </View>

        <View>
          <Text style={docStyle.title}>
            Document Unique d'Evaluation des Risques Professionnels (DUERP)
          </Text>
        </View>
        {/* DUERP body */}
        <View>
          {data.map((post, postId, self) => (
            <View
              key={post.key}
              style={postId === self.length - 1 ? docStyle.mostBottomCell : {}}
            >
              <Text style={[docStyle.headerCell, docStyle.cell]}>
                Poste : {post.data.name}
              </Text>
              <View style={docStyle.flexRow}>
                <Text style={largeHeaderCell}>Tâche</Text>
                <Text style={largeHeaderCell}>Risque</Text>
                <Text style={narrowHeaderCell}>S</Text>
                <Text style={narrowHeaderCell}>F</Text>
                <Text style={largeHeaderCell}>Prévention</Text>
                <Text style={narrowHeaderCell}>Niv.</Text>
                <Text style={[...largeHeaderCell, docStyle.mostRightCell]}>
                  Observations
                </Text>
              </View>
              <View>
                {post.children?.length ? (
                  post.children?.map((work) => (
                    <View key={work.key} style={docStyle.flexRow}>
                      <Text
                        style={[
                          docStyle.cell,
                          docStyle.simpleCell,
                          docStyle.largeCell,
                        ]}
                      >
                        {work.data.name}
                      </Text>
                      <View style={[docStyle.flexCol, docStyle.largeCell]}>
                        {work.children?.length ? (
                          work.children?.map((risk) => (
                            <View key={risk.key} style={docStyle.flexRow}>
                              <Text
                                style={[
                                  docStyle.cell,
                                  docStyle.simpleCell,
                                  docStyle.largeCell,
                                ]}
                              >
                                {risk.data.name}
                              </Text>
                              <Text
                                style={[
                                  docStyle.cell,
                                  docStyle.simpleCell,
                                  docStyle.narrowCell,
                                ]}
                              >
                                {risk.data.severity}
                              </Text>
                              <Text
                                style={[
                                  docStyle.cell,
                                  docStyle.simpleCell,
                                  docStyle.narrowCell,
                                ]}
                              >
                                {risk.data.likelihood}
                              </Text>
                              <View
                                style={[docStyle.flexCol, docStyle.largeCell]}
                              >
                                {risk.children?.length ? (
                                  risk.children?.map((measure) => (
                                    <View
                                      wrap={false}
                                      key={measure.key}
                                      style={docStyle.flexRow}
                                    >
                                      <Text
                                        style={[
                                          docStyle.cell,
                                          docStyle.simpleCell,
                                          docStyle.largeCell,
                                        ]}
                                      >
                                        {measure.data.name}
                                      </Text>
                                      <Text
                                        style={[
                                          docStyle.cell,
                                          docStyle.simpleCell,
                                          docStyle.narrowCell,
                                        ]}
                                      >
                                        {(risk.data.severity ?? 0) +
                                          (risk.data.likelihood ?? 0)}
                                      </Text>
                                      <Text
                                        style={[
                                          docStyle.cell,
                                          docStyle.mostRightCell,
                                          docStyle.largeCell,
                                        ]}
                                      >
                                        ...
                                      </Text>
                                    </View>
                                  ))
                                ) : (
                                  <RiskNAChild docStyle={docStyle} />
                                )}
                              </View>
                            </View>
                          ))
                        ) : (
                          <WorkNAChild docStyle={docStyle} />
                        )}
                      </View>
                    </View>
                  ))
                ) : (
                  <PostNAChild docStyle={docStyle} />
                )}
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

export default PdfDoc;
