import Navbar from "../../../components/Navbar";
import { dynamicErrorAxios } from "@/app/modules/utils/global";
import { AxiosError } from "axios";
import _api from "@/app/_endpoints";
import SignupClientPage from "@/components/User/Inscription/ClientPage";
import axiosGet from "@/app/actions/axiosGet";

async function InscriptionPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  let invitation: InvitationGet | undefined;
  let errorMessage: string | undefined;
  try {
    const token = (await searchParams)?.token;
    if (token) {
      invitation = await axiosGet<InvitationGet>(
        _api.invitation.getFromToken(token)
      );
    }
  } catch (error) {
    if (error instanceof AxiosError && error.status === 400) {
      errorMessage = dynamicErrorAxios(error);
    }
    console.log(error);
  }
  return (
    <div className="bg-gray-100 flex h-full min-h-screen items-center justify-center">
      <Navbar />
      <SignupClientPage invitation={invitation} errorMessage={errorMessage} />
    </div>
  );
}

export default InscriptionPage;
