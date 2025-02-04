type HistoryGet = {
  collectionName: string;
  documentId: Types.ObjectId;
  operation: "create" | "update" | "delete";
  changes: Record<string, { after: any; before: any }>;
  userId?: string;
  userUsername?: string;
};
