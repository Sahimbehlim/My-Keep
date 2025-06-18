import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputBox from "../components/Auth/InputBox";

const SignUp = () => {
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setRegisterInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post("http://localhost:3000/api/user/register", registerInfo);
      navigate("/login");
    } catch (error) {
      console.error("Error registering user", error);
      setError(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-bl from-[#f3b806dc] to-[#fca164] text-gray-800 relative flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white rounded-md px-4 py-5 flex flex-col gap-y-4"
      >
        <h2 className="text-center text-xl font-medium">Sign Up</h2>

        <InputBox
          label="Your name"
          type="text"
          name="name"
          value={registerInfo.name}
          handler={handleChanges}
          placeholder="Behlim Shaeem"
        />

        <InputBox
          label="Your email"
          type="email"
          name="email"
          value={registerInfo.email}
          handler={handleChanges}
          placeholder="name@flowbite.com"
        />

        <InputBox
          label="Your password"
          type="password"
          name="password"
          value={registerInfo.password}
          handler={handleChanges}
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <p className="text-sm text-center">
          Already registered?{" "}
          <Link to={"/login"} className="text-blue-700 font-medium">
            Login
          </Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="text-gray-800 bg-[#f3b806dc] hover:bg-[#f3b706] rounded-lg text-sm w-full px-5 py-2.5 text-center font-medium"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
};

export default SignUp;
