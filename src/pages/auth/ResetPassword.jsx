import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../utils/axios";
import LoginBackground from "../../assets/images/login-illustration.jpg";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) return;

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/reset-password", {
        token,
        password: formData.password,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field) => {
    if (!formTouched[field]) return "";
    return errors[field] || "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-5xl bg-white flex rounded-2xl overflow-hidden shadow-xl">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-500 text-white p-10 relative">
          <img
            src={LoginBackground}
            alt="Reset Password"
            className="w-3/4 object-contain mb-6"
          />
          <h2 className="text-3xl font-bold">Set New Password</h2>
          <p className="opacity-80 mt-2">Choose a strong password for your account</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 p-8 md:p-12">
          <h2 className="text-3xl font-bold">Reset Password</h2>
          <p className="text-gray-600 mt-1 mb-5">
            Enter your new password below
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
              Password has been reset successfully! Redirecting to login...
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              {/* Password */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    onBlur={() =>
                      setFormTouched((prev) => ({ ...prev, password: true }))
                    }
                    autoComplete="new-password"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
                      getFieldError("password")
                        ? "border-red-500 ring-red-200"
                        : "focus:ring-blue-400"
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-gray-500"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {getFieldError("password") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getFieldError("password")}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    onBlur={() =>
                      setFormTouched((prev) => ({
                        ...prev,
                        confirmPassword: true,
                      }))
                    }
                    autoComplete="new-password"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
                      getFieldError("confirmPassword")
                        ? "border-red-500 ring-red-200"
                        : "focus:ring-blue-400"
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-2 text-gray-500"
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {getFieldError("confirmPassword") && (
                  <p className="text-red-500 text-xs mt-1">
                    {getFieldError("confirmPassword")}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Password must be at least 6 characters long
              </p>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
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

          {!token && (
            <div className="mt-4 text-center">
              <RouterLink
                to="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Request a new reset link
              </RouterLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

