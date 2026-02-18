import RiskBadge from "./RiskBadge";
import { Pencil, Trash2, Users } from "lucide-react";

const HackathonCard = ({
  hackathon,
  handleJoin,
  joinedIds = [],
  setSelectedHackathon,
  showJoinButton = true,
  showOwnerActions = false,
  onEdit,
  onDelete
}) => {

  const isJoined = joinedIds.includes(hackathon.id);

  return (
    <div
      onClick={() => setSelectedHackathon?.(hackathon)}
      className="
        group relative p-6 rounded-2xl 
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-2xl
        transition-all duration-300
        hover:-translate-y-1
        cursor-pointer
      "
    >

      {/* Top Header */}
      <div className="flex justify-between items-start mb-3">

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white leading-snug">
          {hackathon.title}
        </h2>

        <RiskBadge status={hackathon.risk_status} />
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
        {hackathon.description}
      </p>

      {/* Stats Section */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">

        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{hackathon.participants_count} Participants</span>
        </div>

        <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
          Score: {hackathon.spam_probability}
        </span>
      </div>

      {/* Join Button */}
      {showJoinButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleJoin?.(hackathon.id);
          }}
          disabled={isJoined}
          className={`
            w-full py-2.5 rounded-xl font-medium text-sm
            transition-all duration-200
            ${
              isJoined
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
            }
          `}
        >
          {isJoined ? "Joined ✔" : "Join Hackathon"}
        </button>
      )}

      {/* Owner Actions */}
      {showOwnerActions && (
        <div className="flex gap-3 mt-4">

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(hackathon);
            }}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:opacity-90 transition"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(hackathon.id);
            }}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:opacity-90 transition"
          >
            <Trash2 size={14} />
            Delete
          </button>

        </div>
      )}

      {/* Hover Glow Effect */}
      <div className="
        absolute inset-0 rounded-2xl 
        opacity-0 group-hover:opacity-100 
        transition duration-300
        pointer-events-none
        bg-gradient-to-r from-blue-500/5 to-indigo-500/5
      " />

    </div>
  );
};

export default HackathonCard;
