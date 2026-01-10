import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import LoginBackground from "../../assets/images/login-illustration.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setResetToken("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      
      if (response.data.success) {
        setSuccess(true);
        // In development, show the token
        if (response.data.resetToken) {
          setResetToken(response.data.resetToken);
        }
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-5xl bg-white flex rounded-2xl overflow-hidden shadow-xl">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-500 text-white p-10 relative">
          <img
            src={LoginBackground}
            alt="Forgot Password"
            className="w-3/4 object-contain mb-6"
          />
          <h2 className="text-3xl font-bold">Reset Your Password</h2>
          <p className="opacity-80 mt-2">We'll help you get back into your account</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 p-8 md:p-12">
          <h2 className="text-3xl font-bold">Forgot Password?</h2>
          <p className="text-gray-600 mt-1 mb-5">
            Enter your email address and we'll send you a link to reset your password
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
              <p className="font-semibold mb-2">
                If an account with that email exists, a password reset link has been sent.
              </p>
              {resetToken && (
                <div className="mt-3 p-2 bg-white rounded border border-green-300">
                  <p className="text-xs text-gray-600 mb-1">
                    Development mode - Reset token:
                  </p>
                  <p className="text-xs font-mono break-all">{resetToken}</p>
                  <button
                    onClick={() => {
                      navigate(`/reset-password?token=${resetToken}`);
                    }}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    Click here to reset password
                  </button>
                </div>
              )}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <RouterLink
              to="/login"
              className="text-blue-600 text-sm hover:underline"
            >
              Back to Sign In
            </RouterLink>
          </div>

          <p className="text-center mt-4 text-sm text-gray-500">
            Don't have an account?{" "}
            <RouterLink
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up here
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

