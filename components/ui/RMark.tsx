export default function RMark({ size = 32 }: { size?: number }) {
  return (
    <span style={{ width: size, height: size, fontSize: size * 0.6 }} className="relative inline-grid place-items-center overflow-hidden rounded-[9px] bg-lime font-fraunces font-black text-black" aria-hidden="true">
      R<span className="absolute -right-px -top-px h-3 w-3 rounded-bl-[7px] bg-bg" />
    </span>
  );
}
