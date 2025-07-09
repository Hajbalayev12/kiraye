import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UpdatePost.module.scss";

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
  ownerName: string;
  ownerSurname: string;
  contactPhone: string;
  email: string;
  description: string;
  images: Image[];
  price: number;
  amenityNames: string[];
}

interface Amenity {
  id: number;
  name: string;
}

export default function UpdatePost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostData | null>(null);
  const [formData, setFormData] = useState<Partial<PostData>>({});
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const res = await fetch(
          `https://rashad2002-001-site1.ltempurl.com/api/House/GetByOwner/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401 || res.status === 403 || res.status === 404) {
          throw new Error("You have no any access to this post");
        }

        if (!res.ok) {
          let errMsg = "Failed to fetch post";
          try {
            const errData = await res.json();
            if (errData?.message) errMsg = errData.message;
          } catch {}
          throw new Error(errMsg);
        }

        const data: PostData = await res.json();
        setPost(data);
        setFormData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching post");
        setTimeout(() => navigate("/profile"), 3000);
      } finally {
        setLoading(false);
      }
    }

    async function fetchAmenities() {
      try {
        const res = await fetch(
          "https://rashad2002-001-site1.ltempurl.com/api/Amenity/GetAll"
        );
        if (!res.ok) throw new Error("Failed to fetch amenities");
        const data: Amenity[] = await res.json();
        setAmenities(data);
      } catch (err) {
        console.error("Failed to load amenities.");
      }
    }

    fetchPost();
    fetchAmenities();
  }, [id, navigate]);

  useEffect(() => {
    if (post && amenities.length && selectedAmenityIds.length === 0) {
      const matched = amenities
        .filter((a) => post.amenityNames.includes(a.name))
        .map((a) => a.id);
      setSelectedAmenityIds(matched);
    }
  }, [post, amenities, selectedAmenityIds.length]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleAmenityChange = (id: number, checked: boolean) => {
    setSelectedAmenityIds((prev) =>
      checked ? [...prev, id] : prev.filter((a) => a !== id)
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      setNewImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...(formData.images || [])];
    const [removed] = updatedImages.splice(index, 1);
    if (removed?.id) {
      setRemovedImageIds((prev) => [...prev, removed.id]);
    }
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const fd = new FormData();
      fd.append("Id", String(formData.id));
      fd.append("Title", formData.title || "");
      fd.append("Description", formData.description || "");
      fd.append("Rooms", String(formData.rooms));
      fd.append("Price", String(formData.price));

      (formData.images || []).forEach((img) => {
        fd.append("ImageUrls", img.url);
      });

      removedImageIds.forEach((id) => {
        fd.append("DeletedImageIds", String(id));
      });

      selectedAmenityIds.forEach((id) => {
        fd.append("AmenityIds", String(id));
      });

      newImages.forEach((file) => {
        fd.append("NewImages", file);
      });

      const res = await fetch(
        "https://rashad2002-001-site1.ltempurl.com/api/House/Update",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        if (errData?.errors) {
          const messages = Object.entries(errData.errors)
            .map(([key, val]) => `${key}: ${(val as string[]).join(", ")}`)
            .join("\n");
          throw new Error(messages);
        }
        throw new Error(errData?.message || "Update failed");
      }

      setSuccess("Post updated successfully");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err: any) {
      setError(err.message);
      console.error("Update failed:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <form className={styles.mainContent} onSubmit={handleSubmit}>
      <div className={styles.imageGrid}>
        {(formData.images || []).map((img, index) => (
          <div key={img.id} className={styles.thumbnailWrapper}>
            <img
              src={img.url}
              alt={`img-${index}`}
              className={styles.thumbnail}
            />
            <button
              type="button"
              onClick={() => handleDeleteImage(index)}
              className={styles.deleteBtn}
            >
              ✖
            </button>
          </div>
        ))}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className={styles.fileInput}
        />
      </div>

      <input
        name="title"
        value={formData.title || ""}
        onChange={handleChange}
        required
        placeholder="Title"
      />
      <textarea
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        required
        placeholder="Description"
      />
      <input
        name="rooms"
        type="number"
        value={formData.rooms ?? ""}
        onChange={handleChange}
        required
        placeholder="Rooms"
        min={0}
      />
      <input
        name="price"
        type="number"
        value={formData.price ?? ""}
        onChange={handleChange}
        required
        placeholder="Price"
        min={0}
      />

      <div className={styles.amenities}>
        {amenities.map((a) => (
          <label key={a.id}>
            <input
              type="checkbox"
              checked={selectedAmenityIds.includes(a.id)}
              onChange={(e) => handleAmenityChange(a.id, e.target.checked)}
            />
            {a.name}
          </label>
        ))}
      </div>

      {success && <div className={styles.success}>{success}</div>}

      <button type="submit" className={styles.updateBtn}>
        Save Changes
      </button>
    </form>
  );
}
