import { Document, Page, Text, View } from "@react-pdf/renderer";
import React from "react";
import { TreeNodeWithData } from "./CustomTreeComponent";
import { docStyle, largeHeaderCell, narrowHeaderCell } from "./PdfDoc";
import { formatDateTime } from "@/app/utils/stringManip";
import { PostNAChild, RiskNAChild, WorkNAChild } from "./NAViews";

type ReducedPdfDocProps = { company: CompanyGet; data: TreeNodeWithData[] };
const ReducedPdfDoc = ({ company, data }: ReducedPdfDocProps) => {
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
};

export default ReducedPdfDoc;
