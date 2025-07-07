import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UpdatePost.module.scss";

interface Post {
  id: number;
  title: string;
  price: number;
  cityName: string;
  regionName: string;
  description: string;
  imgUrls: string[];
}

const UpdatePost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    price: "",
    cityName: "",
    regionName: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !id) {
      setError("Missing token or post ID.");
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://rashad2002-001-site1.ltempurl.com/api/House/GetById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await res.json();
        setPost(data);
        setForm({
          title: data.title || "",
          price: data.price?.toString() || "",
          cityName: data.cityName || "",
          regionName: data.regionName || "",
          description: data.description || "",
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) {
      setError("Missing token or post ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://rashad2002-001-site1.ltempurl.com/api/House/Update?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            price: Number(form.price),
            cityName: form.cityName,
            regionName: form.regionName,
            description: form.description,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to update post");
      }

      alert("Post updated successfully!");
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!post) return <p>No post data</p>;

  return (
    <div className={styles.updatePostCard}>
      <img
        src={post.imgUrls?.[0] || "/placeholder.jpg"}
        alt={post.title}
        className={styles.postImage}
      />
      <form onSubmit={handleSubmit} className={styles.updateForm}>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className={styles.input}
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (AZN)"
          required
          className={styles.input}
          min={0}
        />
        <input
          type="text"
          name="cityName"
          value={form.cityName}
          onChange={handleChange}
          placeholder="City"
          required
          className={styles.input}
        />
        <input
          type="text"
          name="regionName"
          value={form.regionName}
          onChange={handleChange}
          placeholder="Region"
          required
          className={styles.input}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className={styles.textarea}
          rows={4}
        />

        <button type="submit" disabled={loading} className={styles.updateBtn}>
          {loading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
