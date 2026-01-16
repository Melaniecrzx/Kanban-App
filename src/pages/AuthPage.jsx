import SignupForm from "../components/auth/SignupForm";
import LoginForm from '../components/auth/LoginForm'
import Logo from "../components/ui/Logo";

export default function AuthPage({ mode = 'signup' }) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            {mode === 'login' ? <LoginForm /> : <SignupForm />}
        </div>
    )
}