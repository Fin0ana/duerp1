"use client"

import React, { useEffect, useState } from 'react'
import PostWithStreaming from '../../../../components/PostChosing/PostWithStreaming'
import axiosInstance from '../../payment/utils/axios';

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
    <div>
      { company ? <PostWithStreaming company={company} /> : <></>}
    </div>
  );
}

export default page;