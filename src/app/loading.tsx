export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="#B08A3E"
            strokeWidth="2"
            strokeOpacity="0.3"
          />
          <path
            d="M26 38 A6 6 0 0 0 32 34 c0-3-1-4-2-6 -2-4 0-8 4-12 1 5 4 10 8 13 4 3 6 7 6 11 a14 14 0 1 1-28 0 c0-2 1-5 2-6 a5 5 0 0 0 5 5z"
            fill="#7A1F1F"
            opacity="0.8"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
      <p className="font-elite text-[10px] uppercase tracking-[0.3em] text-sepia">
        Heating the hearth...
      </p>
    </div>
  );
}
