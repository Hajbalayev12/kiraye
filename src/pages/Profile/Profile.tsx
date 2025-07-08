import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { Link } from "react-router-dom";

interface Image {
  id: number;
  url: string;
}

interface Post {
  id: number;
  title: string;
  price: number;
  cityName: string;
  regionName: string;
  images: Image[];
}

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userPhone = localStorage.getItem("userPhone");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserPosts();
  }, []);

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
        const message = errorData?.message || "Failed to fetch user posts";
        throw new Error(message);
      }

      const data = await res.json();
      setPosts(Array.isArray(data.items) ? data.items : []);
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

      // Remove deleted post from local state
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      setSuccess("Post deleted successfully.");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.userInfoSection}>
        <h2>Your Information</h2>
        <div className={styles.userInfo}>
          <p>
            <strong>Username:</strong> {userName || "User"}
          </p>
          <p>
            <strong>Email:</strong> {userEmail || "No email available"}
          </p>
          <p>
            <strong>Phone:</strong> {userPhone || "No phone number available"}
          </p>
        </div>
      </div>

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
    </div>
  );
};

export default Profile;
