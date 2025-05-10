import { useEffect } from "react";

export function useAssignIdToMultiStateCheckboxes(...deps: any[]) {
  useEffect(() => {
    const falseChecks = document.querySelectorAll(".p-checkbox.p-component");
    falseChecks.forEach((falseCheck) => {
      const checks = falseCheck?.querySelector("input[type='checkbox']");
      const falseCheckId = falseCheck?.getAttribute("id");
      if (!checks || !falseCheck || !falseCheckId) return;
      checks.setAttribute("id", falseCheckId);
      falseCheck.setAttribute("id", "");
    });
  }, deps);
}
