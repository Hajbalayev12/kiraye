import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./WebsiteLayout.module.scss";

const WebsiteLayout = () => {
  return (
    <div className={styles.WebsiteLayout}>
      <Navbar />
      <main className={styles.MainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
