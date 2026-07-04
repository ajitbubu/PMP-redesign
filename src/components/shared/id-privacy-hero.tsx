/**
 * ID-PRIVACY® brand hero used on the auth screens. ID-PRIVACY® is the primary,
 * end-user-facing product mark (design-review brand decision); DataSafeguard
 * appears only as a "Powered by" credit on the form card.
 *
 * Illustration redrawn to match the Figma reference (documents flowing via
 * circuit traces into an AI-profile head with DL/ML/AI + CCE® labels, then
 * out to a shield) — see DSG/Login.png in the design source.
 */
export function IdPrivacyHero() {
  return (
    <div className="flex flex-col items-center text-center text-white">
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        ID-PRIVACY<sup className="text-xl">®</sup>
      </h1>
      <p className="mt-1 text-sm font-medium text-white/80">AI Powered Privacy Management</p>

      <HeroArt className="my-8 w-full max-w-md" />

      <p className="font-display text-lg font-semibold text-white/95 sm:text-xl">
        Automate&nbsp;:&nbsp;Privacy &amp; Compliance
      </p>
    </div>
  );
}

function HeroArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 440 220" role="img" aria-label="" className={className}>
      <defs>
        <pattern id="hero-grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0V22" fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
      </defs>

      {/* background texture */}
      <rect x="0" y="0" width="440" height="220" fill="url(#hero-grid)" />
      <circle
        cx="220"
        cy="110"
        r="98"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.18"
        strokeDasharray="2 6"
      />
      <g fill="#7dd3fc" fillOpacity="0.55">
        <circle cx="60" cy="60" r="2.2" />
        <circle cx="370" cy="70" r="2" />
        <circle cx="95" cy="150" r="1.8" />
      </g>
      <g fill="none" stroke="#a5c8f0" strokeOpacity="0.35" strokeWidth="1.4">
        <circle cx="98" cy="122" r="5" />
        <path d="M95 122h6M98 119v6" />
        <circle cx="200" cy="150" r="4" />
        <path d="M198 150h4M200 148v4" />
      </g>

      {/* documents, cascaded */}
      <g fill="none" stroke="#eaf2ff" strokeOpacity="0.9" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M40 62h26v32h-26z" />
        <path d="M46 70h14M46 76h14M46 82h9" strokeWidth="1.2" />

        <path d="M64 88h28l8 8v28h-36z" />
        <path d="M92 88v8h8" strokeWidth="1.2" />
        <path d="M70 100h20M70 106h20M70 112h13" strokeWidth="1.2" />

        <path d="M40 128h26v32h-26z" />
        <path d="M46 136h14M46 142h14M46 148h9" strokeWidth="1.2" />
      </g>

      {/* circuit bus from documents into the head */}
      <g fill="none" stroke="#dbeafe" strokeOpacity="0.7" strokeWidth="1.4">
        <path d="M66 62h26l14-14h54l16 25" />
        <path d="M66 78h74l30 -5" />
        <path d="M100 128h10l14-14h60l10 -25" />
        <path d="M66 144h94l30 -30" />
      </g>
      <g fill="#dbeafe" fillOpacity="0.9">
        <circle cx="66" cy="62" r="2.4" />
        <circle cx="66" cy="78" r="2.4" />
        <circle cx="66" cy="144" r="2.4" />
      </g>

      {/* profile head — angular circuit-styled cranium into a smooth human profile, facing right */}
      <path
        d="M213 159
           L210 73
           L223 51 L242 60 L260 47 L278 55 L294 49
           Q305 52 307 62
           Q312 75 325 100
           Q320 104 312 107
           Q316 110 317 114
           Q314 120 309 125
           Q300 135 291 140
           L252 148
           L213 159 Z"
        fill="none"
        stroke="#f5f9ff"
        strokeOpacity="0.92"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* chip + pins, upper interior */}
      <rect x="242" y="68" width="16" height="16" rx="2" fill="none" stroke="#eaf2ff" strokeWidth="1.6" />
      <g stroke="#eaf2ff" strokeWidth="1.6" strokeLinecap="round">
        <path d="M236 72v3M236 78v3M236 84v3" />
        <path d="M264 72v3M264 78v3M264 84v3" />
      </g>
      <text x="221" y="80" fontSize="11" fontWeight="700" fill="#ffffff">
        DL
      </text>
      <text x="266" y="80" fontSize="11" fontWeight="700" fill="#ffffff">
        ML
      </text>
      <text x="228" y="103" fontSize="11" fontWeight="700" fill="#ffffff">
        AI
      </text>

      {/* joint nodes, lower interior */}
      <circle cx="258" cy="107" r="5.5" fill="none" stroke="#bfe0ff" strokeWidth="2" />
      <path d="M258 112.5v8" stroke="#bfe0ff" strokeWidth="2" />
      <circle cx="258" cy="124" r="3.5" fill="none" stroke="#bfe0ff" strokeWidth="2" />

      <text x="255" y="145" fontSize="11" fontWeight="700" fill="#ffffff">
        CCE<tspan fontSize="6.5" dy="-4">®</tspan>
      </text>

      {/* shield with keyhole */}
      <path
        d="M366 76l20-8 20 8v22c0 16-9 28-20 32-11-4-20-16-20-32z"
        fill="none"
        stroke="#a8d1ff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="386" cy="96" r="5" fill="none" stroke="#a8d1ff" strokeWidth="1.8" />
      <path d="M386 101l0 9" stroke="#a8d1ff" strokeWidth="1.8" strokeLinecap="round" />
      <g fill="none" stroke="#dbeafe" strokeOpacity="0.6" strokeWidth="1.4">
        <path d="M406 84h20" />
        <path d="M406 118h16l6-6h12" />
      </g>
    </svg>
  );
}
