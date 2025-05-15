import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiClient from "../../services/http";
import Alert from "../common/Alert";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await apiClient.post("/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password: data.password,
        re_new_password: data.confirm_password,
      });
      setSuccessMsg("✅ Password has been reset successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setErrorMsg("Invalid or expired token, or password mismatch.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Set a New Password</h2>

        {/* ✅ Error message using Alert */}
        {errorMsg && <Alert error={errorMsg} />}

        {/* ✅ Success message shown without Alert */}
        {successMsg && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm mb-3">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              {...register("password", { required: "New password is required" })}
            />
            {errors.password && (
              <span className="text-error text-sm">{errors.password.message}</span>
            )}
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input
              type="password"
              className="input input-bordered w-full"
              {...register("confirm_password", {
                required: "Please confirm your password",
              })}
            />
            {errors.confirm_password && (
              <span className="text-error text-sm">{errors.confirm_password.message}</span>
            )}
          </div>
          <button className="btn btn-primary w-full">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
