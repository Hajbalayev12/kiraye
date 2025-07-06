import { useState, useEffect } from "react";
import styles from "./AddPost.module.scss";

interface City {
  id: number;
  name: string;
}

interface Region {
  id: number;
  name: string;
  cityId: number;
  cityName?: string;
}

const AddPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    cityId: "",
    regionId: "",
    rooms: "",
    description: "",
    price: "",
  });

  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const token = localStorage.getItem("token") || "";

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(
          "https://rashad2002-001-site1.ltempurl.com/api/City/GetAll"
        );
        if (!res.ok) throw new Error("Failed to fetch cities");
        const data: City[] = await res.json();
        setCities(data);
      } catch (error) {
        console.error("Error loading cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Fetch regions when cityId changes
  useEffect(() => {
    if (!formData.cityId) {
      setRegions([]);
      return;
    }
    const fetchRegions = async () => {
      try {
        const cityIdNumber = Number(formData.cityId);
        const res = await fetch(
          `https://rashad2002-001-site1.ltempurl.com/api/Region/GetRegionsByCityId/${cityIdNumber}`
        );
        if (!res.ok) throw new Error("Failed to fetch regions");
        const data: Region[] = await res.json();
        setRegions(data);
      } catch (error) {
        console.error("Error loading regions:", error);
        setRegions([]);
      }
    };
    fetchRegions();
  }, [formData.cityId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "cityId") {
      setFormData((prev) => ({ ...prev, cityId: value, regionId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle file input changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to add a post.");
      return;
    }

    // Build FormData instead of JSON
    const formPayload = new FormData();
    formPayload.append("Title", formData.title.trim());
    formPayload.append("Address", formData.address.trim());
    formPayload.append("CityId", formData.cityId);
    formPayload.append("RegionId", formData.regionId);
    formPayload.append("Rooms", formData.rooms);
    formPayload.append("Description", formData.description.trim());
    formPayload.append("Price", formData.price);

    images.forEach((imageFile, index) => {
      formPayload.append("Images", imageFile);
      // If API expects images as array with index, you might use:
      // formPayload.append(`Images[${index}]`, imageFile);
    });

    try {
      const response = await fetch(
        "https://rashad2002-001-site1.ltempurl.com/api/House/Create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set Content-Type header! Let browser set multipart boundary
          },
          body: formPayload,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = errorText;
        }
        console.error("Failed to create post:", errorData);
        alert("Failed to create post: " + JSON.stringify(errorData, null, 2));
        return;
      }

      const result = await response.json();
      console.log("Post created successfully:", result);
      alert("Post created!");

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
      setRegions([]);
      setImages([]);
    } catch (error) {
      console.error("Network error:", error);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className={styles.addPostContainer}>
      <h2>Add New Post</h2>
      <form
        className={styles.addPostForm}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label>Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Title..."
        />

        <label>Address</label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="Address..."
        />

        <label>City</label>
        <select
          name="cityId"
          value={formData.cityId}
          onChange={handleChange}
          required
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>

        <label>Region</label>
        <select
          name="regionId"
          value={formData.regionId}
          onChange={handleChange}
          required
          disabled={!formData.cityId || regions.length === 0}
        >
          <option value="">
            {formData.cityId ? "Select a region" : "Select a city first"}
          </option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>

        <label>Rooms</label>
        <input
          name="rooms"
          type="number"
          value={formData.rooms}
          onChange={handleChange}
          required
          placeholder="Number of rooms..."
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Description..."
        />

        <label>Price (AZN)</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="Price..."
        />

        <label>Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit">Add Post</button>
      </form>
    </div>
  );
};

export default AddPost;
