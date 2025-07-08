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
  imgUrls: string[];
  amenityNames: string[];
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const pageSize = 4; // Show 3 posts per page

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://rashad2002-001-site1.ltempurl.com/api/House/Filter?PageNumber=${currentPage}&PageSize=${pageSize}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.items || []);
        setTotalCount(data.totalCount || 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.Home}>
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
              </div>

              <div className={styles.location}>
                <FaMapMarkerAlt />
                <span>
                  {post.address}, {post.regionName}, {post.cityName}
                </span>
              </div>

              <div className={styles.details}>
                <span>{post.rooms} rooms</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? styles.activePage : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
