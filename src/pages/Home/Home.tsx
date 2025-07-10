import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Home.module.scss";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Image {
  id: number;
  url: string;
}

interface Post {
  id: number;
  title: string;
  price: number;
  address: string;
  regionName: string;
  cityName: string;
  rooms: number;
  description: string;
  images: Image[];
  amenityNames: string[];
}

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pageSize = 4;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const query = new URLSearchParams(location.search);
  const currentPage = Number(query.get("page")) || 1;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");

      try {
        const query = new URLSearchParams(location.search);
        const params = new URLSearchParams();

        if (query.get("Search")) params.append("Search", query.get("Search")!);
        if (query.get("CityId")) params.append("CityId", query.get("CityId")!);
        if (query.get("RegionId"))
          params.append("RegionId", query.get("RegionId")!);
        if (query.get("MinPrice"))
          params.append("MinPrice", query.get("MinPrice")!);
        if (query.get("MaxPrice"))
          params.append("MaxPrice", query.get("MaxPrice")!);
        if (query.get("Rooms")) params.append("Rooms", query.get("Rooms")!);
        if (query.get("SortByPrice"))
          params.append("SortByPrice", query.get("SortByPrice")!);

        // Pagination
        params.append("PageNumber", currentPage.toString());
        params.append("PageSize", pageSize.toString());

        const url = `https://rashad2002-001-site1.ltempurl.com/api/House/Filter?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.items || []);
        setTotalCount(data.totalCount || 0);
      } catch (err: any) {
        setError(err.message || "Xəta baş verdi");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const query = new URLSearchParams(location.search);
    query.set("page", page.toString());
    navigate(`?${query.toString()}`, { replace: true });
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
                  post.images && post.images.length > 0
                    ? post.images[0].url
                    : "/placeholder.jpg"
                }
                alt={post.address}
              />
            </div>

            <div className={styles.info}>
              <div className={styles.priceRow}>
                <span>{post.price} AZN/Gün</span>
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
