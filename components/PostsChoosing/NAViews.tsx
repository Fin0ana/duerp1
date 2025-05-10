import { Styles, Text, View } from "@react-pdf/renderer";

type NAChildType = { docStyle: Styles };
export function PostNAChild({ docStyle }: NAChildType) {
  return (
    <View style={docStyle.flexRow}>
      <Text style={[docStyle.cell, docStyle.simpleCell, docStyle.largeCell, docStyle.textGray]}>
        Aucune tâche connue
      </Text>
      <View style={[docStyle.flexCol, docStyle.largeCell]}>
        <WorkNAChild docStyle={docStyle} />
      </View>
    </View>
  );
}

export function WorkNAChild({ docStyle }: NAChildType) {
  return (
    <View style={docStyle.flexRow}>
      <Text style={[docStyle.cell, docStyle.simpleCell, docStyle.largeCell, docStyle.textGray]}>
        Aucun risque identifié
      </Text>
      <Text style={[docStyle.cell, docStyle.simpleCell, docStyle.narrowCell, docStyle.textGray]}>
        0
      </Text>
      <Text style={[docStyle.cell, docStyle.simpleCell, docStyle.narrowCell, docStyle.textGray]}>
        0
      </Text>
      <View style={[docStyle.flexCol, docStyle.largeCell]}>
        <RiskNAChild docStyle={docStyle} />
      </View>
    </View>
  );
}

export function RiskNAChild({ docStyle }: NAChildType) {
  return (
    <View wrap={false} style={docStyle.flexRow}>
      <Text style={[docStyle.cell, docStyle.simpleCell, docStyle.largeCell, docStyle.textGray]}>
        Aucune mesure connu
      </Text>
      <Text style={[docStyle.cell, docStyle.simpleCell, docStyle.narrowCell, docStyle.textGray]}>
        0
      </Text>
      <Text style={[docStyle.cell, docStyle.mostRightCell, docStyle.largeCell, docStyle.textGray]}>
        Aucune observation
      </Text>
    </View>
  );
}
