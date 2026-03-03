import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import { loginUser, registerUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Login() {
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLoginClick = () => {
    setActive((prev) => (prev === "login" ? null : "login"));
    setError("");
    setSuccess("");
  };

  const handleRegisterClick = () => {
    setActive((prev) => (prev === "register" ? null : "register"));
    setError("");
    setSuccess("");
  };

  // ================= LOGIN =================
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await loginUser(loginData);

      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/home");
      }, 1200);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ================= REGISTER + AUTO LOGIN =================
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Register
      await registerUser(registerData);

      // Immediately login
      await loginUser({
        identifier: registerData.email,
        password: registerData.password,
      });

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f0f0f] transition-all duration-500 relative overflow-hidden">
      {/* Coral Glow */}
      <div className="absolute w-[700px] h-[700px] bg-[#ff4d4d] opacity-20 dark:opacity-10 rounded-full blur-[160px] -top-52 -left-52 animate-pulse" />

      {/* SUCCESS POPUP */}
      {success && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-[#ff4d4d] text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium">
          {success}
        </div>
      )}

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* MAIN CENTERED CONTENT */}
      <div className="flex-grow flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-md text-center">
          {/* HEADING */}
          <h1
            className="text-[80px] sm:text-[72px] md:text-[85px] lg:text-[90px] leading-[0.9] font-black text-black dark:text-white tracking-tight mb-8 md:mb-12"
            style={{ fontFamily: "'Darker Grotesque', sans-serif" }}
          >
            Short<span className="text-red-600">.</span>ly
          </h1>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 text-sm text-red-600 dark:text-white bg-red-100 dark:bg-red-900/30 p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLoginClick}
            className="mx-auto w-[160px] py-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-[15px] font-semibold tracking-wider shadow-lg hover:bg-[#ff4d4d] hover:text-white transition-all duration-300"
          >
            LOGIN
          </button>

          {/* LOGIN FORM */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              active === "login"
                ? "max-h-[420px] opacity-100 mt-8"
                : "max-h-0 opacity-0"
            }`}
          >
            <form
              onSubmit={handleLoginSubmit}
              className="flex flex-col gap-5 mt-4 bg-white dark:bg-[#151515] p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800"
            >
              <input
                type="text"
                placeholder="Your Username or Email"
                value={loginData.identifier}
                onChange={(e) =>
                  setLoginData({ ...loginData, identifier: e.target.value })
                }
                required
                className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  className="w-full p-3 pr-10 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
                />

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="py-3 mt-4 rounded-full bg-[#ff4d4d] text-white text-sm font-semibold tracking-wider shadow-md hover:bg-red-600 transition-all duration-300 disabled:opacity-60"
              >
                {loading ? "Signing In..." : "SIGN IN"}
              </button>
            </form>
          </div>

          {/* REGISTER FORM */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              active === "register"
                ? "max-h-[520px] opacity-100 mt-8"
                : "max-h-0 opacity-0"
            }`}
          >
            <form
              onSubmit={handleRegisterSubmit}
              className="flex flex-col gap-5 mt-4 bg-white dark:bg-[#151515] p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800"
            >
              <input
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
                required
                className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
              />

              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                required
                className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
              />

              <input
                type="text"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                required
                className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
              />

              <button
                type="submit"
                disabled={loading}
                className="py-3 mt-4 rounded-full bg-[#ff4d4d] text-white text-sm font-semibold tracking-wider shadow-md hover:bg-red-600 transition-all duration-300 disabled:opacity-60"
              >
                {loading ? "Creating..." : "CREATE ACCOUNT"}
              </button>
            </form>
          </div>

          {/* REGISTER BUTTON */}
          <button
            onClick={handleRegisterClick}
            className="mx-auto w-[160px] py-3 mt-10 rounded-full bg-[#ff4d4d] text-white text-[15px] font-semibold tracking-wider shadow-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
          >
            REGISTER
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
