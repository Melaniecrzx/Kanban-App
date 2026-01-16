import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./store/AuthProvider";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const router = createBrowserRouter([
     {
      path: "/",
      element: user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
    },
    {
      path: "/signup",
      element: user ? <Navigate to="/dashboard" /> : <AuthPage mode="signup" />,
    },
    {
      path: "/login",
      element: user ? <Navigate to="/dashboard" /> : <AuthPage mode="login" />,
    },
    {
      path: "/dashboard",
      element: user ? <Dashboard /> : <Navigate to="/login" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;