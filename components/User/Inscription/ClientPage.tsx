"use client";

import DynamicForm from "@/app/modules/dynamicForm/components/DynamicForm";
import { FormResult, TDynamicForm } from "@/app/modules/dynamicForm/types";
import { dynamicErrorAxios } from "@/app/modules/utils/global";
import useAuthStore from "@/app/store/auth/AuthStore";
import { showToast } from "@/app/utils/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useState } from "react";
import { useDebounce } from "react-use";
import { ref, string } from "yup";

type SignupClientPageProps = {
  invitation?: InvitationGet;
  errorMessage?: string;
};
const SignupClientPage = ({
  invitation,
  errorMessage,
}: SignupClientPageProps) => {
  const { pending, register } = useAuthStore();
  const router = useRouter();
  const [registerForm, setRegisterForm] = useState<TDynamicForm[]>([
    {
      type: "input",
      id: "firstName",
      label: "Prénom(s)",
      value: "",
    },
    {
      type: "input",
      id: "name",
      label: "Nom",
      value: "",
      validation: "string|required",
    },
    {
      type: "input",
      id: "username",
      label: "Pseudo",
      value: "",
      validation: "string|required",
    },
    {
      type: "input",
      id: "email",
      label: "Email",
      value: "",
      validation: "string|required|email",
    },
    {
      type: "input",
      id: "address",
      label: "Adresse",
      value: "",
    },
    {
      type: "input",
      id: "phone",
      label: "Téléphone",
      value: "",
    },
    {
      type: "password",
      id: "password",
      label: "Mot de passe",
      value: "",
      validation: string()
        .test(
          "no-special-chars",
          "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*).",
          (value) => {
            if (!value) return;
            return /[!@#$%^&*]/.test(value);
          }
        )
        .test(
          "no-number",
          "Le mot de passe doit contenir au moins un chiffre.",
          (value) => {
            if (!value) return;
            return /[0-9]/.test(value);
          }
        )
        .test(
          "too-short",
          "Le mot de passe doit comporter au moins 9 caractères.",
          (value) => {
            if (!value) return;
            return value.length >= 9;
          }
        )
        .required(),
    },
    {
      type: "password",
      id: "confirmPassword",
      label: "Confirmation mot de passe",
      value: "",
      validation: string()
        .oneOf([ref("password")], "Doit être identique au mot de passe")
        .required(),
    },
  ]);
  const handleSubmit = async (value: FormResult) => {
    try {
      const data: RegisterParams = {
        email: invitation?.token ? undefined : value.email,
        firstName: value.firstName,
        name: value.name,
        password: value.password,
        username: value.username,
        address: value.address,
        phone: value.phone,
        inviteToken: invitation?.token,
      };
      await register(data);
      router.push("/admin");
    } catch (error) {
      console.log(error);

      showToast({
        severity: "error",
        summary: "Erreur",
        detail: dynamicErrorAxios(error),
      });
    }
  };
  // Error
  useDebounce(
    () => {
      if (errorMessage)
        showToast({
          severity: "error",
          summary: "Erreur",
          detail: errorMessage,
        });
    },
    500,
    []
  );

  return (
    <div className="flex w-full justify-center items-center min-h-screen bg-gray-100 pt-[5rem]">
      <div className="max-w-[50rem] w-full card m-5">
        <h1 className="text-center text-2xl font-semibold my-4">
          Inscription à DUERP en ligne
        </h1>
        {invitation?.text ? (
          <div className="text-xl my-2 text-center font-semibold">
            {invitation?.text}
          </div>
        ) : (
          <></>
        )}
        <DynamicForm
          id="register-form"
          value={registerForm}
          setValue={setRegisterForm}
          onSubmit={handleSubmit}
          submitLoading={pending}
          submitTemplate={() => (
            <div className="flex w-full">
              <Button
                label="S'inscrire"
                type="submit"
                className="w-full"
                loading={pending}
              ></Button>
            </div>
          )}
        ></DynamicForm>
        <div className="flex gap-1 justify-center mt-2">
          <span>Vous avez déjà un compte ?</span>
          <Link href={"/user/connexion"}>
            <span className="text-primary-500 underline">Se connecter</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupClientPage;
