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
        "https://rashad2002-001-site1.ltempurl.com/api/Auth/ForgotPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const text = await response.text();

      if (!response.ok) {
        let errorMsg = text;
        try {
          const data = JSON.parse(text);
          errorMsg = data.message || text;
        } catch {
          // If not JSON, keep original text
        }
        throw new Error(errorMsg);
      }

      setMessage(
        text ||
          "If this email is registered, a reset link has been sent to your email."
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
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
