import { useState } from "react";
import { Mail, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import useAuthContext from "../../hooks/useAuthContext";

const ResendActivation = () => {
  const { resendActivationEmail, errorMsg, isLoading } = useAuthContext();
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    const result = await resendActivationEmail(email);
    if (result.success) {
      setSuccessMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-xl p-6 space-y-5">
        <div className="text-center">
          <Mail className="mx-auto h-10 w-10 text-primary mb-2" />
          <h2 className="text-2xl font-bold">Resend Activation Email</h2>
          <p className="text-base-content/70">Enter your email to resend the activation link.</p>
        </div>

        {errorMsg && (
          <div className="alert alert-error text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 stroke-current" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success text-sm">
            <CheckCircle className="h-5 w-5 shrink-0 stroke-current" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleResend} className="space-y-4">
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email Address</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full flex justify-center items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            {isLoading ? "Sending..." : "Resend Activation Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResendActivation;
