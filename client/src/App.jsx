import { useState } from "react";
import axios from "axios";
import "./App.css";

const AUTH_URL = "http://localhost:3000/auth";

function App() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegistering = mode === "register";

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setStatus({ type: "", message: "" });
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setStatus({ type: "", message: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (isRegistering && form.password !== form.confirmPassword) {
      setStatus({ type: "error", message: "Your passwords do not match." });
      return;
    }

    const payload = isRegistering
      ? form
      : { username: form.username, password: form.password };

    setIsSubmitting(true);
    try {
      await axios.post(`${AUTH_URL}/${mode}`, payload);
      setStatus({
        type: "success",
        message: isRegistering
          ? "Your account has been created. You can now sign in."
          : "You have signed in successfully.",
      });
    } catch (error) {
      const apiMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;
      const message = Array.isArray(apiMessage)
        ? apiMessage.join(" ")
        : typeof apiMessage === "string"
          ? apiMessage
          : "Unable to connect. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">YOUR ACCOUNT</p>
        <h1 id="auth-title">
          {isRegistering ? "Create your account" : "Welcome back"}
        </h1>
        <p className="subtitle">
          {isRegistering
            ? "Sign up to get started."
            : "Sign in to continue to your account."}
        </p>

        <div className="mode-switch" role="group" aria-label="Account access">
          <button
            className={mode === "login" ? "mode-button active" : "mode-button"}
            type="button"
            aria-pressed={mode === "login"}
            onClick={() => changeMode("login")}
          >
            Sign in
          </button>
          <button
            className={
              mode === "register" ? "mode-button active" : "mode-button"
            }
            type="button"
            aria-pressed={mode === "register"}
            onClick={() => changeMode("register")}
          >
            Create account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            autoComplete="username"
            id="username"
            name="username"
            onChange={updateField}
            placeholder="Your username"
            required
            value={form.username}
          />

          {isRegistering && (
            <>
              <label htmlFor="email">Email address</label>
              <input
                autoComplete="email"
                id="email"
                name="email"
                onChange={updateField}
                placeholder="you@example.com"
                required
                type="email"
                value={form.email}
              />
            </>
          )}

          <label htmlFor="password">Password</label>
          <input
            autoComplete={isRegistering ? "new-password" : "current-password"}
            id="password"
            name="password"
            onChange={updateField}
            placeholder="Enter your password"
            required
            type="password"
            value={form.password}
          />

          {isRegistering && (
            <>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                autoComplete="new-password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={updateField}
                placeholder="Enter your password again"
                required
                type="password"
                value={form.confirmPassword}
              />
            </>
          )}

          {status.message && (
            <p className={`form-message ${status.type}`} role="status">
              {status.message}
            </p>
          )}

          <button
            className="submit-button"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Please wait..."
              : isRegistering
                ? "Create account"
                : "Sign in"}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="switch-prompt">
          {isRegistering ? "Already have an account?" : "New here?"}{" "}
          <button
            className="text-button"
            onClick={() => changeMode(isRegistering ? "login" : "register")}
            type="button"
          >
            {isRegistering ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
      <p className="page-note">A simple, secure place to get started.</p>
    </main>
  );
}

export default App;
