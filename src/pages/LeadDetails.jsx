import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";

import { getLeadById } from "../api/leadApi";
import { getComments, createComment } from "../api/commentApi";
import { getAgents } from "../api/agentApi";

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const leadData = await getLeadById(id);
        setLead(leadData);

        const commentsData = await getComments(id);
        setComments(commentsData);

        const agentsData = await getAgents();
        setAgents(agentsData);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchLead();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText || !selectedAgent) {
      return;
    }

    try {
      const newComment = await createComment(id, {
        author: selectedAgent,
        commentText,
      });

      setComments([...comments, newComment]);
      toast.success("Comment added");
      setCommentText("");
      setSelectedAgent("");
    } catch (error) {
      toast.error("Failed to add comment");
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-zinc-700 border-t-emerald-500" />
          <p className="text-lg font-medium text-zinc-300">Loading Lead...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        ← Back to Leads
      </button>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold">{lead.name}</h1>

          <button
            onClick={() => navigate(`/leads/edit/${lead._id}`)}
            className="text-zinc-400 transition-colors hover:text-blue-400"
            title="Edit Lead"
          >
            <FiEdit2 size={18} />
          </button>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-zinc-400">Status</p>

            <span className="mt-1 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
              {lead.status}
            </span>
          </div>

          <div>
            <p className="text-zinc-400">Priority</p>

            <span
              className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                lead.priority === "High"
                  ? "bg-red-500/20 text-red-400"
                  : lead.priority === "Medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
              }`}
            >
              {lead.priority}
            </span>
          </div>

          <div>
            <p className="text-zinc-400">Source</p>
            <p className="mt-1">{lead.source}</p>
          </div>

          <div>
            <p className="text-zinc-400">Sales Agent</p>
            <p className="mt-1">{lead.salesAgent?.name}</p>
          </div>

          {lead.status === "Closed" ? (
            <div>
              <p className="text-zinc-400">Closed At</p>

              <p className="mt-1">
                {lead.closedAt
                  ? new Date(lead.closedAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-zinc-400">Time To Close</p>

              <p className="mt-1">{lead.timeToClose} days</p>
            </div>
          )}
        </div>

        {/* TAGS */}
        <div className="mt-6">
          <p className="mb-3 text-zinc-400">Tags</p>

          <div className="flex flex-wrap gap-2">
            {lead.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* COMMENTS */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold">Comments</h2>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add comment..."
              className="min-h-[120px] w-full rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-zinc-200 outline-none"
            />

            <div className="mt-4 flex items-center gap-4">
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-200 outline-none"
              >
                <option value="">Select Agent</option>

                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddComment}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-white hover:bg-emerald-600"
              >
                Add Comment
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{comment.author?.name}</p>

                  <p className="text-sm text-zinc-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>

                <p className="mt-3 text-zinc-300">{comment.commentText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
