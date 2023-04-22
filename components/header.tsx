import styles from "../styles/header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <h1 className={styles.title}>Poi.kr</h1>
        <h3 className={styles.desc}>외우기 쉬운 링크 단축 서비스</h3>
      </div>
    </header>
  );
}
