"use client"; // Utilisation des hooks React

import { useState } from "react";
import { useRouter } from "next/navigation";
//import Navbar from '../components/Navbar';
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { dynamicErrorAxios } from "@/app/modules/utils/global";
import useAuthStore from "@/app/store/auth/AuthStore";

const ConnexionPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { login, pending } = useAuthStore();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const flexibleConnection = username.includes("@")
        ? { email: username }
        : { username };

      await login({ ...flexibleConnection, password });
      router.push("/admin");
    } catch (error) {
      setError(dynamicErrorAxios(error));
    }
  };

  return (
    <div className="bg-gray-100 flex h-full min-h-screen items-center justify-center  pt-[5rem]">
      <Navbar />
      <div className="card max-w-[35rem] w-full">
        <form onSubmit={handleLogin}>
          <h1 className="text-center text-2xl font-semibold my-4">
            Connexion à DUERP en ligne
          </h1>
          <div className="space-y-4 mb-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="label">
                Nom d'utilisateur ou email
              </label>
              <InputText
                value={username}
                id="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="label">
                Mot de passe
              </label>
              <Password
                value={password}
                inputId="password"
                onChange={(e) => setPassword(e.target.value)}
                toggleMask={true}
                feedback={false}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mb-4">
            <div className="flex gap-1 items-center">
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.checked || false)}
                defaultChecked={undefined}
                inputId="remember-me"
              ></Checkbox>
              <label htmlFor="remember-me">Se souvenir de moi ?</label>
            </div>
            <div className="text-primary-500 underline">
              <Link href={"/auth/forgot-password"}>Mot de passe oublié ?</Link>
            </div>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="w-full pt-3">
            <Button
              type="submit"
              label="Se connecter"
              className="w-full"
              loading={pending}
            ></Button>
          </div>
        </form>
        <div className="flex gap-1 justify-center mt-2">
          <span>Vous n'avez pas encore de compte ?</span>
          <Link href={"/user/inscription"}>
            <span className="text-primary-500 underline">S'inscrire</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConnexionPage;
