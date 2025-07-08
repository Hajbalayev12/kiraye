import { useState } from "react";
import styles from "./ResetPassword.module.scss";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>(); // assuming token passed in URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!newPassword || !repeatPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Example API call — replace URL and body as per your backend API
      const response = await fetch(
        `https://yourapi.com/api/auth/resetpassword/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to reset password.");
      }

      setMessage("Password reset successfully! Redirecting to login...");
      setNewPassword("");
      setRepeatPassword("");

      setTimeout(() => {
        navigate("/signin"); // redirect to sign in page after success
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetPasswordPage}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Set New Password</h2>

        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}

        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          required
          minLength={6}
        />

        <label htmlFor="repeatPassword">Repeat New Password</label>
        <input
          type="password"
          id="repeatPassword"
          placeholder="Repeat new password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          disabled={loading}
          required
          minLength={6}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
