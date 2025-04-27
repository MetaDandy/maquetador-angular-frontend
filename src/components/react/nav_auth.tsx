import { useAuthStore } from "../../utils/auth_store";

export default function NavAuth() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <>
      {isAuthenticated ? (
        <button onClick={logout} className="btn btn-error">
          Logout
        </button>
      ) : (
        <div className="space-x-2">
          <a href="/login" className="btn btn-primary btn-soft">
            Sign In
          </a>
          <a href="/signup" className="btn btn-secondary btn-soft">
            Sign Up
          </a>
        </div>
      )}
    </>
  )
}