import { useCallback, useContext, useEffect, useMemo } from "react";
import { DynamicFormContext } from "../context/DynamicFormContext";
import * as yup from "yup";
import { TDynamicForm } from "../types";
import { KeyString } from "../../utils/types";
import { hasType, oneOf } from "../../utils/global";
import fr from "../utils/fr";

export function useValidation() {
  yup.setLocale(fr);

  // Context
  const { value, errors, touched, setTouched, setErrors } =
    useContext(DynamicFormContext);

  // Validation
  const getObject = useCallback(
    (key: keyof TDynamicForm) =>
      value.reduce((acc, curr) => {
        // // exception for autocomplete value
        // if (key === "value" && curr.type === "autocomplete")
        //   return {
        //     ...acc,
        //     [curr.id]: curr.value.map((r) => r[curr.field || "name"] || r),
        //   };
        if (curr.disabled) return acc;
        return { ...acc, [curr.id]: curr[key] };
      }, {} as KeyString),
    [value]
  );

  useEffect(() => {
    validate();
  }, [value]);

  const convertToYup = (
    validationString:
      | string
      | ((value: TDynamicForm["value"]) => string | false)
  ): yup.ISchema<any> | yup.Reference | undefined => {
    if (typeof validationString !== "string" || !validationString) return;
    const [type, ...methods] = validationString.split("|");
    if (!methods.length) return;
    // Vérification si array
    if (type === "array") {
      const initSchema = yup.array;
      const schema = methods.reduce((acc, item) => {
        const [method, _params] = item.split(":");
        const params = (_params?.split(",") || []).map((e) =>
          isNaN(Number(e)) ? e : Number(e)
        );
        if (!(method in acc)) return acc;
        return (acc = (acc as any)[method](...params));
      }, initSchema());

      return schema;
    }
    const list = ["string", "number"] as const;
    // Vérification si nombre ou chaîn de caractères
    if (!oneOf<(typeof list)[number]>(type, list)) return;
    const initSchema = yup[type];
    const schema = methods.reduce((acc, item) => {
      const [method, _params] = item.split(":");
      const params = (_params?.split(",") || []).map((e) =>
        isNaN(Number(e)) ? e : Number(e)
      );
      if (!(method in acc)) return acc;
      return (acc = (acc as any)[method](...params));
    }, initSchema());

    return schema;
  };

  const ValidationSchema = useMemo(() => {
    const validationList = Object.entries(getObject("validation")).reduce(
      (acc, [key, value]) => {
        return (acc = {
          ...acc,
          [key]: typeof value === "string" ? convertToYup(value) : value,
        });
      },
      {} as yup.ObjectShape
    );
    return yup.object().shape(validationList);
  }, []);

  const validate = async () => {
    try {
      await ValidationSchema.validate(getObject("value"), {
        abortEarly: false,
      });

      setTouched(false);
      setErrors({});
      return true;
    } catch (error: unknown) {
      if (error instanceof yup.ValidationError) {
        const _errors = error.inner.reduce(
          (acc, el) => ({
            ...acc,
            [el.path || ""]: el.message,
          }),
          {} as KeyString
        );
        setErrors(_errors);
        return false;
      }
      throw error;
    }
  };

  // Convert a yup schema to a string stockable in DB
  // const convertToString = (validationSchema: TDynamicForm["validation"]) => {
  //   if (!validationSchema || typeof validationSchema === "string") return;
  //   const described = validationSchema.describe();

  //   if (!described || !hasType<yup.SchemaDescription>(described, ["tests"]))
  //     return "";

  //   const { tests, type } = described;

  //   if (type === "mixed") return convertMixedToString(described);

  //   const stringTests = tests
  //     .map((test) => {
  //       let name = test.name;
  //       if (test.params) {
  //         const params = Object.entries(test.params)
  //           .filter(([key]) => key !== "regex")
  //           .map(([key, val]) => `${val}`)
  //           .join(",");
  //         name = params ? `${name}:${params}` : name;
  //       }
  //       return name;
  //     })
  //     .join("|");
  //   return stringTests ? `${type}|${stringTests}` : type;
  // };

  const convertMixedToString = ({
    type,
    notOneOf,
    oneOf,
  }: yup.SchemaDescription) => {
    let inclusionState = [];
    if (notOneOf.length) inclusionState.push(`notOneOf:${notOneOf.join(",")}`);
    if (oneOf.length) inclusionState.push(`oneOf:${oneOf.join(",")}`);
    return [type, ...inclusionState].join("|");
  };

  // Errors
  const errorsTouched = useCallback(
    (item: TDynamicForm) => touched && errors[item.id],
    [touched, errors]
  );

  return { getObject, validate, errorsTouched };
}


