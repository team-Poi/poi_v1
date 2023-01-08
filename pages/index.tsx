/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import { useEffect, useState } from "react";
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

  let input_1: HTMLInputElement;
  let input_2: HTMLInputElement;

  useEffect(() => {
    if (typeof document == "undefined") return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    input_1 = document.getElementById("input.url.long")! as HTMLInputElement;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    input_2 = document.getElementById("input.url.short")! as HTMLInputElement;
  });

  return (
    <>
      {loading ? <Load /> : null}
      <header className={styles.header}>
        <div className="container">
          <h1
            className={styles.title}
            style={{
              padding: "0px",
              margin: "0px",
            }}
          >
            Poi.kr
          </h1>
          <h3
            style={{
              padding: "0px",
              margin: "0px",
            }}
            className={styles.desc}
          >
            외우기 쉬운 링크 단축 서비스
          </h3>
        </div>
      </header>

      <main>
        <div className="container">
          <div
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "8px",
            }}
            className={classNames("card", styles.urlshorter)}
          >
            <div>
              <h2
                style={{
                  margin: "0px",
                  paddingBottom: "8px",
                }}
              >
                URL 단축하기
              </h2>
            </div>
            <div className={classNames("card", utyles.dtr)}>
              <div
                className={classNames(styles.iptt, utyles.dib)}
                style={{
                  padding: "18px 24px",
                }}
                onClick={() => {
                  input_1.focus();
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
                    id="input.url.long"
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
                disabled={!isValidURL(long_url) || status == "loading"}
              >
                <div
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                >
                  단축하기
                </div>
                <img
                  src="/poi.png"
                  alt=">"
                  style={{
                    width: "2.5rem",
                    display: "inline",
                    verticalAlign: "middle",
                  }}
                  className={classNames(
                    styles.imgx,
                    loading ? styles.active : null
                  )}
                />
              </button>
            </div>
            <div
              style={{
                height: "0.3rem",
              }}
            ></div>
            <div className={classNames("card", utyles.dtr)}>
              <div
                className={classNames(styles.iptt, utyles.dib)}
                style={{
                  padding: "18px 24px",
                }}
                onClick={() => {
                  input_2.focus();
                  input_2.select();
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
                    value={
                      short_url.length == 0 ? "" : `https://poi.kr/${short_url}`
                    }
                    id="input.url.short"
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
                  input_2.focus();
                  input_2.select();
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
            </div>
          </div>

          <div
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "8px",
            }}
            className={classNames("card", styles.urlshorter)}
          >
            <div className={classNames("card2", styles.info)}>
              <h3>Url 단축</h3>
              <p>유저가 제공한 Url을 재미있는 한글문장으로 변환해줍니다!</p>
            </div>
            {/* <div className={classNames("card2", styles.info)}>
              <h3>도매인 서비스</h3>
              <p>(이름).poi.kr 도매인을 사용할수있습니다!</p>
            </div> */}
          </div>
        </div>
      </main>
      <style>
        {`
          html {
            overflow-x: hidden;
          }
          body {
            margin: 0;
            padding: 0;
          }
          `}
      </style>
    </>
  );
}
