import { useNavigate } from "react-router-dom";

const LeadTable = ({ leads, handleDelete }) => {
  const navigate = useNavigate();
  return (
    // Change the outer div:
    <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg">
      {" "}
      <table className="w-full min-w-[1000px]">
        <thead className="bg-zinc-800 text-zinc-300">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Lead Name
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Status
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Priority
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Sales Agent
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Source
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Time To Close
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead._id}
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="
                cursor-pointer
                border-t
                border-zinc-800
                text-zinc-200
                hover:bg-zinc-800/50
                transition-colors
              "
            >
              <td className="px-6 py-4 font-medium">{lead.name}</td>

              <td className="px-6 py-4">
                <span
                  className="
                    rounded-full
                    bg-blue-500/20
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-blue-400
                  "
                >
                  {lead.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-medium

                    ${
                      lead.priority === "High"
                        ? "bg-red-500/20 text-red-400"
                        : lead.priority === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                    }
                  `}
                >
                  {lead.priority}
                </span>
              </td>

              <td className="px-6 py-4 text-zinc-300">
                {lead.salesAgent?.name}
              </td>

              <td className="px-6 py-4 text-zinc-300">{lead.source}</td>

              <td className="px-6 py-4 text-zinc-300">
                {lead.status === "Closed"
                  ? "-"
                  : `${lead.timeToClose} days`}{" "}
              </td>

              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      navigate(`/leads/edit/${lead._id}`);
                    }}
                    className="rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/30"
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      handleDelete(lead._id);
                    }}
                    className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
