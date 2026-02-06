import SignupForm from "../components/auth/SignupForm";
import LoginForm from '../components/auth/LoginForm'
import Logo from "../components/ui/Logo";
import ToogleTheme from "../components/ui/ToggleTheme";

export default function AuthPage({ mode = 'signup' }) {
    return (
        <div className="min-h-screen items-center flex flex-col gap-15 justify-center bg-grey-e4e dark:bg-grey-202">
            <div className="ml-8 mt-8">
                <Logo />
            </div>

            <div className="flex flex-col gap-2 justify-center bg-white dark:bg-grey-3e3 p-6 rounded-xl shadow-lg w-120">
                {mode === 'login' ? <LoginForm /> : <SignupForm />}
            </div>

        </div>

    )
}