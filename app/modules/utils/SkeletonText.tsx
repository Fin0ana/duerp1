import React, { ReactNode } from "react";
import "@/app/styles/components/_surfaces.scss"; // Import your SCSS file
interface LoadingIndicatorProps {
  children?: ReactNode;
}
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ children }) => {
  return <div className="is-loading w-100">{children}</div>;
};

export default LoadingIndicator;


