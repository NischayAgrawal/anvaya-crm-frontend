import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLeads } from "../api/leadApi";
import { getAgents } from "../api/agentApi";
import Skeleton from "../components/Skeleton";

import { getPipelineReport, getClosedLeadsByAgent } from "../api/reportApi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { FiUsers, FiTarget, FiCheckCircle, FiUser } from "react-icons/fi";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

const useCountUp = (target, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 text-zinc-400">{label}</p>}
      {payload.map((entry, i) => (
        <p
          key={i}
          style={{ color: entry.color || "#ffffff" }}
          className="font-semibold"
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
    {/* Header */}
    <div className="mb-8 pl-10 md:pl-0">
      <Skeleton className="h-9 w-48 mb-2" />
      <Skeleton className="h-4 w-80" />
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="h-10 w-16" />
        </div>
      ))}
    </div>

    {/* Close Rate Banner */}
    <div className="mb-6 md:mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <div className="shrink-0">
          <Skeleton className="h-3 w-32 mb-2" />
          <Skeleton className="h-12 w-20" />
        </div>
        <div className="flex-1 pt-2">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
          <Skeleton className="h-3 w-48 mt-2" />
        </div>
      </div>
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 mb-6 md:mb-8">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6"
        >
          <Skeleton className="h-5 w-48 mb-1" />
          <Skeleton className="h-3 w-36 mb-5" />
          <Skeleton className="h-64 md:h-72 w-full rounded-xl" />
        </div>
      ))}
    </div>

    {/* Recent Leads */}
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 py-2 border-t border-zinc-800">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [closedByAgentData, setClosedByAgentData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [leadsData, agentsData, pipelineReport, closedByAgentReport] =
          await Promise.all([
            getLeads(),
            getAgents(),
            getPipelineReport(),
            getClosedLeadsByAgent(),
          ]);
        setLeads(leadsData);
        setAgents(agentsData);
        setPipelineData(pipelineReport);
        setClosedByAgentData(closedByAgentReport);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };
    fetchDashboardData();
  }, []);

  const totalLeads = leads.length;
  const closedLeads = leads.filter((l) => l.status === "Closed").length;
  const openLeads = totalLeads - closedLeads;
  const closeRate =
    totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
  const recentLeads = [...leads].reverse().slice(0, 5);

  const animatedTotal = useCountUp(loading ? 0 : totalLeads);
  const animatedOpen = useCountUp(loading ? 0 : openLeads);
  const animatedClosed = useCountUp(loading ? 0 : closedLeads);
  const animatedAgents = useCountUp(loading ? 0 : agents.length);
  const animatedCloseRate = useCountUp(loading ? 0 : closeRate);

  if (loading) return <DashboardSkeleton />;

  const kpiCards = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: <FiTarget size={18} />,
      iconColor: "text-emerald-400",
      borderHover: "hover:border-emerald-500",
      glowHover: "hover:shadow-emerald-500/10",
      route: "/leads",
    },
    {
      label: "Open Leads",
      value: openLeads,
      icon: <FiUsers size={18} />,
      iconColor: "text-blue-400",
      borderHover: "hover:border-blue-500",
      glowHover: "hover:shadow-blue-500/10",
      route: "/leads",
    },
    {
      label: "Closed Leads",
      value: closedLeads,
      icon: <FiCheckCircle size={18} />,
      iconColor: "text-emerald-400",
      borderHover: "hover:border-emerald-500",
      glowHover: "hover:shadow-emerald-500/10",
      route: "/leads",
    },
    {
      label: "Sales Agents",
      value: agents.length,
      icon: <FiUser size={18} />,
      iconColor: "text-yellow-400",
      borderHover: "hover:border-yellow-500",
      glowHover: "hover:shadow-yellow-500/10",
      route: "/agents",
    },
  ];

  const priorityColors = {
    High: "bg-red-500/15 text-red-400",
    Medium: "bg-yellow-500/15 text-yellow-400",
    Low: "bg-green-500/15 text-green-400",
  };

  const statusColors = {
    New: "bg-blue-500/15 text-blue-400",
    Qualified: "bg-purple-500/15 text-purple-400",
    "Proposal Sent": "bg-orange-500/15 text-orange-400",
    Closed: "bg-emerald-500/15 text-emerald-400",
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 text-white">
      {/* HEADER */}
      <div className="mb-8 pl-10 md:pl-0">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Track leads, monitor pipeline health, and manage sales performance.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
        {kpiCards.map(
          ({
            label,
            value,
            icon,
            iconColor,
            borderHover,
            glowHover,
            route,
          }) => (
            <div
              key={label}
              onClick={() => navigate(route)}
              className={`cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${borderHover} ${glowHover}`}
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <p className="text-xs md:text-sm text-zinc-400">{label}</p>
                <span className={`${iconColor} opacity-80`}>{icon}</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold tabular-nums">
                {value}
              </p>
            </div>
          ),
        )}
      </div>

      {/* CLOSE RATE BANNER */}
      <div className="mb-6 md:mb-8 rounded-2xl border border-zinc-800 bg-gradient-to-r from-emerald-500/10 via-zinc-900 to-zinc-900 p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="shrink-0">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
            Overall Close Rate
          </p>
          <p className="text-4xl md:text-5xl font-bold text-emerald-400">
            {closeRate}%
          </p>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-zinc-500 mb-2">
            <span>0%</span>
            <span>100%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000"
              style={{ width: `${closeRate}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            {closedLeads} closed out of {totalLeads} total leads
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 mb-6 md:mb-8">
        {/* PIE CHART */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-1">
            Lead Status Distribution
          </h2>
          <p className="text-xs text-zinc-500 mb-5">
            Breakdown of leads by current stage
          </p>
          <div className="h-64 md:h-72">
            {pipelineData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-zinc-600 text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pipelineData}
                    dataKey="count"
                    nameKey="_id"
                    outerRadius="75%"
                    innerRadius="45%"
                  >
                    {pipelineData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Custom legend */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {pipelineData.map((entry, index) => (
              <div key={entry._id} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs text-zinc-400">{entry._id}</span>
                <span className="text-xs font-semibold text-zinc-200">
                  {entry.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BAR CHART */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-1">
            Closed Leads by Agent
          </h2>
          <p className="text-xs text-zinc-500 mb-5">
            Agent performance on closed deals
          </p>
          <div className="h-64 md:h-72">
            {closedByAgentData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-zinc-600 text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={closedByAgentData} barSize={32}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="agentName"
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#71717a", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "12px",
                      fontSize: "13px",
                      color: "#fff",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar
                    dataKey="totalClosed"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* RECENT LEADS */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base md:text-lg font-semibold">Recent Leads</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Last 5 leads added</p>
          </div>
          <button
            onClick={() => navigate("/leads")}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all →
          </button>
        </div>

        {recentLeads.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-600">
            No leads available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="pb-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-2">
                    Lead
                  </th>
                  <th className="pb-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-2">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-2">
                    Priority
                  </th>
                  <th className="pb-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-2">
                    Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="border-t border-zinc-800/60 cursor-pointer hover:bg-zinc-800/40 transition-colors group"
                  >
                    <td className="px-2 py-3.5 text-sm font-medium group-hover:text-emerald-400 transition-colors">
                      {lead.name}
                    </td>
                    <td className="px-2 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[lead.status] ?? "bg-zinc-700 text-zinc-300"}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-2 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityColors[lead.priority] ?? "bg-zinc-700 text-zinc-300"}`}
                      >
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-2 py-3.5 text-sm text-zinc-400">
                      {lead.salesAgent?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
