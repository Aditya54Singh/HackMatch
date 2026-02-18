import { useEffect, useState } from "react";
import api from "../api/axios";
import { UserPlus, UserMinus, Users, X } from "lucide-react";

const Connect = () => {

  const [similarUsers, setSimilarUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetchSimilarUsers();
    fetchConnections();
  }, []);

  const fetchSimilarUsers = async () => {
    try {
      const res = await api.get("/users/connect");
      setSimilarUsers(res.data.similar_users);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await api.get("/users/connections");
      setConnections(res.data.connections);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleConnection = async (userId) => {
    try {
      await api.post(`/users/connect/${userId}`);
      fetchConnections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewProfile = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}`);
      setSelectedProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const isConnected = (userId) => {
    return connections.some(conn => conn.id === userId);
  };

  return (
    <div className="p-10 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      {/* ================= Similar Users ================= */}
      <h1 className="text-3xl font-bold mb-10 text-gray-800 dark:text-white">
        🤝 Discover Similar Developers
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

        {similarUsers.map(user => (
          <div
            key={user.user_id}
            className="
              p-6 rounded-2xl 
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-700
              shadow-sm hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1
            "
          >

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {user.username}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Similarity: {user.similarity_score}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">

              <button
                onClick={() => handleToggleConnection(user.user_id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    isConnected(user.user_id)
                      ? "bg-red-500 text-white hover:opacity-90"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                  }
                `}
              >
                {isConnected(user.user_id) ? (
                  <>
                    <UserMinus size={16} />
                    Remove
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Connect
                  </>
                )}
              </button>

              <button
                onClick={() => handleViewProfile(user.user_id)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Profile
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ================= Connections ================= */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        🔗 Your Network
      </h1>

      {connections.length === 0 && (
        <div className="text-gray-500 dark:text-gray-400">
          You have no connections yet.
        </div>
      )}

      <div className="space-y-6">

        {connections.map(user => (
          <div
            key={user.id}
            className="
              p-6 rounded-2xl 
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-700
              shadow-sm hover:shadow-lg
              transition
            "
          >

            <div className="flex justify-between items-center mb-4">

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                  {user.username}
                </h2>
              </div>

              <button
                onClick={() => handleToggleConnection(user.id)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:opacity-90 transition"
              >
                Remove
              </button>

            </div>

            <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
              Joined Hackathons
            </h3>

            <div className="flex flex-wrap gap-2">

              {user.joined_hackathons.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No joined hackathons.
                </p>
              ) : (
                user.joined_hackathons.map(h => (
                  <span
                    key={h.id}
                    className="
                      px-3 py-1 text-xs rounded-full
                      bg-blue-100 dark:bg-blue-900
                      text-blue-700 dark:text-blue-300
                    "
                  >
                    {h.title}
                  </span>
                ))
              )}

            </div>

          </div>
        ))}

      </div>

      {/* ================= Profile Modal ================= */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="
            bg-white dark:bg-gray-900 
            w-full max-w-lg p-8 rounded-2xl 
            shadow-2xl relative
          ">

            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4 mb-6">

              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                {selectedProfile.username.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedProfile.username}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Joined: {selectedProfile.joined_count} • Created: {selectedProfile.created_count}
                </p>
              </div>

            </div>

            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Created Hackathons
            </h3>

            <div className="space-y-2">
              {selectedProfile.created_hackathons.map(h => (
                <div
                  key={h.id}
                  className="
                    p-3 rounded-lg 
                    bg-gray-100 dark:bg-gray-800
                    text-sm text-gray-700 dark:text-gray-300
                  "
                >
                  {h.title}
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Connect;
