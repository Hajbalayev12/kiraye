import { useEffect, useState } from "react";
import styles from "./Post.module.scss";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "10px",
};

export default function Post() {
  const data = {
    images: [
      "src/assets/image1.png",
      "src/assets/image2.png",
      "src/assets/image3.png",
    ],
    labels: ["Aylıq", "Yeni Tikili"],
    title: "3 otaqlı, 104 m², Baku, Nəsimi",
    meta: "Yeniləndi: 25.11.2024 · Baxış: 779",
    details: [
      { label: "Otaq sayı", value: "3" },
      { label: "Sahə", value: "104 m²" },
      { label: "Mərtəbə", value: "23/10" },
      { label: "Təmir", value: "Əla" },
      { label: "Əşyalar", value: "Var" },
      { label: "Qaz", value: "Var" },
      { label: "İstilik", value: "Kombi" },
    ],
    address: "Bakı şəhəri, Nəsimi rayonu, nəfəslər pr.",
    description:
      "Port Baku-nun yanında Tac Residence, 10/21, 3 otaq, 104m², EURO təmirli, dəniz mənzərəli mənzil əşyalı şəkildə kirayə verilir. Əlavə məlumat üçün zəng və ya WhatsApp ilə əlaqə saxlaya bilərsiniz.",
  };

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // ⬅️ Replace with your actual API key
  });

  useEffect(() => {
    if (!isLoaded) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: data.address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const loc = results[0].geometry.location;
        setCoordinates({ lat: loc.lat(), lng: loc.lng() });
      } else {
        console.error("Geocode error:", status);
        // fallback coordinates (example: Nəsimi, Baku)
        setCoordinates({ lat: 40.3852, lng: 49.8547 });
      }
    });
  }, [isLoaded, data.address]);

  if (loadError) return <div>Xəritə yüklənə bilmədi.</div>;
  if (!isLoaded) return <div>Xəritə yüklənir...</div>;

  return (
    <div className={styles.postPage}>
      <div className={styles.mainContent}>
        <div className={styles.imageSection}>
          <Carousel showThumbs={true} infiniteLoop dynamicHeight={false}>
            {data.images.map((src, index) => (
              <div key={index} className={styles.images}>
                <img src={src} alt={`Apartment view ${index + 1}`} />
              </div>
            ))}
          </Carousel>

          <div className={styles.labels}>
            {data.labels.map((label, index) => (
              <span
                key={index}
                className={
                  label === "Aylıq"
                    ? styles.labelGreen
                    : label === "Yeni Tikili"
                    ? styles.labelBlue
                    : ""
                }
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.title}>
            <h2>{data.title}</h2>
            <p className={styles.meta}>{data.meta}</p>
          </div>

          <div className={styles.detailsGrid}>
            {data.details.map((item, index) => (
              <div key={index}>
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>

          <div className={styles.address}>
            <FaMapMarkerAlt />
            <span>{data.address}</span>
          </div>

          <div className={styles.description}>{data.description}</div>

          <div className={styles.nearby}>
            <h3>Yaxınlıqdakı məkanlar</h3>
            <div className={styles.nearbyTags}>
              <span>🏫 Məktəb</span>
              <span>🏥 Xəstəxana</span>
              <span>🍽 Restoran</span>
              <span>🏢 Klinika</span>
              <span>🛒 Supermarket</span>
              <span>🚇 Metro</span>
            </div>

            <GoogleMap
              mapContainerStyle={{ width: "400px", height: "300px" }}
              center={{ lat: 40.3852, lng: 49.8547 }}
              zoom={15}
            >
              <Marker position={{ lat: 40.3852, lng: 49.8547 }} />
            </GoogleMap>
          </div>
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.priceBox}>2 500 AZN / ay</div>

        <div className={styles.realtorBox}>
          <h4>SHRIYAR BEY</h4>
          <p>Əmlakçı</p>
          <button className={styles.showNumber}>
            <FaPhoneAlt /> Nömrəni göstər
          </button>
          <div className={styles.phone}>050-228-36-**</div>
          <div className={styles.warning}>
            <strong>Diqqət:</strong> Evə baxmadan əvvəl öncədən ödəniş etməyin.
          </div>
          <button className={styles.rentButton}>Tez kirayələ</button>
        </div>
      </div>
    </div>
  );
}
