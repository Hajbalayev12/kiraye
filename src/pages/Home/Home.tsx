import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { FaMapMarkerAlt, FaSlidersH } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";

interface Post {
  id: number;
  price: number;
  address: string;
  regionId: number;
  rooms: number;
  description: string;
  images: string[];
  // Add other fields if needed
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://rashad2002-001-site1.ltempurl.com/api/House/GetAll"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        // Your API returns an object like { items: [...], totalCount, ... }
        setPosts(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.Home}>
      {/* Your existing search bar here */}

      <div className={styles.container}>
        {posts.length === 0 && <p>No posts found.</p>}

        {posts.map((post) => (
          <Link to="/post" key={post.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={
                  post.images && post.images.length > 0
                    ? post.images[0]
                    : "/placeholder.jpg"
                }
                alt={post.address}
              />
              <div className={styles.heart}>
                <AiOutlineHeart />
              </div>
            </div>

            <div className={styles.info}>
              <div className={styles.priceRow}>
                <span>{post.price} AZN</span>
                {/* You can adjust sponsor/time logic here if API provides */}
              </div>

              <div className={styles.location}>
                <FaMapMarkerAlt />
                <span>{post.address}</span>
              </div>

              <div className={styles.details}>
                <span>{post.rooms} rooms</span>
                {/* Add area and floor if you get them from API */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
