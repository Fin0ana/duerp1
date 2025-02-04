import { ErrorType } from "../../types";

function ErrorMessage({ message }: { message?: ErrorType }) {
  if (!message) return <></>;
  return (
    <span className="error-message">
      {typeof message === "string" ? message : JSON.stringify(message)}
    </span>
  );
}

export default ErrorMessage;


