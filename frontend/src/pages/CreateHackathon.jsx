import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateHackathon = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize_pool: ""
  });

  const [loading, setLoading] = useState(false);
  const [riskDetails, setRiskDetails] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/hackathons/", {
        ...formData,
        prize_pool: Number(formData.prize_pool)
      });

      setRiskDetails(res.data.risk_details);

      setTimeout(() => {
        navigate("/app");
      }, 1500);

    } catch (err) {
      alert(err.response?.data?.message || "Error creating hackathon");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        🚀 Create Hackathon
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          name="title"
          placeholder="Hackathon Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded dark:bg-gray-800"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full p-3 border rounded dark:bg-gray-800"
        />

        <input
          type="number"
          name="prize_pool"
          placeholder="Prize Pool (₹)"
          value={formData.prize_pool}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded dark:bg-gray-800"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:opacity-90"
        >
          {loading ? "Creating..." : "Create Hackathon"}
        </button>

      </form>

      {riskDetails && (
        <div className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <p><strong>Spam Probability:</strong> {riskDetails.spam_probability.toFixed(4)}</p>
          <p><strong>Status:</strong> {riskDetails.risk_status}</p>
        </div>
      )}

    </div>
  );
};

export default CreateHackathon;
