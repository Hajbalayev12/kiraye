import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";

interface Post {
  id: number;
  price: number;
  address: string;
  regionName: string;
  cityName: string;
  rooms: number;
  description: string;
  imgUrls: string[]; // Correct key for images from your API
  amenityNames: string[]; // If you want to use amenities later
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
      {/* You can add your search bar or filters here */}

      <div className={styles.container}>
        {posts.length === 0 && <p>No posts found.</p>}

        {posts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={
                  post.imgUrls && post.imgUrls.length > 0
                    ? post.imgUrls[0]
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
                {/* You can add sponsor/time info here */}
              </div>

              <div className={styles.location}>
                <FaMapMarkerAlt />
                <span>
                  {post.address}, {post.regionName}, {post.cityName}
                </span>
              </div>

              <div className={styles.details}>
                <span>{post.rooms} rooms</span>
                {/* Add more details if available */}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
