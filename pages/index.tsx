/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import utyles from "../styles/util.module.css";
import isValidURL from "../util/isValidURL";
import axios from "axios";
import { useSession } from "next-auth/react";
import Load from "../components/loading";

export default function Home() {
  let [long_url, setLongURL] = useState("");
  let [loading, setLoading] = useState(false);
  let [short_url, setShortURL] = useState("");
  const { data, status } = useSession();

  if (status == "loading") {
    return (
      <>
        <div
          style={{
            alignItems: "center",
          }}
        >
          Wait For Create Statue...
        </div>
      </>
    );
  }

  return (
    <>
      {loading ? <Load /> : null}
      <header className={styles.header}>
        <h1 className={styles.title}>Poi.kr</h1>{" "}
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
          onClick={() => {
            setLoading(true);
            if (status == "authenticated") {
              axios
                .post("/api/create", {
                  url: long_url,
                  madeBy: data?.user?.id,
                })
                .then((v) => {
                  setShortURL(v.data);
                })
                .finally(() => {
                  setLoading(false);
                });
            }
            if (status == "unauthenticated") {
              axios
                .post("/api/create", {
                  url: long_url,
                })
                .then((v) => {
                  setShortURL(v.data);
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          }}
          disabled={!isValidURL(long_url)}
        >
          <img
            src="/poi.png"
            alt=">"
            style={{
              width: "2.5rem",
              display: "inline",
              verticalAlign: "middle",
              marginLeft: "-6px",
            }}
          />
          <div
            style={{
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            단축하기
          </div>
        </button>
      </main>
      <main
        style={{
          marginTop: "5px",
        }}
      >
        <div
          className={classNames(styles.iptt, utyles.dib)}
          style={{
            padding: "18px 24px",
          }}
          onClick={() => {
            (
              document.querySelector(
                "#__next > main:nth-child(3) > div > div > input"
              )! as HTMLInputElement
            ).focus();
            (
              document.querySelector(
                "#__next > main:nth-child(3) > div > div > input"
              )! as HTMLInputElement
            ).select();
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
                arrow_forward
              </span>
            </div>
            <input
              type="text"
              placeholder="단축된 URL"
              value={short_url.length == 0 ? "" : `https://poi.kr/${short_url}`}
              style={{
                width: "100%",
                marginLeft: "28px",
                transform: "translateY(2px)",
              }}
              className={styles.ipt}
            />
          </div>
        </div>
        <button
          className={classNames(styles.btn, utyles.dib, styles.ctn)}
          onClick={() => {
            (
              document.querySelector(
                "#__next > main:nth-child(3) > div > div > input"
              )! as HTMLInputElement
            ).focus();
            (
              document.querySelector(
                "#__next > main:nth-child(3) > div > div > input"
              )! as HTMLInputElement
            ).select();
            document.execCommand("copy");
          }}
          disabled={short_url.length == 0}
          style={{
            padding: "24px 36px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            복사하기
          </div>
        </button>
      </main>
    </>
  );
}
