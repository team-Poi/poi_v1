/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import utyles from "../styles/util.module.css";
import isValidURL from "../util/isValidURL";

export default function Home() {
  let [long_url, setLongURL] = useState("");
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Poi.kr
          <img
            src="/poi.png"
            alt=">"
            style={{
              width: "2.5rem",
              transform: "translateX(-0.5rem)",
            }}
          />
        </h1>
        <h3 className={styles.desc}>외우기 쉬운 링크 단축 서비스</h3>
      </header>
      <main>
        <div className={styles.modal}>
          <h2 className={styles.title}>이용안내</h2>
        </div>
        <div
          className={classNames(styles.iptt, utyles.dib)}
          style={{
            padding: "18px 24px",
          }}
          onClick={() => {
            (
              document.querySelector(
                "#__next > main > div.Home_iptt__AUaUa > div > input"
              )! as HTMLInputElement
            ).focus();
          }}
        >
          <div
            style={{
              display: "block",
            }}
          >
            <div
              style={{
                display: "inline",
                position: "relative",
                top: "50%",
                transform: "translateY(-50%)",
                height: "24px",
                maxHeight: "24px",
              }}
              className="iconV"
            >
              <span
                className="material-symbols-outlined iconV"
                style={{
                  position: "absolute",
                  transform: "translateY(4px)",
                }}
              >
                link
              </span>
            </div>
            <input
              type="text"
              placeholder="URL을 입력해 주세요"
              value={long_url}
              style={{
                width: "100%",
                marginLeft: "28px",
                transform: "translateY(2px)",
              }}
              className={styles.ipt}
              onChange={(e) => {
                setLongURL(e.target.value);
              }}
            />
          </div>
        </div>
        <button
          className={classNames(styles.btn, utyles.dib)}
          onClick={() => {}}
          disabled={!isValidURL(long_url)}
        >
          단축하기
        </button>
      </main>
    </>
  );
}
