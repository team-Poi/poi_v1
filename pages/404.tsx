import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          height: "fit-content",
        }}
      >
        <span
          className="material-symbols-outlined iconV"
          style={{
            color: "red",
            fontSize: "5rem",
            position: "relative",
            display: "inline-block",
            verticalAlign: "middle",
          }}
        >
          warning
        </span>
        <h1
          style={{
            textAlign: "center",
            verticalAlign: "middle",
            display: "inline-block",
            height: "fit-content",
          }}
        >
          404 Page Not Found
        </h1>
      </div>
      <p
        style={{
          textAlign: "center",
        }}
      >
        링크에 해당하는 서비스를 찾지 못했습니다.
      </p>

      <Link
        href="/"
        style={{
          textDecorationLine: "none",
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: "5px 20px",
            backgroundColor: "gray",
            width: "fit-content",
            textAlign: "center",
            verticalAlign: "middle",
            height: "50px",
            borderRadius: "8px",
            textDecorationLine: "none",
            color: "white",
            fontSize: "1.5rem",
            display: "inline-block",
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            style={{
              position: "relative",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            홈으로 돌아가기
          </div>
        </div>
      </Link>
    </>
  );
}
