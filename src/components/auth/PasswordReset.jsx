import { useForm } from "react-hook-form";
import { useState } from "react";
import apiClient from "../../services/http";
import Alert from "../common/Alert";

const PasswordReset = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await apiClient.post("/auth/users/reset_password/", data);
      setSuccessMsg(" Please check your email to reset your password.");
    } catch (error) {
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>

    
        {errorMsg && <Alert error={errorMsg} />}

       
        {successMsg && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm mb-3">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-error text-sm">{errors.email.message}</span>
            )}
          </div>
          <button className="btn btn-primary w-full">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
