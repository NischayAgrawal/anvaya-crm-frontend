import LeadTable from "../components/LeadTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeads, deleteLead } from "../api/leadApi";
import { getAgents } from "../api/agentApi";
import Skeleton from "../components/Skeleton";

import toast from "react-hot-toast";

const LeadsSkeleton = () => (
  <div className="min-h-screen bg-zinc-950 p-4 md:p-6">
    {/* Header */}
    <div className="flex items-center justify-between gap-4 mb-6">
      <Skeleton className="h-9 w-32 ml-10 md:ml-0" />
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>

    {/* Filters */}
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
    </div>

    {/* Table */}
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Table header */}
      <div className="bg-zinc-800 px-6 py-4 grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
      {/* Table rows */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="px-6 py-4 border-t border-zinc-800 grid grid-cols-4 gap-4 items-center"
        >
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </div>
);

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [salesAgentFilter, setSalesAgentFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads({
          status: statusFilter,
          priority: priorityFilter,
          source: sourceFilter,
          salesAgent: salesAgentFilter,
          sortBy,
        });
        setLeads(data);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => setLoading(false), 750);
      }
    };
    fetchLeads();
  }, [statusFilter, priorityFilter, sourceFilter, salesAgentFilter, sortBy]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAgents();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?",
    );
    if (!confirmed) return;
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead._id !== id));
      toast.success("Lead deleted successfully");
    } catch (error) {
      toast.error("Failed to delete lead");
      console.log(error);
    }
  };

  if (loading) return <LeadsSkeleton />;

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-6 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold pl-10 md:pl-0">Leads</h1>
        <button
          onClick={() => navigate("/leads/create")}
          className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600"
        >
          + Create Lead
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-200 outline-none focus:border-emerald-500 text-sm"
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Priority
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="appearance-none rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-200 outline-none focus:border-emerald-500 text-sm"
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Source
          </label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="appearance-none rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-200 outline-none focus:border-emerald-500 text-sm"
          >
            <option value="">All</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Advertisement">Advertisement</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Sales Agent
          </label>
          <select
            value={salesAgentFilter}
            onChange={(e) => setSalesAgentFilter(e.target.value)}
            className="appearance-none rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-200 outline-none focus:border-emerald-500 text-sm"
          >
            <option value="">All</option>
            {Array.isArray(agents) &&
              agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-zinc-200 outline-none focus:border-emerald-500 text-sm"
          >
            <option value="">Default</option>
            <option value="priority">Priority</option>
            <option value="timeToClose">Time To Close</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-transparent uppercase tracking-wider select-none">
            ‎
          </label>
          <button
            onClick={() => {
              setStatusFilter("");
              setPriorityFilter("");
              setSourceFilter("");
              setSalesAgentFilter("");
              setSortBy("");
            }}
            className="rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <LeadTable leads={leads} handleDelete={handleDelete} />
    </div>
  );
};

export default Leads;
