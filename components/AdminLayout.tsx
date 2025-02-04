'use client'
import AdminSidebar from '../components/Adminsidebar'

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex">
      {/* Sidebar fixe */}
      <AdminSidebar />
      
      {/* Contenu de la page qui changera */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}