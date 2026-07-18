"use client";

export default function HeroOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {/* Soft orb – top left */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full float-slow opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(235,235,224,0.5) 0%, transparent 70%)",
        }}
      />
      {/* Soft orb – bottom right */}
      <div
        className="absolute bottom-[15%] right-[10%] w-48 h-48 rounded-full float-medium opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(26,18,100,0.35) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
}
