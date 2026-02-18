import { useEffect } from "react";
import { X } from "lucide-react";

const HackathonModal = ({ hackathon, onClose }) => {

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!hackathon) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-[650px] max-h-[80vh] overflow-y-auto shadow-2xl transform animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {hackathon.title}
          </h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
          {hackathon.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Prize Pool:</strong> ₹{hackathon.prize_pool}
          </div>
          <div>
            <strong>Participants:</strong> {hackathon.participants_count}
          </div>
          <div>
            <strong>Risk:</strong> {hackathon.risk_status}
          </div>
          <div>
            <strong>Spam Score:</strong> {hackathon.spam_probability}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonModal;
