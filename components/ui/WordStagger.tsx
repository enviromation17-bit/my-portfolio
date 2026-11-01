export default function WordStagger({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, i) => <span key={i} aria-hidden="true" className="word" style={{ animationDelay: `${0.1 + i * 0.07}s` }}>{w}&nbsp;</span>)}
    </span>
  );
}
