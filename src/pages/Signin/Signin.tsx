import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import for redirect
import styles from "./SignIn.module.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import * as jwt_decode from "jwt-decode";

const SignIn = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate(); // ✅ initialize

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // ✅ Debug: Log input values
    console.log("Logging in with:");
    console.log("UsernameOrEmail:", usernameOrEmail);
    console.log("Password:", password);

    try {
      const response = await fetch(
        "https://rashad2002-001-site1.ltempurl.com/api/Auth/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UsernameOrEmail: usernameOrEmail,
            Password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response data:", data);

      if (!response.ok) {
        const message =
          data.message ||
          (data.errors
            ? Object.values(data.errors).flat().join(" ")
            : "Login failed");
        throw new Error(message);
      }

      const token = data.token || data.accessToken || data.access_token;
      if (!token) throw new Error("No token received from server");

      localStorage.setItem("token", token);

      // Decode token to get user info:
      // const decoded = (jwt_decode as any)(token);
      // console.log("Decoded token:", decoded);

      // Save user info (adjust keys based on your token's payload)
      // localStorage.setItem(
      //   "userEmail",
      //   decoded[
      //     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      //   ] || ""
      // );
      // localStorage.setItem(
      //   "userName",
      //   decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      //     ""
      // );

      navigate("/"); // ✅ redirect to homepage
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signInContainer}>
      <form className={styles.signInForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Sign In to Your Account</h2>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="usernameOrEmail">Username or Email</label>
          <input
            type="text"
            id="usernameOrEmail"
            placeholder="Enter username or email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className={styles.forgotPassword}>
          <a href="/forgotpassword">Forgot Password?</a>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className={styles.bottomText}>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
