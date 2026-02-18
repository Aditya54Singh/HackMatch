import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: ""
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
      setFormData({
        username: res.data.username,
        email: res.data.email
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put("/auth/update", formData);
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async () => {
    try {
      await api.put("/auth/change-password", passwordData);
      alert("Password updated successfully");
      setPasswordData({ old_password: "", new_password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete("/auth/delete");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      alert("Error deleting account");
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Loading profile...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-6 transition-colors duration-300">

      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {user.username}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">

          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            Account Information
          </h2>

          {editMode ? (
            <div className="space-y-4">
              <input
                className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />

              <input
                className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <div className="flex gap-4">
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow hover:opacity-90 transition"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Username:</strong> {user.username}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Email:</strong> {user.email}
              </p>

              <button
                onClick={() => setEditMode(true)}
                className="mt-6 px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white hover:shadow transition"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-800">

          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            Change Password
          </h2>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Old Password"
              className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              value={passwordData.old_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  old_password: e.target.value
                })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password: e.target.value
                })
              }
            />

            <button
              onClick={handleChangePassword}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium shadow hover:opacity-90 transition"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl shadow-lg p-8 border border-red-200 dark:border-red-800">

          <h2 className="text-xl font-semibold mb-4 text-red-600">
            Danger Zone
          </h2>

          <p className="text-sm text-red-500 mb-6">
            Deleting your account will permanently remove all your data.
            This action cannot be undone.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium shadow hover:opacity-90 transition"
          >
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
