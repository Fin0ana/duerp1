"use client";

import React, { useEffect, useState } from "react";
import PostWithStreaming from "@/components/PostsChoosing/PostWithStreaming";
import axiosInstance from "../../payment/utils/axios";
import AdminLayout from "@/components/AdminLayout";
import { AxiosError } from "axios";
import { showErrorToast } from "@/app/utils/toast";
import { Skeleton } from "primereact/skeleton";
import { WorkPercentProvider } from "@/app/store/work/workPercent";
import ExpiracyPopup from "@/components/PostsChoosing/ExpiracyPopup";
import ClientOnly from "@/components/shared/miscs/ClientOnly";

interface Domain {
  name: string;
}

function page() {
  const [company, setCompany] = useState<CompanyGet | undefined>(undefined);
  const [domain, setDomain] = useState<Domain | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  const getData = async () => {
    try {
      setMessage(undefined);
      setLoading(true);
      const [_company, _domain] = await Promise.all([
        axiosInstance.get<CompanyGet>("/api/companies/client/own"),
        axiosInstance.get<Domain>("/api/companies/client/domain"),
      ]);

      setCompany({ ..._company.data, domainName: _domain.data.name });
      setDomain(_domain.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        setMessage("Vous n'avez pas de société en ce moment");
        return;
      }
      showErrorToast(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AdminLayout>
      <WorkPercentProvider>
        <div className="w-full mx-auto bg-white p-8 shadow-lg rounded-lg">
          {loading ? (
            Array.from({ length: 5 }, (_, k) => (
              <Skeleton
                key={`skel-${k}`}
                width="100%"
                height="150px"
              ></Skeleton>
            ))
          ) : company ? (
            <PostWithStreaming company={company} />
          ) : message ? (
            <>{message}</>
          ) : (
            <></>
          )}
          {company ? <ExpiracyPopup company={company}></ExpiracyPopup> : <></>}
        </div>
      </WorkPercentProvider>
    </AdminLayout>
  );
}

export default page;
