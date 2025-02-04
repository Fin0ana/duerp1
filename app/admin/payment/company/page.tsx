'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../utils/axios';
import AdminLayout from '../../../../components/AdminLayout';

const getOneCompanyFromSiren = async (siren: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/api/companies/siren/${siren}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const CompanySearch: React.FC = () => {
  const router = useRouter();
  const [siren, setSiren] = useState<string>('');
  const [companyData, setCompanyData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setCompanyData(null);

    try {
      const data = await getOneCompanyFromSiren(siren);
      setCompanyData(data);
      router.push('/admin/payment/form');
    } catch (err) {
      setError('Failed to fetch company data. Please check the SIREN number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <h2 style={styles.header}>Search Company by SIREN</h2>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={siren}
            onChange={(e) => setSiren(e.target.value)}
            placeholder="Enter SIREN number"
            style={styles.input}
          />
          <button onClick={handleSearch} disabled={loading || !siren} style={styles.button}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {companyData && (
          <div style={styles.companyData}>
            <h3 style={styles.subHeader}>Company Information</h3>
            <pre style={styles.data}>{JSON.stringify(companyData, null, 2)}</pre>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  header: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#005bb5',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    fontSize: '14px',
  },
  companyData: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '5px',
    backgroundColor: '#e0e0e0',
  },
  subHeader: {
    fontSize: '20px',
    color: '#333',
  },
  data: {
    textAlign: 'left',
    fontSize: '14px',
    color: '#333',
  },
};

export default CompanySearch;