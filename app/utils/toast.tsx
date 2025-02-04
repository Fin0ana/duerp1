import { Toast, type ToastMessage } from "primereact/toast";
import { createRef } from "react";
import { dynamicErrorAxios } from "../modules/utils/global";

export const toastRef = createRef<Toast>();

export const showToast = (_options: ToastMessage) => {
  const options: ToastMessage = { ..._options, life: _options.life || 10000 };
  if (toastRef.current) {
    toastRef.current.show(options);
  }
};

export const showErrorToast = (error: unknown) => {
  const options: ToastMessage = {
    severity: "error",
    summary: "Erreur",
    detail: dynamicErrorAxios(error),
    life: 10000,
  };
  if (toastRef.current) {
    toastRef.current.show(options);
  }
};

