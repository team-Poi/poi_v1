/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import utyles from "../styles/util.module.css";
import isValidURL from "../util/isValidURL";
import axios, { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import Load from "../components/loading";
import Link from "next/link";

interface Shorted_url {
  long: string;
  short: string;
}

export default function Home() {
  let [long_url, setLongURL] = useState("");
  let [loading, setLoading] = useState(false);
  let [short_url, setShortURL] = useState("");
  let [urlStorages, setUrlStorages] = useState<Shorted_url[][]>([[], []]);
  let [imageURL, setImageURL] = useState("");
  let [hasImage, setHasImage] = useState(false);

  let input_1: HTMLInputElement;
  let input_2: HTMLInputElement;
  let input_4: HTMLInputElement;

  let input_3 = useRef(null);

  async function shorten(
    long_url: string,
    storageIndex: number,
    showAs?: string
  ) {
    return new Promise<string>((resolve, reject) => {
      const addToLocal = (s: string) => {
        if (urlStorages[storageIndex].filter((v) => v.short == s).length > 0)
          return;
        let newShorted: Shorted_url[] = [
          {
            long: typeof showAs !== "undefined" ? showAs : long_url,
            short: s,
          },
          ...urlStorages[storageIndex],
        ];
        if (newShorted.length > 10) newShorted.pop();
        setUrlStorages((oldShorted) => {
          let outdata = oldShorted.map((v, i) =>
            i != storageIndex ? v : newShorted
          );
          localStorage.setItem("past", JSON.stringify(outdata));
          return outdata;
        });
      };
      setLoading(true);
      axios
        .post("/api/create", {
          url: long_url,
        })
        .then((v) => {
          addToLocal(v.data);
          resolve(v.data);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  }

  async function upload(file: File) {
    setLoading(true);
    let headers: RawAxiosRequestHeaders | AxiosHeaders = {};

    const imgBB = await axios.get("/imgbb", {
      headers: headers,
      withCredentials: true,
    });
    if (typeof imgBB.data !== "string")
      throw new Error("No response from imgbb");
    const authToken = imgBB.data
      .split("\n")
      .filter((i) => i.includes(`PF.obj.config.auth_token`))[0]
      .replace(/ /gi, "")
      .split(`=\"`)[1]
      .split(`";`)[0];
    const formData = new FormData();
    formData.append("type", "file");
    formData.append("action", "upload");
    formData.append("timestamp", new Date().getTime().toString());
    formData.append("auth_token", authToken);
    formData.append("source", file);
    axios
      .post("/api/imgbb", formData, {
        headers: headers,
        withCredentials: true,
      })
      .then(async (dat) => {
        setImageURL(await shorten(dat.data.image.display_url, 1, file.name));
      });
  }

  useEffect(() => {
    if (typeof document == "undefined") return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    input_1 = document.getElementById("input.url.long")! as HTMLInputElement;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    input_2 = document.getElementById("input.url.short")! as HTMLInputElement;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    input_4 = document.getElementById("image.url")! as HTMLInputElement;
  });

  useEffect(() => {
    if (typeof localStorage == "undefined") return;
    let shorts = localStorage.getItem("past");
    if (!shorts) {
      localStorage.setItem("past", "[[],[]]");
    } else {
      // old version error handler
      if (shorts.length > 2) {
        localStorage.setItem("past", "[[],[]]");
        return;
      }
      if (shorts.length < 2) {
        localStorage.setItem("past", "[[],[]]");
        return;
      }
      if (typeof shorts[0] == "undefined") {
        localStorage.setItem("past", "[[],[]]");
        return;
      }
      if (typeof shorts[1] == "undefined") {
        localStorage.setItem("past", "[[],[]]");
        return;
      }
      if (typeof shorts[0].length == "undefined") {
        localStorage.setItem("past", "[[],[]]");
        return;
      }
      if (typeof shorts[1].length == "undefined") {
        localStorage.setItem("past", "[[],[]]");
        return;
      }
      setUrlStorages(JSON.parse(shorts) as Shorted_url[][]);
    }
  }, []);

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
          <div className={classNames("card", styles.urlshorter)}>
            <div className={classNames("card2", styles.info)}>
              <h3>Url 단축</h3>
              <p>유저가 제공한 Url을 재미있는 한글문장으로 변환해줍니다!</p>
            </div>
            <div className={classNames("card2", styles.info)}>
              <h3>이미지 URL화</h3>
              <p>
                최대 32MB의 이미지를 업로드 하여, 손쉽게 이미지를 공유 할 수
                있습니다.
              </p>
            </div>
          </div>

          <div className={classNames("card", styles.urlshorter)}>
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
                onClick={async () => {
                  setShortURL(await shorten(long_url, 0));
                }}
                disabled={!isValidURL(long_url)}
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

          <div className={classNames("card", styles.urlshorter)}>
            <div>
              <h2
                style={{
                  margin: "0px",
                  paddingBottom: "8px",
                }}
              >
                URL 단축기록
                <desc
                  style={{
                    fontSize: "0.9rem",
                    paddingLeft: "0.5rem",
                    color: "#aaaaaa",
                  }}
                >
                  최근 10개까지만 표시됩니다.
                </desc>
              </h2>
            </div>
            {urlStorages[0].map((v, i) => {
              return (
                <div
                  className={classNames("card2", styles.info)}
                  key={`URLS.${i}`}
                >
                  <h3>
                    <Link href={`/${v.short}`}>https://poi.kr/{v.short}</Link>
                  </h3>
                  <p
                    style={{
                      width: "100%",
                      wordBreak: "break-all",
                      display: "-webkit-box",
                      wordWrap: "break-word",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxHeight: "2.5rem",
                      lineHeight: "1.1rem",
                    }}
                  >
                    {v.long}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={classNames("card", styles.urlshorter)}>
            <div>
              <h2
                style={{
                  margin: "0px",
                  paddingBottom: "8px",
                }}
              >
                이미지 URL화
              </h2>
            </div>
            <div className={classNames("card", utyles.dtr)}>
              <div
                className={classNames(styles.iptt, utyles.dib)}
                style={{
                  padding: "18px 24px",
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
                      image
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={input_3}
                    className={styles.ipt}
                    style={{
                      marginLeft: "32px",
                      color: "black",
                    }}
                    accept="image/*, .jpg,.png,.bmp,.gif,.tif,.webp,.heic,.pdf,.jpeg,.tiff,.heif"
                    onChange={(e) => {
                      const fileObj = e.target.files && e.target.files[0];
                      if (!fileObj) {
                        return;
                      }

                      setHasImage(true);
                    }}
                  />
                </div>
              </div>
              <button
                className={classNames(styles.btn, utyles.dib)}
                onClick={() => {
                  let fileObj = (input_3.current! as HTMLInputElement).files;
                  if (!fileObj) return;
                  if (fileObj.length == 0) return;
                  if (fileObj.length > 1) return;
                  let file_ = fileObj[0];
                  upload(file_);
                }}
                disabled={!hasImage}
              >
                <div
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                >
                  URL화
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
                  input_4.focus();
                  input_4.select();
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
                    placeholder="이미지 URL"
                    value={
                      imageURL.length == 0 ? "" : `https://poi.kr/${imageURL}`
                    }
                    id="image.url"
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
                  input_4.focus();
                  input_4.select();
                  document.execCommand("copy");
                }}
                disabled={imageURL.length == 0}
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

          <div className={classNames("card", styles.urlshorter)}>
            <div>
              <h2
                style={{
                  margin: "0px",
                  paddingBottom: "8px",
                }}
              >
                이미지 URL화 기록
                <desc
                  style={{
                    fontSize: "0.9rem",
                    paddingLeft: "0.5rem",
                    color: "#aaaaaa",
                  }}
                >
                  최근 10개까지만 표시됩니다.
                </desc>
              </h2>
            </div>
            {urlStorages[1].map((v, i) => {
              return (
                <div
                  className={classNames("card2", styles.info)}
                  key={`URLS.${i}`}
                >
                  <h3>
                    <Link href={`/${v.short}`}>https://poi.kr/{v.short}</Link>
                  </h3>
                  <p
                    style={{
                      width: "100%",
                      wordBreak: "break-all",
                      display: "-webkit-box",
                      wordWrap: "break-word",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxHeight: "2.5rem",
                      lineHeight: "1.1rem",
                    }}
                  >
                    {v.long}
                  </p>
                </div>
              );
            })}
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
