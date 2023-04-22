/* eslint-disable @next/next/no-img-element */
import classNames from "classnames";
import axios, { AxiosHeaders, RawAxiosRequestHeaders } from "axios";
import { MutableRefObject, useEffect, useRef, useState } from "react";

import styles from "../styles/Home.module.css";
import utyles from "../styles/util.module.css";
import dtyles from "../styles/dragNdrop.module.css";
import isValidURL from "../util/isValidURL";

import Load from "../components/loading";
import Header from "../components/header";
import SecondLayer_CardView from "../components/2L_CardView";
import Z3H from "../components/z3h";

import { Shorted_url } from "../types/shortedURL";
import HistoryView from "../components/historyView";

type Timeout = number | NodeJS.Timeout | undefined;

let inter: Timeout;
let inter2: Timeout;

export default function Home() {
  const [loading, setLoading] = useState(false);

  const [long_url, setLongURL] = useState("");
  const [short_url, setShortURL] = useState("");

  const [imageURL, setImageURL] = useState("");
  const [hasImage, setHasImage] = useState(false);

  const [fileDroping, setFileDroping] = useState(false);
  const [dropError, setDropError] = useState("");

  const [urlStorages, setUrlStorages] = useState<Shorted_url[][]>([[], []]);

  const input_1 = useRef(null);
  const input_2 = useRef(null);
  const input_4 = useRef(null);
  const input_3 = useRef(null);

  const shorten = (long_url: string, storageIndex: number, showAs?: string) => {
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
  };

  const upload = async (file: File) => {
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
  };

  const asElement = (ref: MutableRefObject<null>) => {
    return ref.current! as HTMLInputElement;
  };

  const errorEnder = (str: string) => {
    setDropError(str);
    if (typeof inter != "undefined") {
      clearInterval(inter);
      inter = undefined;
    }
    if (typeof inter2 != "undefined") {
      clearInterval(inter2);
      inter2 = undefined;
    }
    inter = setTimeout(() => {
      setFileDroping(false);
      inter2 = setTimeout(() => {
        setDropError("");
      }, 200);
      inter = undefined;
    }, 1000);
  };

  useEffect(() => {
    if (typeof localStorage == "undefined") return;

    const shorts = localStorage.getItem("past");
    if (!shorts) return localStorage.setItem("past", "[[],[]]");

    let parsed = JSON.parse(shorts);
    try {
      if (typeof parsed[0] == "undefined")
        return localStorage.setItem("past", "[[],[]]");
      if (typeof parsed[1] == "undefined")
        return localStorage.setItem("past", "[[],[]]");
      if (typeof parsed[0].length == "undefined")
        return localStorage.setItem("past", "[[],[]]");
      if (typeof parsed[1].length == "undefined")
        return localStorage.setItem("past", "[[],[]]");

      setUrlStorages(parsed as Shorted_url[][]);
    } catch (e) {}
  }, []);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFileDroping(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFileDroping(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        let files = e.dataTransfer.files;
        if (files.length > 1)
          return errorEnder("한번에 최대 1개까지만 업로드 할 수 있습니다 :(");
        let file = files[0];
        if (!file.type.startsWith("image/"))
          return errorEnder("이미지만 지원합니다.");
        setFileDroping(false);
        upload(file);
      }}
    >
      {loading ? <Load /> : null}
      {/* Drag N Drop */}
      <div
        className={dtyles.container}
        style={{
          opacity: fileDroping ? "1" : "0",
          pointerEvents: fileDroping ? "all" : "none",
        }}
      >
        <div
          className={dtyles.dots}
          style={{
            borderColor: dropError.length == 0 ? "gray" : "lightcolor",
          }}
        >
          <div
            className={dtyles.center}
            style={{
              animationName: dropError.length == 0 ? "" : "slidein",
              color: dropError.length == 0 ? "grey" : "#ff1111",
            }}
          >
            <div>
              {dropError.length == 0 ? "Drop해서 이미지 업로드" : dropError}
            </div>
          </div>
        </div>
      </div>

      <Header />

      <main>
        <div className="container">
          {/* Feature List */}
          <div className={styles.feature}>
            <SecondLayer_CardView
              name="URL 단축"
              desc="유저가 제공한 Url을 재미있는 한글문장으로 변환해줍니다!"
            />
            <SecondLayer_CardView
              name="이미지 호스팅"
              desc="최대 32MB의 이미지를 업로드 하여, 손쉽게 이미지를 공유 할 수 있습니다."
            />
          </div>

          {/* Url shorten */}
          <div className={styles.feature}>
            <h2 className={utyles.secName}>URL 단축하기</h2>
            <div className={classNames("card", utyles.dtr)}>
              <div
                className={classNames(styles.inputContainer, utyles.dib)}
                onClick={() => {
                  asElement(input_1).focus();
                }}
              >
                <div className={utyles.db}>
                  <div
                    className={classNames("iconV", styles.pInputIconContainer)}
                  >
                    <span
                      className={classNames(
                        "material-symbols-outlined",
                        "iconV",
                        styles.pInputIcon
                      )}
                    >
                      link
                    </span>
                  </div>
                  <input
                    placeholder="URL을 입력해 주세요"
                    value={long_url}
                    ref={input_1}
                    className={styles.input}
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
                <div className={(utyles.dib, utyles.vam)}>단축하기</div>
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
            <Z3H />
            <div className={classNames("card", utyles.dtr)}>
              <div
                className={classNames(styles.inputContainer, utyles.dib)}
                onClick={() => {
                  asElement(input_2).focus();
                  asElement(input_2).select();
                }}
              >
                <div className={utyles.db}>
                  <div
                    className={classNames("iconV", styles.pInputIconContainer)}
                  >
                    <span
                      className={classNames(
                        "material-symbols-outlined",
                        "iconV",
                        styles.pInputIcon
                      )}
                    >
                      arrow_forward
                    </span>
                  </div>
                  <input
                    placeholder="단축된 URL"
                    ref={input_2}
                    value={
                      short_url.length == 0 ? "" : `https://poi.kr/${short_url}`
                    }
                    className={styles.input}
                  />
                </div>
              </div>
              <button
                className={classNames(styles.btn, utyles.dib, styles.ctn)}
                onClick={() => {
                  asElement(input_2).focus();
                  asElement(input_2).select();
                  document.execCommand("copy");
                }}
                disabled={short_url.length == 0}
                style={{
                  padding: "24px 36px",
                }}
              >
                <div className={(utyles.dib, utyles.vam)}>복사하기</div>
              </button>
            </div>
          </div>

          {/* Shorted Url List */}
          <HistoryView history={urlStorages[0]} name="URL 단축화 기록" />

          {/* Upload Img */}
          <div className={styles.feature}>
            <h2 className={utyles.secName}>이미지 업로드</h2>
            <div className={classNames("card", utyles.dtr)}>
              <div className={classNames(styles.inputContainer, utyles.dib)}>
                <div className={utyles.db}>
                  <div
                    className={classNames("iconV", styles.pInputIconContainer)}
                  >
                    <span
                      className={classNames(
                        "material-symbols-outlined",
                        "iconV",
                        styles.pInputIcon
                      )}
                    >
                      image
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={input_3}
                    className={styles.input}
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
                <div className={utyles.vam}>URL화</div>
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
            <Z3H />
            <div className={classNames("card", utyles.dtr)}>
              <div
                className={classNames(styles.inputContainer, utyles.dib)}
                onClick={() => {
                  asElement(input_4).focus();
                  asElement(input_4).select();
                }}
              >
                <div className={utyles.db}>
                  <div
                    className={classNames("iconV", styles.pInputIconContainer)}
                  >
                    <span
                      className={classNames(
                        "material-symbols-outlined",
                        "iconV",
                        styles.pInputIcon
                      )}
                    >
                      arrow_forward
                    </span>
                  </div>
                  <input
                    placeholder="이미지 URL"
                    value={
                      imageURL.length == 0 ? "" : `https://poi.kr/${imageURL}`
                    }
                    ref={input_4}
                    className={styles.input}
                  />
                </div>
              </div>
              <button
                className={classNames(styles.btn, utyles.dib, styles.ctn)}
                onClick={() => {
                  asElement(input_4).focus();
                  asElement(input_4).select();
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

          {/* Uploaded Img List */}
          <HistoryView history={urlStorages[1]} name="이미지 업로드 기록" />
        </div>
      </main>
    </div>
  );
}
