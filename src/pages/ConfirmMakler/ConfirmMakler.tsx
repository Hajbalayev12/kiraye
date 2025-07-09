import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./ConfirmMakler.module.scss";

const ConfirmMakler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("sessionId") || "";
  const hasConfirmed = useRef(false); // 🔐 prevent multiple triggers

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is missing in the URL.");
      return;
    }

    const alreadyConfirmed = sessionStorage.getItem(
      `makler_success_${sessionId}`
    );
    if (alreadyConfirmed) {
      setMessage(alreadyConfirmed);
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
      return;
    }

    // Prevent double request
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmPayment = async () => {
      setLoading(true);
      setMessage("");
      setError("");

      try {
        const response = await fetch(
          `https://rashad2002-001-site1.ltempurl.com/api/Auth/ConfirmMakler?sessionId=${encodeURIComponent(
            sessionId
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const text = await response.text();

        if (!response.ok) {
          if (
            text.includes("already taken") ||
            text.includes("Registration data not found")
          ) {
            setMessage(text);
          } else {
            throw new Error(text || "Payment confirmation failed.");
          }
        } else {
          setMessage(text || "Payment confirmed successfully.");
          sessionStorage.setItem(`makler_success_${sessionId}`, text);
          setTimeout(() => {
            navigate("/signin");
          }, 4000);
        }
      } catch (err: any) {
        setError(err.message || "Payment confirmation failed.");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, navigate]);

  return (
    <div className={styles.confirmContainer}>
      <h2>Payment Confirmation</h2>
      {loading && <p>Processing payment confirmation...</p>}
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ConfirmMakler;
