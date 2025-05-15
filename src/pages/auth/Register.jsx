import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AlertCircle, CheckCircle, Mail } from "lucide-react";
import Alert from "../../components/common/Alert";
import useAuthContext from "../../hooks/useAuthContext";

const Register = () => {
    const { registerUser, errorMsg } = useAuthContext();
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { confirm_password, ...userData } = data;
        
        try {
            const response = await registerUser(userData);
            if (response?.success) {
                setSuccessMsg(response.message);
            }
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const formFields = [
        {
            id: "first_name",
            label: "First Name",
            type: "text",
            placeholder: "Enter first name",
            validation: { required: "First name is required" }
        },
        {
            id: "last_name",
            label: "Last Name",
            type: "text",
            placeholder: "Enter last name",
            validation: { required: "Last name is required" }
        },
        {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter email address",
            validation: { required: "Email is required" }
        },
        {
            id: "address",
            label: "Address",
            type: "text",
            placeholder: "Enter full address",
            validation: { required: "Address is required" }
        },
        {
            id: "phone",
            label: "Phone Number",
            type: "text",
            placeholder: "Enter phone number",
            validation: { required: "Phone number is required" }
        },
        {
            id: "age",
            label: "Age",
            type: "number",
            placeholder: "Enter your age",
            validation: {
                required: "Age is required",
                min: { value: 18, message: "Minimum age is 18" },
                max: { value: 100, message: "Maximum age is 100" }
            }
        }
    ];

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    {errorMsg && <Alert error={errorMsg} />}
                    
                    {successMsg && (
                        <>
                            <div role="alert" className="alert alert-success">
                                <CheckCircle className="h-6 w-6 shrink-0 stroke-current" />
                                <span>{successMsg}</span>
                            </div>
    <div className="mt-4 text-center">
    <button 
        onClick={() => navigate('/resend-activation')}
        className="inline-flex items-center gap-2 rounded-xl border border-primary bg-primary text-white px-4 py-2 text-sm font-semibold transition hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
        <Mail className="h-4 w-4" />
        Resend Activation Email
    </button>
</div>
                        </>
                    )}

                    <div className="mb-4">
                        <h2 className="card-title text-2xl font-bold">Sign Up</h2>
                        <p className="text-base-content/70">
                            Create an account to get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {formFields.map((field) => (
                            <div key={field.id} className="form-control">
                                <label className="label" htmlFor={field.id}>
                                    <span className="label-text">{field.label}</span>
                                </label>
                                <input
                                    id={field.id}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    className="input input-bordered w-full"
                                    {...register(field.id, field.validation)}
                                />
                                {errors[field.id] && (
                                    <span className="label-text-alt text-error flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors[field.id].message}
                                    </span>
                                )}
                            </div>
                        ))}

                        <div className="form-control">
                            <label className="label" htmlFor="user_type">
                                <span className="label-text">User Type</span>
                            </label>
                            <select
                                id="user_type"
                                className="select select-bordered w-full"
                                {...register("user_type", {
                                    required: "User type is required",
                                })}
                            >
                                <option value="">Select user type</option>
                                <option value="donor">Donor</option>
                                <option value="recipient">Recipient</option>
                                <option value="both">Both</option>
                            </select>
                            {errors.user_type && (
                                <span className="label-text-alt text-error flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.user_type.message}
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
                                placeholder="Enter password"
                                className="input input-bordered w-full"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                            />
                            {errors.password && (
                                <span className="label-text-alt text-error flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label" htmlFor="confirmPassword">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                className="input input-bordered w-full"
                                {...register("confirm_password", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === watch("password") || "Passwords do not match",
                                })}
                            />
                            {errors.confirm_password && (
                                <span className="label-text-alt text-error flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.confirm_password.message}
                                </span>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-2">
                            Register
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-base-content/70">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;