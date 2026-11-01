export default function TemplatePreview({ bg, ac, layout }: { bg: string; ac: string; layout: string }) {
  const dark = bg.startsWith("#0") || bg.startsWith("#1");
  const ink = dark ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.45)";
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-lg border border-white/10" style={{ background: bg }}>
      <div className="flex items-center gap-1 px-3 py-2" style={{ background: "rgba(128,128,128,.15)" }}>{[0, 1, 2].map((i) => <i key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: ink }} />)}</div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between"><i className="h-2 w-8 rounded" style={{ background: ac }} /><i className="h-1.5 w-16 rounded" style={{ background: ink }} /></div>
        {layout === "hero" && <><i className="mt-4 block h-3 w-3/4 rounded" style={{ background: ink }} /><i className="block h-3 w-1/2 rounded" style={{ background: ink }} /><i className="mt-2 block h-5 w-16 rounded-full" style={{ background: ac }} /></>}
        {layout === "split" && <div className="mt-3 grid grid-cols-2 gap-3"><div className="space-y-2"><i className="block h-3 w-full rounded" style={{ background: ink }} /><i className="block h-3 w-2/3 rounded" style={{ background: ink }} /><i className="block h-5 w-14 rounded-full" style={{ background: ac }} /></div><i className="block h-16 rounded" style={{ background: ac, opacity: .6 }} /></div>}
        {layout === "grid" && <div className="mt-3 grid grid-cols-3 gap-2">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} className="block h-9 rounded" style={{ background: i % 2 ? ink : ac, opacity: .6 }} />)}</div>}
      </div>
    </div>
  );
}
