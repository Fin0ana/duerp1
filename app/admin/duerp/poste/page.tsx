"use client";

import React, { useEffect, useState } from "react";
import PostWithStreaming from "../../../../components/PostChosing/PostWithStreaming";
import axiosInstance from "../../payment/utils/axios";
import AdminLayout from "@/components/AdminLayout";

interface Company {
  // Define the properties of the Company object here
  domainName?: string;
}

interface Domain {
  name: string;
}

function page() {
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [domain, setDomain] = useState<Domain | undefined>(undefined);

  const getData = async () => {
    const [_company, _domain] = await Promise.all([
      axiosInstance.get<Company>("/api/companies/client/own"),
      axiosInstance.get<Domain>("/api/companies/client/domain"),
    ]);

    setCompany({ ..._company.data, domainName: _domain.data.name });
    setDomain(_domain.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        {company ? <PostWithStreaming company={company} /> : <></>}
      </div>
    </AdminLayout>
  );
}

export default page;
