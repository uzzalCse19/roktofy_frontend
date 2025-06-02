import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { loginUser } = useAuthContext(); 
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await loginUser(data);
      navigate("/");
    } catch (error) {
      console.log("Login Failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Removed all message displays */}
          <h2 className="card-title text-2xl font-bold">Sign in</h2>
          <p className="text-base-content/70">
            Enter your email and password to access your account
          </p>

          <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.password ? "input-error" : ""
                }`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              )}
              <label className="label">
                <Link 
                  to="/password/reset" 
                  className="label-text-alt link link-primary"
                >
                  Forgot password?
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          <div className="flex flex-col items-center mt-4 space-y-2">
            <p className="text-base-content/70">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="link link-primary">
                Sign up
              </Link>
            </p>
            <Link 
              to="/password/reset" 
              className="btn btn-ghost btn-sm text-primary"
            >
              Reset Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;