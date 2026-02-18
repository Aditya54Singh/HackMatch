import { useEffect, useState } from "react";
import api from "../api/axios";
import HackathonModal from "../components/HackathonModal";
import HackathonCard from "../components/HackathonCard";

const Home = () => {

  const [hackathons, setHackathons] = useState([]);
  const [joinedIds, setJoinedIds] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [hackRes, historyRes] = await Promise.all([
        api.get(`/hackathons/?page=${page}&limit=5`),
        api.get("/users/history")
      ]);

      const newHackathons = hackRes.data.hackathons;

      // 🔥 If first page → replace
      // 🔥 If next page → append
      if (page === 1) {
        setHackathons(newHackathons);
      } else {
        setHackathons(prev => [...prev, ...newHackathons]);
      }

      setTotalPages(hackRes.data.total_pages);

      const joined = historyRes.data.history.map(
        item => item.hackathon.id
      );

      setJoinedIds(joined);

      setLoading(false);

    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      await api.post(`/hackathons/${id}/register`);

      setJoinedIds(prev => [...prev, id]);

      setHackathons(prev =>
        prev.map(h =>
          h.id === id
            ? { ...h, participants_count: h.participants_count + 1 }
            : h
        )
      );

    } catch (err) {
      alert(err.response?.data?.message || "Error joining");
    }
  };

  return (
    <div className="p-10">

      {/* 🔥 AI Summits & Workshops Section */}
      <div className="mb-14">

        <h2 className="text-2xl font-semibold mb-6">
          🚀 Upcoming AI Summits & Workshops
        </h2>

        <div className="grid grid-cols-3 gap-6">

          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition">
            <h3 className="text-lg font-bold mb-2">
              AI Summit 2026
            </h3>
            <p className="text-sm opacity-90">
              Explore future of Generative AI & LLM systems.
            </p>
            <button className="mt-4 px-4 py-2 bg-white text-purple-700 rounded-lg text-sm font-medium">
              Learn More
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:scale-105 transition">
            <h3 className="text-lg font-bold mb-2">
              GenAI Workshop
            </h3>
            <p className="text-sm opacity-90">
              Hands-on session on building AI-powered apps.
            </p>
            <button className="mt-4 px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-medium">
              Register
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:scale-105 transition">
            <h3 className="text-lg font-bold mb-2">
              ML Bootcamp
            </h3>
            <p className="text-sm opacity-90">
              3-day immersive machine learning training.
            </p>
            <button className="mt-4 px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-medium">
              Join Now
            </button>
          </div>

        </div>
      </div>


      <h1 className="text-3xl font-bold mb-8">
        🔥 Trending & Latest Hackathons
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {hackathons.map((hackathon) => (
          <HackathonCard
            key={hackathon.id}
            hackathon={hackathon}
            handleJoin={handleJoin}
            joinedIds={joinedIds}
            setSelectedHackathon={setSelectedHackathon}
          />
        ))}
      </div>

      {/* 🔥 Load More Button */}
      {page < totalPages && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedHackathon && (
        <HackathonModal
          hackathon={selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
        />
      )}

    </div>
  );
};

export default Home;
