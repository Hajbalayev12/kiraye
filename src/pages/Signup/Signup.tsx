import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonePrefix: "50",
    phoneNumber: "",
    role: "0",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phoneNumber" && !/^\d{0,7}$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (formData.phoneNumber.length !== 7) {
      setErrorMsg("Phone number must be exactly 7 digits.");
      return;
    }

    const fullPhone = `+994${formData.phonePrefix}${formData.phoneNumber}`;

    setLoading(true);

    try {
      const response = await fetch(
        "https://rashad2002-001-site1.ltempurl.com/api/Auth/Register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            surname: formData.surname.trim(),
            email: formData.email.trim(),
            phoneNumber: fullPhone,
            userName: formData.userName.trim(),
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: Number(formData.role),
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      let data: any;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || "Registration failed with unknown error");
        }
        setSuccessMsg(text);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || JSON.stringify(data?.errors) || "Registration failed"
        );
      }

      // Makler payment flow
      if (Number(formData.role) === 1 && data?.url) {
        // Save form data in localStorage for confirmation after payment
        localStorage.setItem("name", formData.name.trim());
        localStorage.setItem("surname", formData.surname.trim());
        localStorage.setItem("email", formData.email.trim());
        localStorage.setItem("phoneNumber", fullPhone);
        localStorage.setItem("userName", formData.userName.trim());
        localStorage.setItem("password", formData.password);
        localStorage.setItem("confirmPassword", formData.confirmPassword);
        localStorage.setItem("role", formData.role);

        // Redirect to payment URL
        window.location.href = data.url;
        return;
      }

      // Normal user success flow
      setSuccessMsg("Registration successful! Redirecting to Sign In...");
      setTimeout(() => {
        navigate("/signin");
      }, 1500);

      setFormData({
        name: "",
        surname: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phonePrefix: "50",
        phoneNumber: "",
        role: "0",
      });
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signUpContainer}>
      <form className={styles.signUpForm} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.title}>Create an Account</h2>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
        {successMsg && <p className={styles.success}>{successMsg}</p>}

        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input
            name="name"
            placeholder="John"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Surname</label>
          <input
            name="surname"
            placeholder="Doe"
            value={formData.surname}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Username</label>
          <input
            name="userName"
            placeholder="johndoe123"
            value={formData.userName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Phone Number</label>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>+994</span>
            <select
              name="phonePrefix"
              value={formData.phonePrefix}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="50">50</option>
              <option value="51">51</option>
              <option value="55">55</option>
              <option value="70">70</option>
              <option value="77">77</option>
            </select>
            <input
              type="text"
              name="phoneNumber"
              placeholder="1234567"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength={7}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="0">User</option>
            <option value="1">Makler</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
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

        <div className={styles.inputGroup}>
          <label>Confirm Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowConfirm(!showConfirm)}
              style={{ cursor: "pointer" }}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>

        <p className={styles.bottomText}>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
