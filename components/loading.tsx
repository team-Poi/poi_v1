import style from "./loading.module.css";

export default function Load() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: "0px",
        left: "0px",
        bottom: "0px",
        right: "0px",
        background: "black",
        opacity: "0.5",
        zIndex: "9999",
      }}
    ></div>
  );
}
