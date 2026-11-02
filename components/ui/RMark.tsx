export default function RMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-lime font-semibold text-black"
      style={{ width: size, height: size, fontSize: size * 0.42, fontFamily: "Fraunces, Georgia, serif" }}
      aria-hidden
    >
      R
    </span>
  );
}
