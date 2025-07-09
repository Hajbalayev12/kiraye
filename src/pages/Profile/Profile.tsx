import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Image {
  id: number;
  url: string;
}

interface Owner {
  id: string;
  ownerName: string;
  ownerSurname: string;
  contactPhone: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  price: number;
  cityName: string;
  regionName: string;
  images: Image[];
  owner: Owner;
}

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<Owner | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePassError, setChangePassError] = useState("");
  const [changePassSuccess, setChangePassSuccess] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userRole =
          decoded.Role ||
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setRole(userRole);
        if (userRole === "Makler") {
          fetchUserPosts();
        }
      } catch {
        setRole(null);
      }
    }
  }, [token]);

  const fetchUserPosts = async () => {
    if (!token) {
      setError("You must be logged in.");
      setPosts([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://rashad2002-001-site1.ltempurl.com/api/House/GetAllByOwnerId",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.message || "You have no access to this post";
        throw new Error(message);
      }

      const data = await res.json();
      const validPosts = Array.isArray(data.items) ? data.items : [];
      setPosts(validPosts);

      if (validPosts.length > 0 && validPosts[0].owner) {
        setOwnerInfo(validPosts[0].owner);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `https://rashad2002-001-site1.ltempurl.com/api/House/SoftDelete/${postId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete post.");
      }

      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setSuccess("Post deleted successfully.");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      if (!token) throw new Error("Unauthorized");

      const res = await fetch(
        "https://rashad2002-001-site1.ltempurl.com/api/Auth/DeleteAccount",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to delete account");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
      localStorage.removeItem("contactPhone");

      window.dispatchEvent(new Event("storage"));
      alert("Your account was deleted successfully.");
      navigate("/");
    } catch (err: any) {
      alert(`Delete failed: ${err.message || err}`);
    }
  };

  const handleChangePassword = async () => {
    setChangePassError("");
    setChangePassSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setChangePassError("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setChangePassError("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch(
        "https://rashad2002-001-site1.ltempurl.com/api/Auth/ChangePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmNewPassword,
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to change password.");
      }

      setChangePassSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setChangePassError(err.message || "Error changing password.");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userInfoSection}>
        <h2>Your Information</h2>
        <div className={styles.userInfo}>
          <p>
            <strong>Username:</strong> {ownerInfo?.ownerName || "Not available"}
          </p>
          <p>
            <strong>Surname:</strong>{" "}
            {ownerInfo?.ownerSurname || "Not available"}
          </p>
          <p>
            <strong>Email:</strong> {ownerInfo?.email || "Not available"}
          </p>
          <p>
            <strong>Phone:</strong> {ownerInfo?.contactPhone || "Not available"}
          </p>
          <p>
            <strong>Role:</strong> {role || "Unknown"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDeleteAccount}
          className={styles.deleteAccountBtn}
          style={{
            marginTop: "20px",
            backgroundColor: "red",
            color: "white",
            padding: "10px 15px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Delete Account
        </button>
      </div>

      {/* Change Password Section */}
      <div className={styles.changePasswordSection}>
        <h3>Change Password</h3>
        <div className={styles.passwordForm}>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={handleChangePassword}
            className={styles.changePasswordBtn}
          >
            Change Password
          </button>
          {changePassSuccess && (
            <p className={styles.success}>{changePassSuccess}</p>
          )}
          {changePassError && <p className={styles.error}>{changePassError}</p>}
        </div>
      </div>

      {role === "Makler" && (
        <div className={styles.postsSection}>
          <h3>Your Shared Posts</h3>
          {loading && <p>Loading posts...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          {!loading && !error && posts.length === 0 && (
            <p>No posts shared yet.</p>
          )}
          <div className={styles.postGrid}>
            {posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <img
                  src={post.images?.[0]?.url || "/placeholder.jpg"}
                  alt={post.title}
                  className={styles.postImage}
                />
                <h4>{post.title}</h4>
                <p>
                  {post.cityName}, {post.regionName}
                </p>
                <p>{post.price} AZN</p>
                <div className={styles.actions}>
                  <Link
                    to={`/updatepost/${post.id}`}
                    className={styles.updateBtn}
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className={styles.deleteBtn}
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
