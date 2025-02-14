import { Dialog, DialogProps } from "primereact/dialog";
import { TreeNodeWithData } from "./CustomTreeComponent";
import { NodeTypes, nodeTypesFr } from "@/app/types/custom-tree";
import { Button } from "primereact/button";
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Fragment, useState } from "react";
import axiosInstance from "@/app/admin/payment/utils/axios";
import { TPaginatedData } from "@/app/modules/datatable/types.d";
import { strongStringCompare } from "@/app/utils/stringManip";
import { isArray } from "@/app/utils/objectManip";
import ErrorMessage from "@/app/modules/dynamicForm/components/cells/ErrorMessage";
import { hasType } from "@/app/modules/utils/global";

type ModalAddNewNodeProps = DialogProps & {
  currentNode?: TreeNodeWithData;
  onAdd?: (news: Record<string, any>[], type: NodeTypes) => void;
};
type AutoCompleteResponse = {
  _id: string;
  name: string;
  keywords?: string[];
  equivalent?: string[];
  relatedActivity?: string;
};
type GroupedAutoComplete = { label: string; items: AutoCompleteResponse[] };
type AutoCompleteValue = {
  value: Record<string, any>;
};
type PossibleErrors = { errors: string[] } | null;

function ModalAddNewNode({
  currentNode,
  onAdd,
  ...props
}: ModalAddNewNodeProps) {
  if (!currentNode) return;
  const type = nodeTypesFr[currentNode.data.type];
  const a = type.sex === "F" ? "une nouvelle" : "un nouveau";
  const n = type.sex === "F" ? "Nouvelle" : "Nouveau";
  const name = type.name;

  const [newElementArray, setNewElementArray] = useState<AutoCompleteValue[]>([
    { value: {} },
  ]);

  // Change
  const [suggestions, setSuggestions] = useState<GroupedAutoComplete[]>([]);
  const [touched, setTouched] = useState<boolean>(false);

  const handleChange = (id: number) => (e: AutoCompleteChangeEvent) => {
    const value =
      typeof e.value === "string" ? { name: e.value, _id: "new" } : e.value;
    setNewElementArray((elements) =>
      elements.map((element, id2) => (id === id2 ? { value } : element))
    );
    setTouched(false);
  };

  // On autocomplete completed
  const onCompleted = async (e: AutoCompleteCompleteEvent) => {
    if (e.query.length < 3) {
      setSuggestions([]);
      return;
    }
    const response = await axiosInstance.get<
      TPaginatedData<AutoCompleteResponse[]>
    >(`/api/companies/client/autocomplete`, {
      params: { limit: 20, type: currentNode.data.type, search: e.query },
    });
    const data = formatToGrouped(response.data.data || [], e.query);
    setSuggestions(data);
  };

  // Format the the autocomplete suggestion into group (bc the query can match with name, desc, keywords...)
  const formatToGrouped = (
    data: AutoCompleteResponse[],
    query: string
  ): GroupedAutoComplete[] => {
    const items: GroupedAutoComplete[] = [];

    // Per name
    const nameItems = data.filter((item) =>
      strongStringCompare(item.name, query)
    );
    nameItems.length && items.push({ label: "Par nom", items: nameItems });

    // Per equivalent
    const equivalentItems = data
      .filter((item) =>
        item.equivalent?.some((eq) => strongStringCompare(eq, query))
      )
      .filter((dat) => !nameItems.some((it) => dat._id === it._id));
    equivalentItems.length &&
      items.push({ label: "Par équivalence", items: equivalentItems });

    // Per related activities
    const relatedActivityItems = data
      .filter((item) => strongStringCompare(item.relatedActivity, query))
      .filter(
        (dat) =>
          ![...nameItems, ...equivalentItems].some((it) => dat._id === it._id)
      );
    relatedActivityItems.length &&
      items.push({
        label: "Par activité en relation",
        items: relatedActivityItems,
      });

    // Per keyword
    const keywordsItems = data
      .filter((item) =>
        item.keywords?.some((keyword) => strongStringCompare(keyword, query))
      )
      .filter(
        (dat) =>
          ![...nameItems, ...equivalentItems, ...relatedActivityItems].some(
            (it) => dat._id === it._id
          )
      );
    keywordsItems.length &&
      items.push({ label: "Par mot clés", items: keywordsItems });

    // Per description
    const descItems = data.filter(
      (dat) =>
        ![
          ...nameItems,
          ...equivalentItems,
          ...relatedActivityItems,
          ...keywordsItems,
        ].some((it) => dat._id === it._id)
    );
    descItems.length && items.push({ label: "Autre", items: descItems });
    return items;
  };

  const OptionGroupTemplate = (item: GroupedAutoComplete) => {
    return <div className="font-semibold">{item.label}</div>;
  };

  const FooterContent = (
    <div className="flex justify-end items-center gap-2">
      <Button
        icon="pi pi-times"
        label="Annuler"
        severity="secondary"
        onClick={props.onHide}
      ></Button>
      <Button
        icon="pi pi-check"
        label="Confirmer"
        onClick={handleConfirm}
      ></Button>
    </div>
  );

  // Add new autocomplete
  const handleAdd = (id: number) => () => {
    setNewElementArray((arr) => arr.toSpliced(id + 1, 0, { value: {} }));
  };

  // Delete autocomplete
  const handleDelete = (id: number) => () =>
    [setNewElementArray((arr) => arr.filter((it, id2) => id !== id2))];

  // Validation
  const validate = (items: AutoCompleteValue[]): PossibleErrors => {
    const errors: string[] = [];

    items.forEach((item, index) => {
      if (!item.value.name || item.value.name.trim() === "") {
        errors.push(`Le champ "name" à l'index ${index} est obligatoire.`);
      }
    });

    return errors.length > 0 ? { errors } : null; // Retourne null si aucune erreur
  };

  // Errors
  const [errors, setErrors] = useState<PossibleErrors>();
  const errorForItem = (index: number): boolean => {
    const _errors = errors?.errors;

    if (!isArray(_errors)) return false;
    const hasError = _errors.find((err) => err.includes(`index ${index}`));
    if (!hasError) return false;
    return touched;
  };

  // Submit
  async function handleConfirm() {
    if (!currentNode) return;
    const _errors = validate(newElementArray);
    setTouched(true);
    if (_errors) {
      setErrors(_errors);
      return;
    }
    setErrors(undefined);
    onAdd?.(
      newElementArray.map((e) => e.value),
      currentNode.data.type
    );
  }

  return (
    <Dialog
      header={`Ajout d'${a} ${name}`}
      style={{ width: "100%", maxWidth: "62.5rem", minHeight: "30vh" }}
      dismissableMask
      blockScroll
      footer={FooterContent}
      {...props}
    >
      <div className="grid grid-cols-12 gap-2">
        {newElementArray.map((element, id, self) => (
          <Fragment key={`frag-${id}`}>
            <div className="col-span-10">
              <AutoComplete
                className="w-full"
                field="name"
                inputClassName="w-full"
                placeholder={`${n} ${name}`}
                value={element.value}
                onChange={handleChange(id)}
                completeMethod={onCompleted}
                suggestions={suggestions}
                optionGroupChildren="items"
                optionGroupLabel="name"
                optionGroupTemplate={OptionGroupTemplate}
                invalid={errorForItem(id)}
              />
              {errorForItem(id) ? (
                <ErrorMessage message="Nom requis"></ErrorMessage>
              ) : (
                <></>
              )}
            </div>
            <div className="col-span-2">
              <div className="flex gap-2">
                <Button
                  icon="pi pi-plus"
                  severity="success"
                  onClick={handleAdd(id)}
                ></Button>
                {self.length > 1 && (
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={handleDelete(id)}
                  ></Button>
                )}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </Dialog>
  );
}

export default ModalAddNewNode;


