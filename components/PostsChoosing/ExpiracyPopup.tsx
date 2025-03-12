"use client";

import Link from "next/link";
import React from "react";
import { Portal } from "react-portal";

type ExpiracyPopupProps = { company: CompanyGet };
const ExpiracyPopup = ({ company }: ExpiracyPopupProps) => {
  return (
    <div>
      {company.status === "expired" ? (
        <Portal node={document.body}>
          <div className="fixed left-0 bottom-10 px-2 flex justify-center items-center z-[7777777] w-full">
            <Link
              href={"/simulation/renew/checkout-page"}
              className="bg-orange-500/20 border-l-4 border-orange-500 text-orange-500 px-4 py-5 flex flex-col items-center w-full max-w-md"
            >
              <div className="text-center">
                Votre abonnement a pris fin. Renouvelez-le dès maintenant pour
                continuer à en profiter !
              </div>
              <div className="underline">Se réabonner</div>
            </Link>
          </div>
        </Portal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ExpiracyPopup;
