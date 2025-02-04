import AdminSidebar from '@/components/Adminsidebar';

const AdminPage: React.FC = () => {
  return (
    <div>
      {/* Navbar pour l'administrateur */}
      <AdminSidebar />

      {/* Contenu principal de la page administrateur */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Bienvenue dans la partie Administrateur</h1>
        <p>Ceci est la page principale réservée aux administrateurs. Ici, vous pouvez gérer les postes et les domaines.</p>
      </div>
    </div>
  );
};

export default AdminPage;