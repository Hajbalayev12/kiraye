import { useState } from "react";
import styles from "./AddPost.module.scss";

const AddPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    price: "",
    description: "",
    meta: "",
    labels: "", // comma separated string
    images: "", // comma separated URLs for simplicity
    details: {
      roomCount: "",
      area: "",
      floor: "",
      repair: "",
      furniture: "",
      gas: "",
      heating: "",
    },
    realtorName: "",
    realtorPhone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (
      [
        "roomCount",
        "area",
        "floor",
        "repair",
        "furniture",
        "gas",
        "heating",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        details: { ...prev.details, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the post object
    const post = {
      title: formData.title,
      address: formData.address,
      price: formData.price,
      description: formData.description,
      meta: formData.meta,
      labels: formData.labels
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean),
      images: formData.images
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
      details: [
        { label: "Otaq sayı", value: formData.details.roomCount },
        { label: "Sahə", value: formData.details.area },
        { label: "Mərtəbə", value: formData.details.floor },
        { label: "Təmir", value: formData.details.repair },
        { label: "Əşyalar", value: formData.details.furniture },
        { label: "Qaz", value: formData.details.gas },
        { label: "İstilik", value: formData.details.heating },
      ],
      realtor: {
        name: formData.realtorName,
        phone: formData.realtorPhone,
      },
    };

    console.log("Submitted post:", post);

    // TODO: send 'post' to backend or context
  };

  return (
    <div className={styles.addPostContainer}>
      <h2>Yeni elan əlavə et</h2>
      <form className={styles.addPostForm} onSubmit={handleSubmit}>
        <label>Başlıq</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="3 otaqlı, 104 m², Baku, Nəsimi"
        />

        <label>Ünvan</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="Bakı şəhəri, Nəsimi rayonu, nəfəslər pr."
        />

        <label>Qiymət (AZN / ay)</label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="2 500 AZN / ay"
        />

        <label>Təsvir</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Mənzilin əlavə təsviri..."
          rows={4}
        />

        <label>Meta (məsələn, 'Yeniləndi: 25.11.2024 · Baxış: 779')</label>
        <input
          type="text"
          name="meta"
          value={formData.meta}
          onChange={handleChange}
          placeholder="Yeniləndi: 25.11.2024 · Baxış: 779"
        />

        <label>
          Etiketlər (vergüllə ayrılmış, məsələn: Aylıq, Yeni Tikili)
        </label>
        <input
          type="text"
          name="labels"
          value={formData.labels}
          onChange={handleChange}
          placeholder="Aylıq, Yeni Tikili"
        />

        <label>Şəkil URL-ləri (vergüllə ayrılmış)</label>
        <input
          type="text"
          name="images"
          value={formData.images}
          onChange={handleChange}
          placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
        />

        <h3>Ətraflı məlumat</h3>

        <label>Otaq sayı</label>
        <input
          type="text"
          name="roomCount"
          value={formData.details.roomCount}
          onChange={handleChange}
          placeholder="3"
        />

        <label>Sahə</label>
        <input
          type="text"
          name="area"
          value={formData.details.area}
          onChange={handleChange}
          placeholder="104 m²"
        />

        <label>Mərtəbə</label>
        <input
          type="text"
          name="floor"
          value={formData.details.floor}
          onChange={handleChange}
          placeholder="23/10"
        />

        <label>Təmir</label>
        <input
          type="text"
          name="repair"
          value={formData.details.repair}
          onChange={handleChange}
          placeholder="Əla"
        />

        <label>Əşyalar</label>
        <input
          type="text"
          name="furniture"
          value={formData.details.furniture}
          onChange={handleChange}
          placeholder="Var"
        />

        <label>Qaz</label>
        <input
          type="text"
          name="gas"
          value={formData.details.gas}
          onChange={handleChange}
          placeholder="Var"
        />

        <label>İstilik</label>
        <input
          type="text"
          name="heating"
          value={formData.details.heating}
          onChange={handleChange}
          placeholder="Kombi"
        />

        <h3>Əmlakçı məlumatı</h3>

        <label>Ad Soyad</label>
        <input
          type="text"
          name="realtorName"
          value={formData.realtorName}
          onChange={handleChange}
          placeholder="SHRIYAR BEY"
        />

        <label>Telefon nömrəsi</label>
        <input
          type="text"
          name="realtorPhone"
          value={formData.realtorPhone}
          onChange={handleChange}
          placeholder="050-228-36-**"
        />

        <button type="submit">Elanı əlavə et</button>
      </form>
    </div>
  );
};

export default AddPost;
