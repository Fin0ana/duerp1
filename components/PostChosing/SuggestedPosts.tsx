"use client";

import DynamicForm from "@/app/modules/dynamicForm/components/DynamicForm";
import { FormResult, TDynamicForm } from "@/app/modules/dynamicForm/types.d";
import { useMemo, useState } from "react";
import OtherPostsTemplate from "./OtherPostsTemplate";
import axiosInstance from "@/app/admin/payment/utils/axios";
import { _clientApi } from "@/app/_endpoints";
import { dynamicError } from "@/app/modules/utils/global";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { showToast } from "@/app/utils/toast";

type SuggestedPostsProps = { domain: DomainForClient; company: CompanyGet };
function SuggestedPosts({ domain, company }: SuggestedPostsProps) {
  const router = useRouter();
  const suggestedPosts = useMemo(
    () => domain.suggestedPosts || [],
    [domain.suggestedPosts]
  );
  const [form, setForm] = useState<TDynamicForm[]>([
    {
      id: "suggested-posts",
      label: suggestedPosts.length ? "Suggestions" : "Aucune suggestion",
      type: "checkbox",
      selectOptions: suggestedPosts,
      selectLabel: "name",
      selectValue: "_id",
      value: company?.postIds || [],
      alignement: "horizontal",
      containerClass: "col-span-12",
      optionTitle: (option) =>
        typeof option === "object" ? option.equivalent?.join(", ") : "",
    },
    // {
    //   id: "other-posts",
    //   label: suggestedPosts.length ? "Autres postes" : "Choix postes",
    //   type: "template",
    //   value: company?.postIds || [],
    //   template: OtherPostsTemplate,
    //   containerClass: "col-span-12",
    // },
  ]);

  const [load, setLoad] = useState(false);
  const handleSubmit = async (result: FormResult) => {
    try {
      setLoad(true);
      const postIds = Array.from(new Set([...result["suggested-posts"]]));
      const response = await axiosInstance.put(_clientApi.step15, {
        posts: postIds,
      });
      setLoad(false);
      showToast({
        summary: "Succès",
        detail: "Poste assignés avec succès",
        severity: "success",
      });
      router.push("/simulation/generation/works-selection");
    } catch (error) {
      setLoad(false);
      showToast({
        summary: "Erreur",
        detail: dynamicError(error),
        severity: "error",
      });
    }
  };

  const handleNext = () => {
    router.push("/simulation/generation/works-selection");
  };

  return (
    <div className="card">
      <h1 className="text-2xl mb-3">
        Choix de postes pour domaine : {domain.name}
      </h1>
      <DynamicForm
        id="post-selection"
        value={form}
        setValue={setForm}
        onSubmit={handleSubmit}
        submitTemplate={({ pending }) => {
          return (
            <div className="flex gap-3 justify-end">
              <Button
                label="Enregister et continuer"
                type="submit"
                icon="pi pi-save"
                loading={pending}
              ></Button>
              <Button
                label="Suivant"
                type="button"
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={handleNext}
              ></Button>
            </div>
          );
        }}
      />
      {/* {JSON.stringify(form[1], null, 2)} */}
    </div>
  );
}

export default SuggestedPosts;
