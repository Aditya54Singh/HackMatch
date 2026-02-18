import { useState } from "react";
import api from "../api/axios";

const EditHackathonModal = ({ hackathon, onClose, onUpdated }) => {

  const [description, setDescription] = useState(hackathon.description);
  const [prize, setPrize] = useState(hackathon.prize_pool);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      await api.put(`/hackathons/${hackathon.id}`, {
        description,
        prize_pool: Number(prize)
      });

      onUpdated({
        ...hackathon,
        description,
        prize_pool: Number(prize)
      });

      onClose();

    } catch (err) {
      alert("Error updating hackathon");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full max-w-lg shadow-2xl">

        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Edit Hackathon
        </h2>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-800"
        />

        <input
          type="number"
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6 dark:bg-gray-800"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditHackathonModal;
