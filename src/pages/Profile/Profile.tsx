import { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { Link } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  price: number;
  cityName: string;
  regionName: string;
  imgUrls: string[];
}

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userPhone = localStorage.getItem("userPhone");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!token) {
        setError("You must be logged in.");
        setPosts([]);
        setLoading(false);
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
        if (!Array.isArray(data.items)) {
          throw new Error("Unexpected response data");
        }

        setPosts(data.items);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [token]);

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
        {!loading && !error && posts.length === 0 && (
          <p>No posts shared yet.</p>
        )}

        <div className={styles.postGrid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <img
                src={post.imgUrls?.[0] || "/placeholder.jpg"}
                alt={post.title}
                className={styles.postImage}
              />
              <h4>{post.title}</h4>
              <p>
                {post.cityName}, {post.regionName}
              </p>
              <p>{post.price} AZN</p>
              <Link to={`/updatepost/${post.id}`} className={styles.updateBtn}>
                Update Post
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
