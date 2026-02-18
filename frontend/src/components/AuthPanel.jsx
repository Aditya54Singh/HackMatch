import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPanel = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password
        });


        login(res.data.access_token, res.data.user_id);
        navigate("/app");

      } else {
        await api.post(
          "/auth/register",
          formData
        );

        alert("Registered successfully! Please login.");
        setIsLogin(true);
      }

    } catch (err) {
      console.log("FULL ERROR:", err);
      alert(JSON.stringify(err.response?.data));

    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-96">

      <div className="flex justify-between mb-6">
        <button
          className={`w-1/2 py-2 ${isLogin ? "border-b-2 border-black" : ""}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`w-1/2 py-2 ${!isLogin ? "border-b-2 border-black" : ""}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          {isLogin ? "Login" : "Register"}
        </button>

      </form>

    </div>
  );
};

export default AuthPanel;
