import React from "react";
import styles from "./Home.module.scss";
import { FaMapMarkerAlt, FaSlidersH } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai"; // For heart icon

const Posts = [
  {
    id: 1,
    price: "529 USD",
    location: "Kubinka",
    floor: "8/9",
    rooms: "3 rooms",
    area: "80m²",
    images: ["src/assets/image1.png", "src/assets/image2.png"],
    sponsor: true,
    time: null,
  },
  {
    id: 2,
    price: "2,059 USD",
    location: "Xetai",
    floor: "17/20",
    rooms: "3 rooms",
    area: "160m²",
    images: ["src/assets/image3.png", "src/assets/image4.png"],
    sponsor: true,
    time: "11 min",
  },
  {
    id: 3,
    price: "176 USD",
    location: "Masazır",
    floor: "1",
    rooms: "2 rooms",
    area: "60m²",
    images: ["src/assets/image2.png", "src/assets/image4.png"],
    sponsor: false,
    time: "1 hour ago",
  },
  {
    id: 4,
    price: "235 USD",
    location: "Xırdalan",
    floor: "4/4",
    rooms: "2 rooms",
    area: "55m²",
    images: ["src/assets/image1.png", "src/assets/image3.png"],
    sponsor: false,
    time: "1 hour ago",
  },
  {
    id: 4,
    price: "235 USD",
    location: "Xırdalan",
    floor: "4/4",
    rooms: "2 rooms",
    area: "55m²",
    images: ["src/assets/image1.png", "src/assets/image3.png"],
    sponsor: false,
    time: "1 hour ago",
  },
  {
    id: 4,
    price: "235 USD",
    location: "Xırdalan",
    floor: "4/4",
    rooms: "2 rooms",
    area: "55m²",
    images: ["src/assets/image1.png", "src/assets/image3.png"],
    sponsor: false,
    time: "1 hour ago",
  },
  {
    id: 4,
    price: "235 USD",
    location: "Xırdalan",
    floor: "4/4",
    rooms: "2 rooms",
    area: "55m²",
    images: ["src/assets/image2.png", "src/assets/image3.png"],
    sponsor: false,
    time: "1 hour ago",
  },
  {
    id: 4,
    price: "235 USD",
    location: "Xırdalan",
    floor: "4/4",
    rooms: "2 rooms",
    area: "55m²",
    images: ["src/assets/image4.png", "src/assets/image3.png"],
    sponsor: false,
    time: "1 hour ago",
  },
  {
    id: 4,
    price: "235 USD",
    location: "Xırdalan",
    floor: "4/4",
    rooms: "2 rooms",
    area: "55m²",
    images: ["src/assets/image3.png", "src/assets/image3.png"],
    sponsor: false,
    time: "1 hour ago",
  },
  {
    id: 4,
    price: "235 USD",
    location: "Xırdalan",
    floor: "4/4",
    rooms: "2 rooms",
    area: "55m²",
    images: ["src/assets/image1.png", "src/assets/image3.png"],
    sponsor: false,
    time: "1 hour ago",
  },
];

const Home: React.FC = () => {
  return (
    <div className={styles.Home}>
      <div className={styles.searchBar}>
        <select className={styles.select}>
          <option>Al</option>
          <option>Aylıq Kirayə</option>
          <option>Günlük Kirayə</option>
        </select>

        <div className={styles.locationInput}>
          <input type="text" placeholder="Enter location" />
          <FaMapMarkerAlt className={styles.icon} />
        </div>

        <select className={styles.select}>
          <option>Apartment</option>
          <option>House</option>
          <option>Villa</option>
        </select>

        <input className={styles.input} type="text" placeholder="Area, m²" />
        <input className={styles.input} type="text" placeholder="Price, AZN" />

        <select className={styles.select}>
          <option>Any room</option>
          <option>1 room</option>
          <option>2 rooms</option>
          <option>3 rooms</option>
        </select>

        <button className={styles.filterBtn}>
          <FaSlidersH />
        </button>

        <button className={styles.searchBtn}>Search</button>
      </div>

      <div className={styles.container}>
        {Posts.map((post) => (
          <Link to="/post" key={post.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={post.images[0]} alt={post.location} />
              <div className={styles.heart}>
                <AiOutlineHeart />
              </div>
            </div>

            <div className={styles.info}>
              <div className={styles.priceRow}>
                <span>{post.price}</span>
                {post.sponsor ? (
                  <span className={styles.sponsor}>Sponsorlu</span>
                ) : (
                  <span className={styles.time}>{post.time}</span>
                )}
              </div>

              <div className={styles.location}>
                <FaMapMarkerAlt />
                <span>{post.location}</span>
              </div>

              <div className={styles.details}>
                <span>{post.rooms}</span>
                <span>{post.area}</span>
                <span>{post.floor}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
