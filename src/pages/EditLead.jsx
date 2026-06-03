import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLeadById, updateLead } from "../api/leadApi";
import { getAgents } from "../api/agentApi";
import toast from "react-hot-toast";

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    tags: "",
    timeToClose: "",
    closedAt: "",
    priority: "Medium",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadData, agentsData] = await Promise.all([
          getLeadById(id),
          getAgents(),
        ]);
        setAgents(agentsData);
        setFormData({
          name: leadData.name || "",
          source: leadData.source || "",
          salesAgent: leadData.salesAgent?._id || "",
          status: leadData.status || "New",
          tags: leadData.tags?.join(", ") || "",
          timeToClose: leadData.timeToClose ?? "",
          closedAt: leadData.closedAt ? leadData.closedAt.split("T")[0] : "",
          priority: leadData.priority || "Medium",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedLead = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        timeToClose:
          formData.status === "Closed" ? null : Number(formData.timeToClose),
        closedAt: formData.status === "Closed" ? formData.closedAt : null,
      };
      await updateLead(id, updatedLead);
      toast.success("Lead updated successfully");
      navigate(`/leads/${id}`);
    } catch (error) {
      toast.error("Failed to update lead");
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-zinc-700 border-t-emerald-500" />
          <p className="text-lg font-medium text-zinc-300">Loading...</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-emerald-500 text-sm";
  const labelClass = "mb-2 block text-sm text-zinc-400";

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-6 text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 pl-10 md:pl-0 text-zinc-400 hover:text-white text-sm transition-colors"
      >
        ← Back
      </button>

      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Edit Lead</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* NAME */}
            <div className="md:col-span-2">
              <label className={labelClass}>Lead Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* SOURCE */}
            <div>
              <label className={labelClass}>Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Advertisement">Advertisement</option>
              </select>
            </div>

            {/* SALES AGENT */}
            <div>
              <label className={labelClass}>Sales Agent</label>
              <select
                name="salesAgent"
                value={formData.salesAgent}
                onChange={handleChange}
                required
                className={inputClass}
              >
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* PRIORITY */}
            <div>
              <label className={labelClass}>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* TIME TO CLOSE / CLOSED AT */}
            <div>
              {formData.status !== "Closed" ? (
                <>
                  <label className={labelClass}>Time To Close (days)</label>
                  <input
                    type="number"
                    name="timeToClose"
                    value={formData.timeToClose}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </>
              ) : (
                <>
                  <label className={labelClass}>Closed At</label>
                  <input
                    type="date"
                    name="closedAt"
                    value={formData.closedAt}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </>
              )}
            </div>

            {/* TAGS */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                Tags <span className="text-zinc-600">(comma separated)</span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Enterprise, Urgent"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-emerald-600"
          >
            Update Lead
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditLead;
