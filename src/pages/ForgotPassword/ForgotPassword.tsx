import { useState } from "react";
import styles from "./ForgotPassword.module.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    try {
      const response = await fetch(
        "https://your-backend.com/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setMessage("If this email is registered, a reset link has been sent.");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <form className={styles.forgotPasswordForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Forgot Password</h2>

        {message && <p className={styles.success}>{message}</p>}
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="email">Enter your email address</label>
          <input
            type="email"
            id="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className={styles.bottomText}>
          Remembered your password? <a href="/signin">Sign In</a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
