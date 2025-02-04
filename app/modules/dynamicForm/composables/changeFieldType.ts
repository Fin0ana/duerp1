import { TDynamicForm } from "../types";

export const FIELDS_TYPES: { label: string; value: TDynamicForm["type"] }[] = [
  { label: "Texte court", value: "input" },
  { label: "Texte long", value: "textarea" },
  { label: "Nombre", value: "number" },
  { label: "Texte avec masque", value: "mask" },
  { label: "Mot de passe", value: "password" },
  { label: "Date", value: "date" },
  { label: "Choix multiples", value: "checkbox" },
  { label: "Choix unique", value: "radio" },
  { label: "Choix dépliant", value: "select" },
  { label: "Choix dépliant multiple", value: "multiselect" },
  { label: "Choix dépliant récursive", value: "treeselect" },
  { label: "Choix dépliant virtuel", value: "lazyselect" },
//   { label: "", value: "filepond" },
//   { label: "", value: "file" },
];

