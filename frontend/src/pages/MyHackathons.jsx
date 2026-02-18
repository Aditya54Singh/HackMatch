import { useEffect, useState } from "react";
import api from "../api/axios";
import HackathonCard from "../components/HackathonCard";
import HackathonModal from "../components/HackathonModal";
import EditHackathonModal from "../components/EditHackathonModal";

const MyHackathons = () => {

  const [joined, setJoined] = useState([]);
  const [created, setCreated] = useState([]);
  const [activeTab, setActiveTab] = useState("joined");
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [editingHackathon, setEditingHackathon] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [joinedRes, createdRes] = await Promise.all([
        api.get("/users/history"),
        api.get("/hackathons/my-created")
      ]);

      setJoined(
        joinedRes.data.history.map(item => item.hackathon)
      );

      setCreated(createdRes.data.hackathons);

    } catch (err) {
      console.error("Error fetching hackathons:", err);
    }
  };

  /* =========================
     DELETE FUNCTION
  ========================= */
  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to cancel this hackathon?"))
      return;

    try {
      await api.delete(`/hackathons/${id}`);

      // Instantly update UI
      setCreated(prev =>
        prev.filter(h => h.id !== id)
      );

    } catch (err) {
      alert("Error deleting hackathon");
    }
  };

  /* =========================
     EDIT FUNCTION
  ========================= */
  const handleEdit = (hackathon) => {
    setEditingHackathon(hackathon);
  };

  /* =========================
     UPDATE CREATED LIST AFTER EDIT
  ========================= */
  const handleUpdated = (updatedHackathon) => {
    setCreated(prev =>
      prev.map(h =>
        h.id === updatedHackathon.id
          ? updatedHackathon
          : h
      )
    );
  };

  const dataToShow =
    activeTab === "joined" ? joined : created;

  return (
    <div className="p-10 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        My Hackathons
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-10">

        <button
          onClick={() => setActiveTab("joined")}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            activeTab === "joined"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:opacity-80"
          }`}
        >
          Joined
        </button>

        <button
          onClick={() => setActiveTab("created")}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            activeTab === "created"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:opacity-80"
          }`}
        >
          Created
        </button>

      </div>

      {/* Content */}
      {dataToShow.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          No hackathons found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {dataToShow.map((hackathon) => (
            <HackathonCard
              key={hackathon.id}
              hackathon={hackathon}
              showJoinButton={false}
              setSelectedHackathon={setSelectedHackathon}
              showOwnerActions={activeTab === "created"}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

        </div>
      )}

      {/* View Modal */}
      {selectedHackathon && (
        <HackathonModal
          hackathon={selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
        />
      )}

      {/* Edit Modal */}
      {editingHackathon && (
        <EditHackathonModal
          hackathon={editingHackathon}
          onClose={() => setEditingHackathon(null)}
          onUpdated={handleUpdated}
        />
      )}

    </div>
  );
};

export default MyHackathons;
