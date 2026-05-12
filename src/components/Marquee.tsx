const PHRASES = [
  "gluten-free",
  "almond flour",
  "made to order",
  "small batch",
  "real ingredients",
  "indulgent",
];

export default function Marquee() {
  const items = [...PHRASES, ...PHRASES];
  return (
    <div className="border-y border-border bg-primary text-primary-foreground py-3 overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {items.map((p, i) => (
          <span key={i} className="mx-8 font-display tracking-wide text-sm uppercase">
            {p} &nbsp;·
          </span>
        ))}
      </div>
    </div>
  );
}
