import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Post.module.scss";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

interface Image {
  id: number;
  url: string;
}

interface PostData {
  id: number;
  title: string;
  address: string;
  regionName: string;
  cityName: string;
  rooms: number;
  owner: {
    id: string;
    ownerName: string;
    ownerSurname: string;
    contactPhone: string;
    email: string;
  };
  description: string;
  images: Image[];
  price: number;
  amenityNames: string[];
}

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://rashad2002-001-site1.ltempurl.com/api/House/Get/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message || "Error fetching post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>No post found.</div>;

  return (
    <div className={styles.postPage}>
      <div className={styles.mainContent}>
        <div className={styles.imageSection}>
          {post.images && post.images.length > 0 ? (
            <Carousel showThumbs infiniteLoop>
              {post.images.map((img) => (
                <div key={img.id} className={styles.images}>
                  <img src={img.url} alt={`Image ${img.id}`} />
                </div>
              ))}
            </Carousel>
          ) : (
            <p>No images available.</p>
          )}
        </div>

        <div className={styles.infoSection}>
          <h2>{post.title}</h2>

          <div className={styles.address}>
            <FaMapMarkerAlt />
            <span>
              {post.cityName}, {post.regionName}, {post.address}
            </span>
          </div>

          <p>{post.description}</p>

          <div className={styles.detailsGrid}>
            <div>
              <strong>Rooms:</strong> {post.rooms}
            </div>
          </div>

          <div className={styles.amenities}>
            <h3>Amenities</h3>
            <ul>
              {post.amenityNames.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.priceBox}>
          <strong>Price:</strong> {post.price} AZN
        </div>

        <div className={styles.realtorBox}>
          <h4>
            {post.owner.ownerName} {post.owner.ownerSurname}
          </h4>
          <p>Əmlakçı</p>
          <div className={styles.phone}>
            <strong>Phone:</strong> {post.owner.contactPhone || "N/A"}
          </div>
          <div className={styles.mail}>
            <strong>Email:</strong> {post.owner.email || "N/A"}
          </div>
          <div className={styles.warning}>
            <strong>Diqqət:</strong> Evə baxmadan əvvəl öncədən ödəniş etməyin.
          </div>
        </div>
      </div>
    </div>
  );
}
