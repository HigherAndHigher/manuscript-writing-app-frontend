import { useState } from "react";
import "./Register.css";
import axios from "axios";
import { BackendURL } from "../../components/untile";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";

const Register = () => {
  const navigate = useNavigate();

  const { isLoggedIn, login } = useAuth();

  const [userinfor, setUserinfor] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [passwordcon, setPasswordcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserinfor({ ...userinfor, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (userinfor.password !== passwordcon) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      let res = await axios.post(BackendURL + "/auth/register", userinfor);
      if (res.data.state) {
        login(userinfor);
        navigate("/manuscript");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="w-full max-w-lg mx-auto mt-[150px] p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800"
    >
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
      >
        <b>Email</b>
      </label>
      <input
        name="email"
        type="email"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        onChange={handleChange}
        placeholder="Enter your email"
      />
      <label
        htmlFor="username"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
      >
        <b>Username</b>
      </label>
      <input
        name="username"
        type="text"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        onChange={handleChange}
        placeholder="Enter your username"
      />
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
      >
        <b>Password</b>
      </label>
      <input
        name="password"
        type="password"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        onChange={handleChange}
        placeholder="Enter your password"
      />
      <label
        htmlFor="passwordcon"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 my-2"
      >
        <b>Confirm Password</b>
      </label>
      <input
        name="passwordcon"
        type="password"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        onChange={(e) => setPasswordcon(e.target.value)}
        placeholder="Confirm your password"
      />
      <button
        type="submit"
        className="w-full bg-blue-700 text-white font-semibold py-[10px] rounded-md hover:bg-blue-800 transition duration-200 ease-in-out mt-4"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
