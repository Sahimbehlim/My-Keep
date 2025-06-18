import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import InputBox from "../components/Auth/InputBox";
import { useUser } from "../context/userContext";

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setToken } = useUser();
  const navigate = useNavigate();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        loginInfo
      );
      const { token } = response.data;

      // Store token in cookies and context
      Cookies.set("authToken", token, { expires: 7 });
      setToken(token);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.response?.data?.error || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="w-full min-h-screen bg-gradient-to-bl from-[#f3b806dc] to-[#fca164] text-gray-800 relative flex items-center justify-center px-4">
      <form
        onSubmit={submitHandler}
        className="max-w-md w-full bg-white rounded-md px-4 py-5 flex flex-col gap-y-4"
      >
        <h2 className="text-center text-xl font-medium">Login</h2>

        <InputBox
          label="Your email"
          type="email"
          name="email"
          value={loginInfo.email}
          handler={handleChanges}
          placeholder="name@flowbite.com"
        />

        <InputBox
          label="Your password"
          type="password"
          name="password"
          value={loginInfo.password}
          handler={handleChanges}
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <p className="text-sm text-center">
          New User?{" "}
          <Link to={"/signup"} className="text-blue-700 font-medium">
            Register
          </Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="text-gray-800 bg-[#f3b806dc] hover:bg-[#f3b706] rounded-lg text-sm w-full px-5 py-2.5 text-center font-medium"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </section>
  );
};

export default Login;
