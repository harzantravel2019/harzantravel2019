import { useState } from "react";
import AppSidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import ClientsPage from "@/components/ClientsPage";
import DebtsPage from "@/components/DebtsPage";
import PaymentsPage from "@/components/PaymentsPage";
import InvoicesPage from "@/components/InvoicesPage";

const Index = () => {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar active={page} onNavigate={setPage} />
      <main className="flex-1 p-8 lg:p-10 overflow-auto max-w-[1200px]">
        {page === "dashboard" && <Dashboard />}
        {page === "clients" && <ClientsPage />}
        {page === "debts" && <DebtsPage />}
        {page === "payments" && <PaymentsPage />}
        {page === "invoices" && <InvoicesPage />}
      </main>
    </div>
  );
};

export default Index;
