/**
 * Dashboard hero illustration — a monitor displaying a shield/lock with
 * settings gears and circuit traces. Matches DSG/Dashboard-2.png and
 * Dashboard-4.png (desktop-only decoration; not present in the sampled
 * mobile frame, so hidden below lg).
 */
export function PrivacyHeroArt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 270" role="img" aria-label="" {...props}>
      {/* shadow */}
      <ellipse cx="150" cy="258" rx="110" ry="7" className="fill-brand-200/60" />

      {/* stand + base */}
      <rect x="136" y="208" width="28" height="26" className="fill-brand-300" />
      <rect x="98" y="232" width="104" height="15" rx="4" className="fill-brand-600" />

      {/* outer monitor frame */}
      <rect x="8" y="8" width="284" height="204" rx="22" className="fill-brand-200" />
      {/* screen */}
      <rect x="24" y="24" width="252" height="172" rx="14" className="fill-brand-500" />

      {/* gears */}
      <g className="fill-brand-300">
        <Gear cx={102} cy={86} r={26} teeth={8} />
      </g>
      <g className="fill-white/90">
        <Gear cx={78} cy={146} r={34} teeth={10} />
      </g>

      {/* circuit traces */}
      <g fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.2" strokeLinecap="round">
        <path d="M198 160h20l10 10h20" />
        <path d="M198 178h34l10-10h16" />
        <path d="M226 130h38" />
      </g>
      <g fill="#ffffff" fillOpacity="0.9">
        <circle cx="198" cy="160" r="3.2" />
        <circle cx="198" cy="178" r="3.2" />
        <circle cx="226" cy="130" r="3.2" />
        <circle cx="248" cy="170" r="3.2" />
        <circle cx="264" cy="178" r="3.2" />
      </g>

      {/* shield */}
      <path
        d="M180 62l38-14 38 14v38c0 30-17 52-38 60-21-8-38-30-38-60z"
        fill="#0f4fa8"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* padlock */}
      <path
        d="M204 108v-10a14 14 0 0 1 28 0v10"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect x="196" y="106" width="44" height="34" rx="6" fill="#ffffff" />
      <circle cx="218" cy="119" r="5" fill="#0f4fa8" />
      <rect x="215" y="122" width="6" height="10" rx="2" fill="#0f4fa8" />
    </svg>
  );
}

function Gear({ cx, cy, r, teeth }: { cx: number; cy: number; r: number; teeth: number }) {
  const toothWidth = (Math.PI * 2 * r) / (teeth * 2.2);
  const rects = Array.from({ length: teeth }, (_, i) => {
    const angle = (360 / teeth) * i;
    return (
      <rect
        key={i}
        x={cx - toothWidth / 2}
        y={cy - r - toothWidth * 0.6}
        width={toothWidth}
        height={toothWidth * 1.2}
        rx={1.5}
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
    );
  });
  return (
    <>
      {rects}
      <circle cx={cx} cy={cy} r={r * 0.72} />
      <circle cx={cx} cy={cy} r={r * 0.28} className="fill-brand-500" />
    </>
  );
}
