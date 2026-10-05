import { useState } from "react";
import axios from "axios";
import "./App.css";
import { useTranslation } from "react-i18next";

const AUTH_URL = "http://localhost:3000/auth";

function App() {
  const { t, i18n } = useTranslation();
  const isArabic = (i18n.resolvedLanguage || i18n.language || "")
    .toLowerCase()
    .startsWith("ar");
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
      setStatus({ type: "error", message: t("Your passwords do not match.") });
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
          ? t("Your account has been created. You can now sign in.")
          : t("You have signed in successfully."),
      });
    } catch (error) {
      const apiMessage = axios.isAxiosError(error)
        ? error.response?.data?.message
        : null;
      const message = Array.isArray(apiMessage)
        ? apiMessage.join(" ")
        : typeof apiMessage === "string"
          ? apiMessage
          : t("Unable to connect. Please try again.");
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="auth-page"
      style={{ direction: isArabic ? "rtl" : "ltr" }}
    >
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">{t("YOUR ACCOUNT")}</p>
        <h1 id="auth-title">
          {isRegistering ? t("Create your account") : t("Welcome back")}
        </h1>
        <p className="subtitle">
          {isRegistering
            ? t("Sign up to get started.")
            : t("Sign in to continue to your account.")}
        </p>

        <div
          className="mode-switch"
          role="group"
          aria-label={t("Account access") || "Account access"}
        >
          <button
            className={mode === "login" ? "mode-button active" : "mode-button"}
            type="button"
            aria-pressed={mode === "login"}
            onClick={() => changeMode("login")}
          >
            {t("Sign in")}
          </button>
          <button
            className={
              mode === "register" ? "mode-button active" : "mode-button"
            }
            type="button"
            aria-pressed={mode === "register"}
            onClick={() => changeMode("register")}
          >
            {t("Create account")}
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="username">{t("Username")}</label>
          <input
            autoComplete="username"
            id="username"
            name="username"
            onChange={updateField}
            placeholder={t("Your username")}
            required
            value={form.username}
          />

          {isRegistering && (
            <>
              <label htmlFor="email">{t("Email address")}</label>
              <input
                autoComplete="email"
                id="email"
                name="email"
                onChange={updateField}
                placeholder={t("you@example.com")}
                required
                type="email"
                value={form.email}
              />
            </>
          )}

          <label htmlFor="password">{t("Password")}</label>
          <input
            autoComplete={isRegistering ? "new-password" : "current-password"}
            id="password"
            name="password"
            onChange={updateField}
            placeholder={t("Enter your password")}
            required
            type="password"
            value={form.password}
          />

          {isRegistering && (
            <>
              <label htmlFor="confirmPassword">{t("Confirm password")}</label>
              <input
                autoComplete="new-password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={updateField}
                placeholder={t("Enter your password again")}
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
              ? t("Please wait...")
              : isRegistering
                ? t("Create account")
                : t("Sign in")}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <p className="switch-prompt">
          {isRegistering ? t("Already have an account?") : t("New here?")}{" "}
          <button
            className="text-button"
            onClick={() => changeMode(isRegistering ? "login" : "register")}
            type="button"
          >
            {isRegistering ? t("Sign in") : t("Create an account")}
          </button>
          <button
            type="button"
            onClick={() => {
              void i18n.changeLanguage(isArabic ? "en" : "ar");
            }}
          >
            {t(isArabic ? "Change language to English" : "Change language to Arabic")}
          </button>
        </p>
      </section>
      <p className="page-note">{t("A simple, secure place to get started.")}</p>
    </main>
  );
}

export default App;
