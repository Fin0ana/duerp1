import { Button } from "primereact/button";
import { ChangeEvent, DragEvent, useState } from "react";
import { FileToSend, ImgurData } from "../../types";
import { toBase64 } from "../../utils/file";

type FileUploadProps = {
  multiple?: boolean;
  id: string;
  value: ImgurData[] | undefined;
  onChange: (data: FileToSend) => Promise<ImgurData | undefined>;
  collectionName?: string;
};

function FileUpload({
  multiple,
  id,
  value,
  onChange,
  collectionName = "collectionName",
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const handleDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  const handleDrop = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setError(null);

    const file = evt.dataTransfer.files[0]; // Récupère le premier fichier déposé
    setFile(file);
  };
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0]; // Récupère le premier fichier déposé

    setFile(file);
  };

  const setFile = async (file: File | undefined | null) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Fichier invalide, veuillez mettre une image");
      return;
    }

    const base64Image = await toBase64(file);
    const response = await onChange({
      collectionName,
      image: base64Image.split(",")[1],
      name: file.name,
    });
    return response;
  };

  return (
    <div>
      <label htmlFor={id}>
        <input
          multiple={multiple}
          type="file"
          id={id}
          className="hidden"
          onChange={handleChange}
        />
        <SpanButton
          label="Choisir fichier"
          icon="pi pi-cloud-upload"
          className="mb-2"
        ></SpanButton>
      </label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full border-2 rounded-lg border-gray-400 border-dashed min-h-56 flex items-center justify-center gap-3 flex-wrap p-4"
      >
        {value?.length ? (
          value.map((item, index) => (
            <div key={`${id}-${index}`} className="relative">
              <img
                src={item.link}
                alt=""
                className="w-40 h-40 object-cover rounded-md"
              />
              <div className="max-w-40" title={item.name}>
                <div className="truncate">{item.name}</div>
              </div>
              <div className="absolute rounded -top-2 -right-2 bg-red-600 text-white w-7 h-7 flex flex-center cursor-pointer">
                <i className="pi pi-times"></i>
              </div>
            </div>
          ))
        ) : (
          <div className="text-xl text-gray-400">
            Glissez et déposez l'image ici
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;

type SpanButtonProps = { label?: string; icon?: string; className?: string };
function SpanButton({ label = "", icon, className = "" }: SpanButtonProps) {
  return (
    <span
      aria-label={label}
      className={`${className} p-button p-component`}
      data-pc-name="button"
      data-pc-section="root"
    >
      <span
        className={`p-button-icon p-c p-button-icon-left ${icon}`}
        data-pc-section="icon"
      ></span>
      <span className="p-button-label p-c" data-pc-section="label">
        {label}
      </span>
    </span>
  );
}

