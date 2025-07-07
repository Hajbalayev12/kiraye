import styles from "./Navbar.module.scss";
import { FaSearch, FaHeart, FaCommentDots } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.Logo}>
          <span>kiraye.az</span>
        </Link>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.icon} />
          <input type="text" placeholder="Ev Axtarışı" />
          <select>
            <option>Şəhər</option>
          </select>
          <button className={styles.searchBtn}>Tap</button>
        </div>
      </div>

      <div className={styles.right}>
        {/* <FaHeart className={styles.icon} />
        <FaCommentDots className={styles.icon} /> */}
        <Link to="/profile">
          <button className={styles.addBtn}>Profile</button>
        </Link>
        <Link to="/addpost">
          <button className={styles.addBtn}>+ Yeni elan</button>
        </Link>
        <Link to="/signin">
          <button className={styles.loginBtn}>Giriş</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
