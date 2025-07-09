import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Correct

interface City {
  id: number;
  name: string;
}

interface Region {
  id: number;
  name: string;
}

const Navbar = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cityId, setCityId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [errorCities, setErrorCities] = useState("");
  const [errorRegions, setErrorRegions] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const role =
          decoded.Role ||
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setUserRole(role);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token", err);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      setErrorCities("");
      try {
        const res = await fetch(
          "https://rashad2002-001-site1.ltempurl.com/api/City/GetAll"
        );
        if (!res.ok) throw new Error("Failed to load cities");
        const data = await res.json();
        setCities(data || []);
      } catch (err: any) {
        setErrorCities(err.message || "Error loading cities");
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (!cityId) {
      setRegions([]);
      setRegionId("");
      return;
    }

    const fetchRegions = async () => {
      setLoadingRegions(true);
      setErrorRegions("");
      try {
        const res = await fetch(
          `https://rashad2002-001-site1.ltempurl.com/api/Region/GetRegionsByCityId/${cityId}`
        );
        if (!res.ok) throw new Error("Failed to load regions");
        const data = await res.json();
        setRegions(data || []);
        setRegionId("");
      } catch (err: any) {
        setErrorRegions(err.message || "Error loading regions");
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };
    fetchRegions();
  }, [cityId]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("Search", search.trim());
    if (cityId) params.set("CityId", cityId);
    if (regionId) params.set("RegionId", regionId);
    if (minPrice) params.set("MinPrice", minPrice);
    if (maxPrice) params.set("MaxPrice", maxPrice);
    if (rooms) params.set("Rooms", rooms);

    navigate({
      pathname: "/",
      search: params.toString(),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/signin");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.Logo}>
          kiraye.az
        </Link>

        <div className={styles.searchContainer}>
          <FaSearch className={styles.icon} />

          <input
            type="text"
            placeholder="Ev Axtarışı"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            disabled={loadingCities || !!errorCities}
          >
            <option value="">Şəhər</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id.toString()}>
                {city.name}
              </option>
            ))}
          </select>

          <select
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
            disabled={!cityId || loadingRegions || !!errorRegions}
          >
            <option value="">
              {loadingRegions ? "Yüklənir..." : errorRegions ? "Xəta" : "Rayon"}
            </option>
            {regions.map((region) => (
              <option key={region.id} value={region.id.toString()}>
                {region.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Qiymət"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min={0}
          />
          <input
            type="number"
            placeholder="Max Qiymət"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min={0}
          />

          <select value={rooms} onChange={(e) => setRooms(e.target.value)}>
            <option value="">Otaq sayı</option>
            <option value="1">1 otaq</option>
            <option value="2">2 otaq</option>
            <option value="3">3 otaq</option>
            <option value="4">4+ otaq</option>
          </select>

          <button className={styles.searchBtn} onClick={handleSearch}>
            Tap
          </button>
        </div>
      </div>

      <div className={styles.right}>
        {isLoggedIn ? (
          <>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
            <Link to="/profile">
              <button className={styles.addBtn}>Profile</button>
            </Link>
            {userRole === "Makler" && (
              <Link to="/addpost">
                <button className={styles.addBtn}>+ Yeni elan</button>
              </Link>
            )}
          </>
        ) : (
          <Link to="/signin">
            <button className={styles.loginBtn}>Giriş</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
