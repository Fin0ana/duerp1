import { Dialog } from "primereact/dialog";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { DynamicFormProps, FormResult } from "../../dynamicForm/types.d";
import DynamicForm from "../../dynamicForm/components/DynamicForm";

type DynamicModalProp = DynamicFormProps & {
  headerText?: string;
  cancelIcon?: string;
  cancelLabel?: string;
  openState?: boolean;
  setOpenState?: Dispatch<SetStateAction<boolean>>;
  style?: CSSProperties;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
  blockScroll?: boolean
};

export type DynamicModalMethods = {
  open: () => Promise<unknown>;
  close: () => void;
};

const DynamicModal = forwardRef<DynamicModalMethods, DynamicModalProp>(
  (
    {
      headerText,
      cancelIcon,
      cancelLabel,
      onSubmit,
      openState,
      setOpenState,
      style,
      className,
      onOpen,
      onClose,
      blockScroll,
      ...dynamicFormProps
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const promiseRef = useRef<{
      resolve: (...args: any[]) => any;
      reject: (...args: any[]) => any;
    }>();

    const handleConfirm = async (value: FormResult) => {
      promiseRef.current?.resolve(value);
      onSubmit?.(value);
      setConfirmed(true);
    };

    const open = () => {
      setVisible(true);
      onOpen?.();
      return new Promise((resolve, reject) => {
        promiseRef.current = { resolve, reject };
      });
    };

    const close = () => {
      setVisible(false);
      onClose?.();
      if (confirmed) {
        setConfirmed(false);
        return;
      }
      setConfirmed(false);
      promiseRef.current?.reject("closed");
    };

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    useEffect(() => {}, [openState]);

    return (
      <Dialog
        visible={visible}
        onHide={close}
        header={headerText || ""}
        style={style || { minWidth: "25rem", maxWidth: "57rem" }}
        className={className || "w-full"}
        blockScroll={blockScroll}
      >
        <DynamicForm
          {...dynamicFormProps}
          onSubmit={handleConfirm}
        ></DynamicForm>
      </Dialog>
    );
  }
);

export default DynamicModal;



