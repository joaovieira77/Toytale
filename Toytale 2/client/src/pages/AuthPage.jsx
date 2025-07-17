import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  {BackgroundLines } from "../components/background";


export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    firstName: "",
    lastName: "",
    numChildren: 0,
    childrenAges: []
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    const endpoint = mode === "signup" ? "/api/signup" : "/api/login";

    const payload =
      mode === "signup"
        ? {
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            firstName: form.firstName,
            lastName: form.lastName,
            location: form.location,
            childrenAges: form.childrenAges
          }
        : {
            email: form.email,
            password: form.password
          };

    try {
      const res = await fetch(`http://localhost:3032${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      localStorage.setItem("userId", data.userId);
      if (mode === "signup") {
        localStorage.setItem("firstName", form.firstName);
        localStorage.setItem("lastName", form.lastName);
        localStorage.setItem("location", form.location);
      }

      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChildrenCount = (e) => {
    const count = parseInt(e.target.value);
    setForm((prev) => ({
      ...prev,
      numChildren: count,
      childrenAges: Array(count).fill(1)
    }));
  };

  const updateChildAge = (index, value) => {
    const updated = [...form.childrenAges];
    updated[index] = parseInt(value);
    setForm((prev) => ({ ...prev, childrenAges: updated }));
  };

  return (
   <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-white font-sans">

  {/* Auth Container */}
  <div className="flex items-center justify-center h-full px-4 relative z-10">
    
    <div className="w-full max-w-sm bg-white/70 backdrop-blur-lg shadow-2xl rounded-xl p-8 transition-all duration-300 border border-gray-200">
      
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center tracking-tight">
        {mode === "login" ? "Welcome Back!" : "Create an Account"}
      </h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.email}
        onChange={handleChange}
        required
      />

      {/* Password */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-2.5 text-sm text-teal-700 hover:underline"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {mode === "signup" && (
        <>
          {/* Confirm Password */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-sm text-teal-700 hover:underline"

            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.location}
            onChange={handleChange}
            required
          />

          <select
            name="numChildren"
            value={form.numChildren}
            onChange={handleChildrenCount}
            className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value={0}>Number of children</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          {form.childrenAges.map((age, index) => (
            <select
              key={index}
              value={age}
              onChange={(e) => updateChildAge(index, e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {[...Array(18)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>   
          ))}
        </>
      )}

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full  text-white py-3 rounded-lg hover:opacity-90   transition-all font-semibold"
      
                  style={{ backgroundColor: '#278d80' }}
>
        {mode === "login" ? "Log In" : "Sign Up"}
      </button>

      <p className="text-sm text-center mt-4 text-gray-700">
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-teal-700 hover:underline font-medium"
        >
          {mode === "login" ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  </div>
</div>
  );
}