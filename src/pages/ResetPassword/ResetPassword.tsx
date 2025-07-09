import { useState, useEffect } from "react";
import styles from "./ResetPassword.module.scss";

const ResetPassword = () => {
  // Extract raw email and token without decoding
  const rawQuery = window.location.search;
  const params = new URLSearchParams(rawQuery);

  const rawEmail = params.get("email") || "";
  const rawToken = rawQuery.match(/token=([^&]+)/)?.[1] || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessage("");
    setErrorMsg("");
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    if (!rawEmail || !rawToken) {
      setErrorMsg("Missing token or email in the URL.");
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (newPassword.trim().length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    const payload = {
      email: rawEmail,
      token: rawToken,
      newPassword: newPassword.trim(),
      confirmPassword: confirmPassword.trim(),
    };

    console.log("Sending to backend:", payload);

    try {
      setLoading(true);

      const response = await fetch(
        "https://rashad2002-001-site1.ltempurl.com/api/Auth/ResetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Password reset failed.");
      }

      setMessage("Password has been reset successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    loading ||
    !newPassword.trim() ||
    newPassword.trim() !== confirmPassword.trim();

  return (
    <div className={styles.resetContainer}>
      <form className={styles.resetForm} onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        {message && <p className={styles.success}>{message}</p>}
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={styles.submitBtn}
        >
          {loading ? "Submitting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
