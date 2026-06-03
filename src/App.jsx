import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Leads from "./pages/Leads";
import LeadDetails from "./pages/LeadDetails";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import CreateLead from "./pages/CreateLead.jsx";
import EditLead from "./pages/EditLead.jsx";
function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,

          style: {
            background: "#48484e",
            color: "#fff",
            border: "1px solid #27272a",
            padding: "18px 24px",
            fontSize: "16px",
            borderRadius: "16px",
            minWidth: "400px",
            minHeight: "75px",
          },

          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <div className="flex min-h-screen bg-zinc-950 items-start">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/create" element={<CreateLead />} />
            <Route path="/leads/edit/:id" element={<EditLead />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
