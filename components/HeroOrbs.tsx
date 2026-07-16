"use client";

export default function HeroOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {/* Large soft orb – top left */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full float-slow opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(235,235,224,0.6) 0%, transparent 70%)",
        }}
      />
      {/* Medium orb – top right */}
      <div
        className="absolute -top-10 right-[10%] w-56 h-56 rounded-full float-medium opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(26,18,100,0.4) 0%, transparent 70%)",
          animationDelay: "1s",
        }}
      />
      {/* Small orb – bottom left */}
      <div
        className="absolute bottom-[15%] left-[8%] w-40 h-40 rounded-full float-medium opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(235,235,224,0.5) 0%, transparent 70%)",
          animationDelay: "2.5s",
        }}
      />
      {/* Tiny orb – bottom right */}
      <div
        className="absolute bottom-[25%] right-[15%] w-28 h-28 rounded-full float-slow opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(26,18,100,0.35) 0%, transparent 70%)",
          animationDelay: "0.5s",
        }}
      />
    </div>
  );
}
