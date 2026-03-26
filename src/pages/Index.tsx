import { useState } from "react";
import AppSidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import ClientsPage from "@/components/ClientsPage";
import InvoicesPage from "@/components/InvoicesPage";

const Index = () => {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="flex min-h-screen">
      <AppSidebar active={page} onNavigate={setPage} />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {page === 'dashboard' && <Dashboard />}
        {page === 'clients' && <ClientsPage />}
        {page === 'invoices' && <InvoicesPage />}
      </main>
    </div>
  );
};

export default Index;
