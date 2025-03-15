// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axiosInstance from '@/app/admin/payment/utils/axios';
// import Navbar from '@/components/Navbar';

// const getOneCompanyFromSiren = async (siren: string): Promise<any> => {
//   try {
//     const response = await axiosInstance.get(`/api/companies/siren/${siren}`);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// const CompanySearch: React.FC = () => {
//   const router = useRouter();
//   const [siren, setSiren] = useState<string>('');
//   const [companyData, setCompanyData] = useState<any | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSearch = async () => {
//     setLoading(true);
//     setError(null);
//     setCompanyData(null);

//     try {
//       const data = await getOneCompanyFromSiren(siren);
//       setCompanyData(data);
//       router.push('/admin/payment/form');
//     } catch (err) {
//       setError('Failed to fetch company data. Please check the SIREN number.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//     <Navbar />
//       <div style={styles.container}>
//         <h2 style={styles.header}>Search Company by SIREN</h2>
//         <div style={styles.inputContainer}>
//           <input
//             type="text"
//             value={siren}
//             onChange={(e) => setSiren(e.target.value)}
//             placeholder="Enter SIREN number"
//             style={styles.input}
//           />
//           <button onClick={handleSearch} disabled={loading || !siren} style={styles.button}>
//             {loading ? 'Loading...' : 'Search'}
//           </button>
//         </div>
//         {error && <p style={styles.error}>{error}</p>}
//         {companyData && (
//           <div style={styles.companyData}>
//             <h3 style={styles.subHeader}>Company Information</h3>
//             <pre style={styles.data}>{JSON.stringify(companyData, null, 2)}</pre>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     maxWidth: '500px',
//     margin: '0 auto',
//     padding: '20px',
//     borderRadius: '8px',
//     backgroundColor: '#f5f5f5',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     textAlign: 'center',
//   },
//   header: {
//     fontSize: '24px',
//     color: '#333',
//     marginBottom: '20px',
//   },
//   inputContainer: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//   },
//   input: {
//     flex: 1,
//     padding: '10px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//     fontSize: '16px',
//   },
//   button: {
//     padding: '10px 20px',
//     borderRadius: '5px',
//     backgroundColor: '#0070f3',
//     color: '#fff',
//     border: 'none',
//     fontSize: '16px',
//     cursor: 'pointer',
//     transition: 'background-color 0.3s ease',
//   },
//   buttonHover: {
//     backgroundColor: '#005bb5',
//   },
//   error: {
//     color: 'red',
//     marginTop: '10px',
//     fontSize: '14px',
//   },
//   companyData: {
//     marginTop: '20px',
//     padding: '15px',
//     borderRadius: '5px',
//     backgroundColor: '#e0e0e0',
//   },
//   subHeader: {
//     fontSize: '20px',
//     color: '#333',
//   },
//   data: {
//     textAlign: 'left',
//     fontSize: '14px',
//     color: '#333',
//   },
// };

// export default CompanySearch;



'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/app/admin/payment/utils/axios';
import Navbar from '@/components/Navbar';

const getOneCompanyFromSiren = async (siren) => {
  try {
    const response = await axiosInstance.get(`/api/companies/siren/${siren}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const CompanySearch = () => {
  const router = useRouter();
  const [siren, setSiren] = useState('');
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const companyTypes = ['PME', 'GE', 'Startup', 'ETI'];

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
    <>
      <Navbar />
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <h2 style={styles.header}>Sélectionnez un type d'entreprise</h2>
          <div style={styles.typesContainer}>
            {companyTypes.map((type) => (
              <button
                key={type}
                style={styles.typeButton}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {selectedType && (
            <div style={styles.searchContainer}>
              <h3 style={styles.subHeader}>Rechercher une entreprise par SIREN</h3>
              <div style={styles.inputContainer}>
                <input
                  type="text"
                  value={siren}
                  onChange={(e) => setSiren(e.target.value)}
                  placeholder="Entrer le numéro SIREN"
                  style={styles.input}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading || !siren}
                  style={styles.button}
                >
                  {loading ? 'Chargement...' : 'Rechercher'}
                </button>
              </div>
              {error && <p style={styles.error}>{error}</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  container: {
    maxWidth: '600px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '24px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  typesContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  typeButton: {
    padding: '10px 15px',
    borderRadius: '5px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  searchContainer: {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  subHeader: {
    fontSize: '20px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  input: {
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
  },
  error: {
    color: 'red',
    marginTop: '10px',
    fontSize: '14px',
    textAlign: 'center',
  },
};

export default CompanySearch;
