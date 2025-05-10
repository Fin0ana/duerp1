import { ErrorType } from "../../types";

function ErrorMessage({ message }: { message?: ErrorType }) {
  if (!message) return <></>;
  return (
    <span className="text-xs text-red-600">
      {typeof message === "string" ? message : JSON.stringify(message)}
    </span>
  );
}

export default ErrorMessage;


