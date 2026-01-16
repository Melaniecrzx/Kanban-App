import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { useAuth } from "../../store/AuthProvider";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getLoginErrorMessage } from "../../utils/authErrors"


export default function LoginForm() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { loginUser } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data) => {
        if (loading) return;
        setLoading(true);
        setError("");
        try {
            await loginUser(data.email, data.password)
        } catch (error) {
            setError(getLoginErrorMessage(error.code))
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit(onSubmit)} className="flex">
                <div className="flex flex-col gap-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            autoFocus
                            className={`outline-none border w-full placeholder:text-grey-828 ${errors.email ? "border-red-e45" : "border-grey-e4e"
                                }`}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "Please provide a valid email address."
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-red-e45 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className={`outline-none border w-full placeholder:text-grey-828 ${errors.password ? "border-red-e45" : "border-grey-e4e"
                                }`}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Please provide a valid password.",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-e45 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    {error && (
                        <div className="text-red-e45">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-2">
                        <Button primary disabled={loading}>
                            Log In
                        </Button>
                        <Button secondary>
                            Continue as a Guest
                        </Button>
                    </div>
                </div>
            </form>
            <p className="text-grey-828 text-center ">
                Need an account?{' '}
                <Link to="/signup" className="text-purple-635 hover:underline">
                    Sign Up
                </Link>
            </p>
        </div>


    )
}