import styles from "./Footer.module.scss";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.Footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h2 className={styles.logo}>Rent A Home</h2>
          <p>
            Your trusted platform to rent homes easily, securely, and affordably
            across Azerbaijan.
          </p>
        </div>

        <div className={styles.column}>
          <h4>Explore</h4>
          <ul>
            <li>Home</li>
            <li>Listings</li>
            <li>How It Works</li>
            <li>Blog</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Terms of Use</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Connect</h4>
          <div className={styles.socials}>
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaLinkedinIn />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Rent A Home. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
