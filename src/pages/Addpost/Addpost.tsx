import { useState, useEffect } from "react";
import styles from "./Addpost.module.scss";

interface City {
  id: number;
  name: string;
}

interface Region {
  id: number;
  name: string;
  cityId: number;
}

interface Amenity {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  address: string;
  cityId: string;
  regionId: string;
  rooms: string;
  description: string;
  price: string;
}

const AddPost = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    address: "",
    cityId: "",
    regionId: "",
    rooms: "",
    description: "",
    price: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(
          "https://rashad2002-001-site1.ltempurl.com/api/City/GetAll"
        );
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (!formData.cityId) return;

    const fetchRegions = async () => {
      try {
        const res = await fetch(
          `https://rashad2002-001-site1.ltempurl.com/api/Region/GetRegionsByCityId/${formData.cityId}`
        );
        const data = await res.json();
        setRegions(data);
      } catch (err) {
        console.error("Failed to fetch regions:", err);
        setRegions([]);
      }
    };

    fetchRegions();
  }, [formData.cityId]);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await fetch(
          "https://rashad2002-001-site1.ltempurl.com/api/Amenity/GetAll"
        );
        const data = await res.json();
        setAmenities(data);
      } catch (err) {
        console.error("Failed to fetch amenities:", err);
      }
    };

    fetchAmenities();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "cityId") {
      setFormData({ ...formData, cityId: value, regionId: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleAmenityToggle = (id: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to add a post.");
      return;
    }

    const payload = new FormData();
    payload.append("Title", formData.title);
    payload.append("Address", formData.address);
    payload.append("CityId", formData.cityId);
    payload.append("RegionId", formData.regionId);
    payload.append("Rooms", formData.rooms);
    payload.append("Description", formData.description);
    payload.append("Price", formData.price);

    images.forEach((img) => payload.append("Images", img));
    selectedAmenities.forEach((id) =>
      payload.append("AmenityIds", id.toString())
    );

    try {
      const res = await fetch(
        "https://rashad2002-001-site1.ltempurl.com/api/House/Create",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Post creation failed.");
      }

      alert("Post created successfully!");

      // Reset form
      setFormData({
        title: "",
        address: "",
        cityId: "",
        regionId: "",
        rooms: "",
        description: "",
        price: "",
      });
      setImages([]);
      setSelectedAmenities([]);
    } catch (err: any) {
      console.error("Error creating post:", err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className={styles.addPostContainer}>
      <h2>Add New Post</h2>
      <form
        onSubmit={handleSubmit}
        className={styles.addPostForm}
        encType="multipart/form-data"
      >
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <select
          name="cityId"
          value={formData.cityId}
          onChange={handleChange}
          required
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        <select
          name="regionId"
          value={formData.regionId}
          onChange={handleChange}
          required
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>

        <input
          name="rooms"
          type="number"
          placeholder="Rooms"
          value={formData.rooms}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <fieldset className={styles.amenities}>
          <legend>Select Amenities</legend>
          {amenities.map((amenity) => (
            <label key={amenity.id}>
              <input
                type="checkbox"
                value={amenity.id}
                checked={selectedAmenities.includes(amenity.id)}
                onChange={() => handleAmenityToggle(amenity.id)}
              />
              {amenity.name}
            </label>
          ))}
        </fieldset>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddPost;
