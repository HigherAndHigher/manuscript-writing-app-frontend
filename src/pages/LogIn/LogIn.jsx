import { useState } from "react";
import "./LogIn.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BackendURL } from "../../components/untile";
import useAuth from "../../hook/useAuth";

export const LogIn = () => {
  const navigate = useNavigate();
  const [presentUser, setPresentUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const loadpresentUser = (e) => {
    setPresentUser((item) => ({ ...item, [e.target.name]: e.target.value }));
  };

  const logIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res = await axios.post(BackendURL + "/auth/login", presentUser);
      console.log(res.data);
      if (res.data.state) {
        login(presentUser);
        setPresentUser({ username: "", password: "" });
        navigate("/manuscript");
      } else {
        setError("Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={logIn}
      className="w-full max-w-lg mx-auto mt-[150px] p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800"
    >
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <label
        htmlFor="username"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        <b>Name</b>
      </label>
      <input
        name="username"
        type="text"
        className="input-login w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        onChange={loadpresentUser}
        placeholder="Enter the name"
      />
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        <b>Password</b>
      </label>
      <input
        name="password"
        type="password"
        className="input-login w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        onChange={loadpresentUser}
        placeholder="Enter your password"
      />
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="remember"
          name="remember"
          className="mr-2"
        />
        <label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
          Remember me
        </label>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-700 text-white font-semibold py-[10px] rounded-md hover:bg-blue-800 transition duration-200 ease-in-out mt-4"
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>
      <p className="text-[15px] mt-4 font-normal text-gray-500 dark:text-gray-400">
        Don’t have an account yet?{' '}
        <Link
          to="/register"
          className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          Register
        </Link>
      </p>
    </form>
  );
};
