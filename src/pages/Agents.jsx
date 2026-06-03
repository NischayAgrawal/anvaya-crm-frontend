import { useEffect, useState } from "react";
import { getAgents, createAgent } from "../api/agentApi";
import Skeleton from "../components/Skeleton";

import toast from "react-hot-toast";

const AgentsSkeleton = () => (
  <div className="min-h-screen bg-zinc-950 p-4 md:p-6">
    <Skeleton className="h-9 w-44 mb-8 ml-10 md:ml-0" />

    {/* Form card */}
    <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="flex flex-col md:flex-row gap-3">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-full md:w-24 rounded-xl" />
      </div>
    </div>

    {/* Table */}
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="bg-zinc-800 px-6 py-4 grid grid-cols-2 gap-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="px-6 py-4 border-t border-zinc-800 grid grid-cols-2 gap-4"
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </div>
  </div>
);

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchAgents = async () => {
    try {
      const data = await getAgents();
      setAgents(data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAgent({ name, email });
      toast.success("Agent created successfully");
      setName("");
      setEmail("");
      fetchAgents();
    } catch (error) {
      toast.error("Failed to create agent");
      console.log(error);
    }
  };

  if (loading) return <AgentsSkeleton />;

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-6 text-white">
      <h1 className="mb-8 text-2xl md:text-3xl font-bold pl-10 md:pl-0">
        Sales Agents
      </h1>

      {/* CREATE AGENT FORM */}
      <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
        <h2 className="mb-4 text-xl font-semibold">Create Agent</h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Agent Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white text-sm outline-none focus:border-emerald-500"
          />
          <input
            type="email"
            placeholder="Agent Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white text-sm outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="w-full md:w-auto shrink-0 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-600 transition-all"
          >
            Create
          </button>
        </form>
      </div>

      {/* AGENTS TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
        <table className="w-full min-w-[400px]">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent._id}
                className="border-t border-zinc-800 text-zinc-200"
              >
                <td className="px-6 py-4 text-sm">{agent.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-400">
                  {agent.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agents;
