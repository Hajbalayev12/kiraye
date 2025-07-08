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

  // Parse query params from URL
  const query = new URLSearchParams(location.search);

  const pageSize = 4;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  // Current page from URL or default 1
  const currentPage = Number(query.get("page")) || 1;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");

      try {
        // Build API query params with filters from URL + pagination
        const params = new URLSearchParams();

        // Include filters if exist in URL
        if (query.get("search")) params.append("Search", query.get("search")!);
        if (query.get("cityId")) params.append("CityId", query.get("cityId")!);
        if (query.get("regionId"))
          params.append("RegionId", query.get("regionId")!);
        if (query.get("minPrice"))
          params.append("MinPrice", query.get("minPrice")!);
        if (query.get("maxPrice"))
          params.append("MaxPrice", query.get("maxPrice")!);
        if (query.get("rooms")) params.append("Rooms", query.get("rooms")!);

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
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search, currentPage]); // refetch when URL changes or page changes

  const totalPages = Math.ceil(totalCount / pageSize);

  // Update URL with new page (and keep filters)
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const newQuery = new URLSearchParams(location.search);
    newQuery.set("page", page.toString());

    navigate(`?${newQuery.toString()}`, { replace: true });
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
                {/* <span>{post.title}</span> */}
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
