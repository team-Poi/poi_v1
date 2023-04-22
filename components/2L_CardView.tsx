import styles from "../styles/slCard.module.css";

interface CardProps {
  name: string | JSX.Element;
  desc: string;
  needDoted?: boolean;
}

export default function SecondLayer_CardView(props: CardProps) {
  return (
    <div className={styles.info}>
      <h3>{props.name}</h3>
      <p className={props.needDoted ? styles.needToBeDoted : ""}>
        {props.desc}
      </p>
    </div>
  );
}
