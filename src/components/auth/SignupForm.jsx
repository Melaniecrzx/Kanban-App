import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase"
import { useForm } from "react-hook-form";
import { useState } from "react";
import Button from "../ui/Button";
import { Link } from "react-router-dom";
import { getSignupErrorMessage } from "../../utils/authErrors"
import { useAuth } from "../../store/AuthProvider";

export default function SignupForm() {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [error, setError] = useState("");
    const { createUser } = useAuth();



    const onSubmit = async (data) => {
        if (loading) return;
        setLoading(true);
        setError("");
        try {
            await createUser(data.email, data.password);
        } catch (error) {
            setError(getSignupErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="font4 text-black dark:text-white">Create account</h3>
                            <p className="font5 text-grey-828">Let's get you started organising your tasks!</p>
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="email"
                                className="font5 font-bold text-grey-828"
                            >
                                Email Addres
                            </label>
                            <input
                                id='email'
                                type="email"
                                placeholder="mel@example.com"
                                autoFocus
                                className={`outline-none font5 border rounded-md px-4 py-1 text-black dark:text-whit placeholder:text-grey-828 ${errors.email ? "border-red-e45" : "border-grey-e4e"
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
                    </div>


                    <div className="flex flex-col">
                        <label
                            htmlFor="password"
                            className="font5 font-bold text-grey-828"
                        >
                            Password
                        </label>
                        <input
                            id='password'
                            type="password"
                            placeholder="At least 8 characters"
                            className={`outline-none font5 border rounded-md px-4 py-1 text-black dark:text-white placeholder:text-grey-828 ${errors.password ? "border-red-e45" : "border-grey-e4e"
                                }`}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "The password cannot contain less than 8 characters.",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-e45 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor="confirmPassword"
                            className="font5 font-bold text-grey-828"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            className={`outline-none font5 border rounded-md px-4 py-1 text-black dark:text-white placeholder:text-grey-828 ${errors.confirmPassword ? "border-red-e45" : "border-grey-e4e"
                                }`}
                            {...register("confirmPassword", {
                                required: "Password confirmation is required",
                                validate: (value) =>
                                    value === watch("password") || "Passwords do not match",
                            })}
                        />

                        {errors.confirmPassword && (
                            <p className="text-red-e45 text-sm mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                    {error && (
                        <div className="text-red-e45">
                            {error}
                        </div>
                    )}
                    <Button primary disabled={loading} className='full'>
                        Sign Up
                    </Button>
                </div>
            </form>
            <p className="text-center mt-4 text-grey-828">
                Have an account?{' '}
                <Link to="/login" className="text-purple-635 hover:underline">
                    Log in
                </Link>
            </p>
        </div>

    )
}