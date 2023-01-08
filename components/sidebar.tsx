import styles from "../styles/panel.module.css";
import Link from "next/link";

export default function Sidebar() {
  return (
    <>
      <div>
        <div className={styles.sidebar}>
          <h1 className={styles.st}>관리패널</h1>
          <Link
            style={{
              textDecorationLine: "none",
            }}
            href="/panel/manage"
            className={styles.hbtn}
          >
            <ul className={styles.hb}>홈</ul>
          </Link>
        </div>
      </div>
    </>
  );
}
