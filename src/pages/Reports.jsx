import { useEffect, useState } from "react";
import {
  getLastWeekClosedLeads,
  getPipelineReport,
  getClosedLeadsByAgent,
} from "../api/reportApi";

import Skeleton from "../components/Skeleton";

const ReportsSkeleton = () => (
  <div className="min-h-screen bg-zinc-950 p-4 md:p-6">
    <Skeleton className="h-9 w-52 mb-8 ml-10 md:ml-0" />

    {/* KPI card */}
    <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
      <Skeleton className="h-4 w-40 mb-3" />
      <Skeleton className="h-14 w-16" />
    </div>

    {/* Two table cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6"
        >
          <Skeleton className="h-5 w-36 mb-1" />
          <Skeleton className="h-3 w-24 mb-5" />
          <div className="space-y-3">
            {[...Array(4)].map((_, j) => (
              <div
                key={j}
                className="flex justify-between border-t border-zinc-800 pt-3"
              >
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Reports = () => {
  const [lastWeek, setLastWeek] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [closedByAgent, setClosedByAgent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [lastWeekData, pipelineData, closedByAgentData] =
          await Promise.all([
            getLastWeekClosedLeads(),
            getPipelineReport(),
            getClosedLeadsByAgent(),
          ]);
        setLastWeek(lastWeekData);
        setPipeline(pipelineData);
        setClosedByAgent(closedByAgentData);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <ReportsSkeleton />;

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-6 text-white">
      <h1 className="mb-8 text-2xl md:text-3xl font-bold pl-10 md:pl-0">
        Reports Dashboard
      </h1>

      {/* KPI CARD */}
      <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
        <p className="text-sm text-zinc-400">Leads Closed Last 7 Days</p>
        <h2 className="mt-2 text-4xl md:text-5xl font-bold text-emerald-400">
          {lastWeek.length}
        </h2>
      </div>

      {/* PIPELINE + CLOSED BY AGENT — side by side on tablet+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PIPELINE REPORT */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
          <h2 className="mb-4 text-lg md:text-xl font-semibold">
            Pipeline Report
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[200px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {pipeline.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-zinc-800 text-zinc-200"
                  >
                    <td className="px-4 py-3 text-sm">{item._id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-emerald-400">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CLOSED BY AGENT REPORT */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
          <h2 className="mb-4 text-lg md:text-xl font-semibold">
            Closed Leads By Agent
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[200px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">
                    Agent
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-400">
                    Closed
                  </th>
                </tr>
              </thead>
              <tbody>
                {closedByAgent.map((agent) => (
                  <tr
                    key={agent.agentName}
                    className="border-b border-zinc-800 text-zinc-200"
                  >
                    <td className="px-4 py-3 text-sm">{agent.agentName}</td>
                    <td className="px-4 py-3 text-sm font-medium text-emerald-400">
                      {agent.totalClosed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
