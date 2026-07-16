"use client";

export default function AmbientBlobs() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -2 }}
      aria-hidden
    >
      {/* Blob 1 – warm amber top-left */}
      <div
        className="absolute rounded-full"
        style={{
          top: "5%",
          left: "8%",
          width: "420px",
          height: "420px",
          background: "radial-gradient(circle, rgba(214, 195, 162, 0.28) 0%, rgba(214, 195, 162, 0.08) 45%, transparent 70%)",
          filter: "blur(60px)",
          animation: "blob-drift-1 22s ease-in-out infinite",
        }}
      />

      {/* Blob 2 – muted deep blue top-right */}
      <div
        className="absolute rounded-full"
        style={{
          top: "2%",
          right: "5%",
          width: "380px",
          height: "380px",
          background: "radial-gradient(circle, rgba(26, 18, 100, 0.15) 0%, rgba(26, 18, 100, 0.05) 45%, transparent 70%)",
          filter: "blur(55px)",
          animation: "blob-drift-2 28s ease-in-out infinite",
        }}
      />

      {/* Blob 3 – soft cream center-right */}
      <div
        className="absolute rounded-full"
        style={{
          top: "38%",
          right: "12%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(245, 245, 237, 0.6) 0%, rgba(235, 235, 224, 0.2) 45%, transparent 70%)",
          filter: "blur(50px)",
          animation: "blob-drift-3 20s ease-in-out infinite",
        }}
      />

      {/* Blob 4 – dusty rose bottom-left */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: "15%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(196, 164, 148, 0.18) 0%, rgba(196, 164, 148, 0.06) 45%, transparent 70%)",
          filter: "blur(50px)",
          animation: "blob-drift-4 24s ease-in-out infinite",
        }}
      />

      {/* Blob 5 – deep navy bottom-right */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: "8%",
          right: "8%",
          width: "360px",
          height: "360px",
          background: "radial-gradient(circle, rgba(26, 18, 100, 0.12) 0%, rgba(26, 18, 100, 0.04) 45%, transparent 70%)",
          filter: "blur(65px)",
          animation: "blob-drift-1 30s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />

      {/* Blob 6 – warm ivory center-left */}
      <div
        className="absolute rounded-full"
        style={{
          top: "55%",
          left: "18%",
          width: "280px",
          height: "280px",
          background: "radial-gradient(circle, rgba(235, 235, 224, 0.45) 0%, rgba(214, 195, 162, 0.1) 45%, transparent 70%)",
          filter: "blur(45px)",
          animation: "blob-drift-2 26s ease-in-out infinite",
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}
