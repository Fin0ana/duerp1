"use client";

import React, { ChangeEvent, useState, useMemo } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axiosInstance from "../utils/axios";
import { StripeCardNumberElementOptions, StripeError } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useCookie } from "react-use";
import Link from "next/link";
import { classNames } from "primereact/utils";
import { showErrorToast } from "@/app/utils/toast";

interface BillingDetails {
  name: string;
}

export default function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<StripeError | undefined>();
  const [processing, setProcessing] = useState<boolean>(false);
  const [cardComplete, setCardComplete] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: "",
  });

  const [_value, _, deleteCookie] = useCookie("pricingChoice");

  const selectedPricing = useMemo<PricingGet | undefined>(() => {
    try {
      if (!_value) return;
      const __value = JSON.parse(_value);
      return __value;
    } catch (error) {
      return;
    }
  }, [_value]);

  const handleChangeBillingDetails = (e: ChangeEvent<HTMLInputElement>) => {
    setBillingDetails((v) => ({ ...v, name: e.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!selectedPricing) return;
      const paymentIntent = await handleCreatePaymentIntent();
      if (!paymentIntent) return;
      await handleEnableCompanyCreator(paymentIntent.id);
      deleteCookie();
      router.push("/admin/payment/company");
    } catch (error) {
      showErrorToast(error)
    }
  };

  const baseUrl = " https://back-duerp.vercel.app";

  const handleCreatePaymentIntent = async () => {
    try {
      setProcessing(true);

      const res = await axiosInstance.post("/api/client/new-payment-intent", {
        _id: selectedPricing?._id,
      });
      const { clientSecret } = await res.data;

      if (!stripe || !elements) return;

      const cardNumberElement = elements.getElement(CardNumberElement)!;
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
        },
      });

      if (stripeError) {
        setError(stripeError);
        setProcessing(false);
        return;
      }
      if (paymentIntent?.status !== "succeeded") {
        setError({
          type: "invalid_request_error",
          message: "Payment not succeed",
        });
        return;
      }
      setSuccess(true);
      setProcessing(false);
      return paymentIntent;
    } catch (error) {
      setError(error as StripeError);
      setProcessing(false);
      throw error;
    }
  };

  const handleEnableCompanyCreator = async (stripeIntentId: string) => {
    await axiosInstance.get(`/api/client/enable-user/${stripeIntentId}`);
  };

  return (
    <>
      {selectedPricing ? (
        <p className="flex justify-center">
          <span>
            Paiement pour le forfait <span className="font-bold">{selectedPricing?.type || "Non choisi"}</span>{" "}
            pour :{" "}
          </span>
          &nbsp;
          <span className="font-bold">{((selectedPricing?.price || 0) * 0.01)}</span>
        </p>
        ) : (
        <div className="py-3 flex items-center justify-center">
          <Link
            href={"/user/tarif"}
            className="text-red-500 bg-red-50 p-3 rounded-sm"
          >
            Veuillez choisir un tarif pour votre société. <span className="underline">Choisir</span>
          </Link>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="mb-3">
            <label className="font-bold text-sm mb-2 ml-1">
              Nom sur la carte
            </label>
            <div>
              <input
                className="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="John Smith"
                type="text"
                name="name"
                value={billingDetails.name}
                onChange={handleChangeBillingDetails}
                required
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <div className="mb-3">
            <label className="font-bold text-sm mb-2 ml-1">N° de Carte</label>
            <CardWrapper>
              <CardNumberElement
                options={CARD_OPTIONS}
                onChange={(e) => {
                  setError(e.error);
                  setCardComplete(e.complete);
                }}
              />
            </CardWrapper>
          </div>
        </fieldset>
        <fieldset className="grid grid-cols-2 gap-2">
          <div className="mb-3">
            <label className="font-bold text-sm mb-2 ml-1">Expiration</label>
            <CardWrapper>
              <CardExpiryElement
                options={CARD_OPTIONS}
                onChange={(e) => {
                  setError(e.error);
                  setCardComplete(e.complete);
                }}
              />
            </CardWrapper>
          </div>
          <div className="mb-3">
            <label className="font-bold text-sm mb-2 ml-1">CVC</label>
            <CardWrapper>
              <CardCvcElement
                options={CARD_OPTIONS}
                onChange={(e) => {
                  setError(e.error);
                  setCardComplete(e.complete);
                }}
              />
            </CardWrapper>
          </div>
        </fieldset>

        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        <fieldset>
          <button
            disabled={!selectedPricing}
            className={classNames(
              "block w-full max-w-xs mx-auto disabled:bg-gray-200 disabled:text-gray-600",
              "text-white rounded-lg px-3 py-3 font-semibold focus:outline-none my-3",
              processing
                ? "bg-indigo-300 hover:bg-indigo-400"
                : "bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700"
            )}
          >
            Payer maintenant
          </button>
        </fieldset>
      </form>
    </>
  );
}

const CARD_OPTIONS: StripeCardNumberElementOptions = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#374151",
      color: "#111827",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",

      ":-webkit-autofill": {
        color: "#fce883",
      },
      "::placeholder": {
        color: "#ddd",
      },
    },
    invalid: {
      iconColor: "#B91C1C",
      color: "#B91C1C",
    },
  },
};

const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full p-3 mb-1 border-2 border-gray-200 rounded-md focus-within:border-indigo-500 transition-colors">
      {children}
    </div>
  );
};

const ErrorMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex justify-center text-red-500 py-2 w-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
    {children}
  </div>
);