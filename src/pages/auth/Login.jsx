import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError, loadUser } from "../../store/slices/authSlice";
import LoginBackground from "../../assets/images/login-illustration.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState({
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");

    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    // Normalize email to lowercase
    const normalizedFormData = {
      ...formData,
      email: formData.email.toLowerCase().trim(),
    };

    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", normalizedFormData.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const loginResult = await dispatch(login(normalizedFormData)).unwrap();
      if (loginResult.token && loginResult.user) {
        await dispatch(loadUser()).unwrap();
        navigate("/dashboard");
      }
    } catch (err) {
      setErrors({ submit: err.message || "Login failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field) => {
    if (!formTouched[field]) return "";
    return errors[field] || "";
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-5xl bg-white flex rounded-2xl overflow-hidden shadow-xl">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-500 text-white p-10 relative">
          <img
            src={LoginBackground}
            alt="Login"
            className="w-3/4 object-contain mb-6"
          />
          <h2 className="text-3xl font-bold">Welcome to CPMT</h2>
          <p className="opacity-80 mt-2">Manage your projects easily</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 p-8 md:p-12">
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-gray-600 mt-1 mb-5">
            Enter your credentials to access your account
          </p>

          {(error || errors.submit) && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
              {error || errors.submit}
            </p>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                autoComplete="email"
                onBlur={() =>
                  setFormTouched((prev) => ({ ...prev, email: true }))
                }
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
                  getFieldError("email")
                    ? "border-red-500 ring-red-200"
                    : "focus:ring-blue-400"
                }`}
              />
              {getFieldError("email") && (
                <p className="text-red-500 text-xs mt-1">
                  {getFieldError("email")}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <label className="block text-gray-700 mb-1 font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onBlur={() =>
                    setFormTouched((prev) => ({ ...prev, password: true }))
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${
                    getFieldError("password")
                      ? "border-red-500 ring-red-200"
                      : "focus:ring-blue-400"
                  }`}
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

            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center mt-3 mb-4">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <RouterLink
                to="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot password?
              </RouterLink>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Google login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-2 rounded-lg flex justify-center gap-2 items-center hover:bg-gray-100"
          >
            <span>🔵</span>
            <span>Sign in with Google</span>
          </button>

          <p className="text-center mt-6 text-sm text-gray-500">
            Don’t have an account?{" "}
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

export default Login;
