import { _clientApi } from "@/app/_endpoints";
import InputSearch from "@/app/components/common/form/InputSearch";
import DynamicFormCore from "@/app/modules/dynamicForm/components/bases/DynamicFormCore";
import { TDynamicForm } from "@/app/modules/dynamicForm/types.d";
import axiosInstance from "@/app/utils/axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ChangeEvent, FormEvent, MouseEvent, useMemo, useState } from "react";

type OtherPostsTemplateProps = {
  item: TDynamicForm;
  setItem: (item: TDynamicForm) => void;
};

function OtherPostsTemplate({ item, setItem }: OtherPostsTemplateProps) {
  const [search, setSearch] = useState<string>("");
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const [posts, setPosts] = useState<PostGet[]>([]);

  const field = useMemo<TDynamicForm>(
    () => ({
      type: "checkbox",
      id: "other-check-field",
      label: "",
      selectOptions: posts,
      selectLabel: "name",
      selectValue: "_id",
      value: item.value,
      alignement: "horizontal",
    }),
    [item.value, posts]
  );

  const handleChangeFormCore = (value: any) => {
    setItem({ ...item, value });
  };

  const handleSearch = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await axiosInstance.get(_clientApi.step14, {
      params: { search, limit: 50 },
    });
    if (!result.data) return;
    setPosts(result.data.data);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <InputText
          value={search}
          onChange={handleChangeSearch}
          placeholder="Rechercher..."
        ></InputText>
        <Button
          type="button"
          icon="pi pi-search"
          size="small"
          onClick={handleSearch}
        />
      </div>
      <DynamicFormCore
        id={"other-template"}
        item={field}
        onChange={handleChangeFormCore}
      />
    </>
  );
}

export default OtherPostsTemplate;



