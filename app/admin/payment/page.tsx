"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import CheckoutForm from "./checkout/page";
import AdminLayout from '../../../components/AdminLayout';

const stripePromise = loadStripe("pk_test_51JHvJfEh07vZHaVTCODAHx6mmLSxWexT2UY5TfTfA1MsE3tIY5MzqWdqTgwhm4sW7hOrIxfnD0W2wWCkzMGIoU7D007BlxmYxF");

function CheckoutPage(): JSX.Element {
  const router = useRouter();

  return (
    <>
      <div>
        <AdminLayout>
          <div className="min-w-screen min-h-screen bg-gray-200 flex items-center justify-center px-5 pb-10 pt-16">
            <div className="w-[30rem] mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700">
              <span
                className="text-3xl font-bold text-blue-800 cursor-pointer"
                onClick={() => router.back()}
              >
                &#8672;
              </span>

              <div className="w-full pt-1 pb-5">
                {/* <div className="bg-blue-800 text-white overflow-hidden rounded-full w-20 h-20 -mt-24 mx-auto shadow-lg flex justify-center items-center">
                  <IconMingCute className="mgc_bank_card_fill text-4xl"></IconMingCute>
                </div> */}
              </div>
              <div className="mb-10">
                <h1 className="text-center font-bold text-xl uppercase">
                  Info sur la sécurité de paiement
                </h1>
              </div>
              <div className="mb-3 flex justify-center">
                <div className="px-2">
                  <label className="">
                    <img
                      src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
                      className="h-8"
                    />
                  </label>
                </div>
              </div>
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </div>
          </div>
        </AdminLayout>
      </div>
    </>
  );
}

export default CheckoutPage;