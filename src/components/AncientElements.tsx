// Античные декоративные элементы

// Греческая колонна (SVG)
export function Column({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 200" className={className} fill="currentColor">
      {/* Капитель */}
      <rect x="0" y="0" width="40" height="8" rx="1" />
      <rect x="2" y="8" width="36" height="4" />
      <path d="M5 12 L5 20 Q20 25 35 20 L35 12 Z" />
      
      {/* Ствол с каннелюрами */}
      <rect x="6" y="20" width="28" height="160" />
      <line x1="10" y1="20" x2="10" y2="180" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <line x1="15" y1="20" x2="15" y2="180" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <line x1="20" y1="20" x2="20" y2="180" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <line x1="25" y1="20" x2="25" y2="180" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      <line x1="30" y1="20" x2="30" y2="180" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      
      {/* База */}
      <rect x="4" y="180" width="32" height="4" />
      <rect x="2" y="184" width="36" height="4" />
      <rect x="0" y="188" width="40" height="8" rx="1" />
    </svg>
  );
}

// Амфора (SVG)
export function Amphora({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 100" className={className} fill="currentColor">
      {/* Горлышко */}
      <ellipse cx="30" cy="8" rx="8" ry="4" />
      <rect x="22" y="8" width="16" height="5" />
      <ellipse cx="30" cy="13" rx="10" ry="5" />
      
      {/* Ручки */}
      <path d="M12 25 Q0 40 8 55 Q10 50 12 45" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M48 25 Q60 40 52 55 Q50 50 48 45" fill="none" stroke="currentColor" strokeWidth="3" />
      
      {/* Тело */}
      <path d="M20 13 Q10 30 10 50 Q10 80 30 95 Q50 80 50 50 Q50 30 40 13 Z" />
      
      {/* Декор */}
      <ellipse cx="30" cy="40" rx="15" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="30" cy="60" rx="18" ry="3" fill="rgba(0,0,0,0.1)" />
    </svg>
  );
}

// Лавровый венок
export function LaurelWreath({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="currentColor">
      {/* Левая ветвь */}
      <path d="M10 35 Q15 30 20 25" fill="none" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="12" cy="28" rx="6" ry="3" transform="rotate(-30 12 28)" />
      <ellipse cx="18" cy="22" rx="6" ry="3" transform="rotate(-40 18 22)" />
      <ellipse cx="26" cy="16" rx="6" ry="3" transform="rotate(-50 26 16)" />
      <ellipse cx="36" cy="12" rx="6" ry="3" transform="rotate(-60 36 12)" />
      <ellipse cx="46" cy="10" rx="6" ry="3" transform="rotate(-70 46 10)" />
      
      {/* Правая ветвь */}
      <path d="M90 35 Q85 30 80 25" fill="none" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="88" cy="28" rx="6" ry="3" transform="rotate(30 88 28)" />
      <ellipse cx="82" cy="22" rx="6" ry="3" transform="rotate(40 82 22)" />
      <ellipse cx="74" cy="16" rx="6" ry="3" transform="rotate(50 74 16)" />
      <ellipse cx="64" cy="12" rx="6" ry="3" transform="rotate(60 64 12)" />
      <ellipse cx="54" cy="10" rx="6" ry="3" transform="rotate(70 54 10)" />
    </svg>
  );
}

// Диоген с бочкой
export function Diogenes({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className}>
      {/* Бочка */}
      <ellipse cx="50" cy="100" rx="35" ry="10" fill="#8B6914" />
      <rect x="15" y="50" width="70" height="50" rx="35" fill="#A0824A" />
      <ellipse cx="50" cy="50" rx="35" ry="10" fill="#C4A060" />
      {/* Обручи бочки */}
      <ellipse cx="50" cy="60" rx="34" ry="8" fill="none" stroke="#5D4E37" strokeWidth="2" />
      <ellipse cx="50" cy="85" rx="34" ry="8" fill="none" stroke="#5D4E37" strokeWidth="2" />
      
      {/* Диоген */}
      {/* Тело/одежда */}
      <path d="M40 45 Q35 35 40 25 L60 25 Q65 35 60 45 Z" fill="#D4C4A8" />
      
      {/* Голова */}
      <circle cx="50" cy="18" r="12" fill="#E8D4B8" />
      
      {/* Борода */}
      <path d="M42 22 Q50 35 58 22" fill="#888" />
      
      {/* Глаза */}
      <circle cx="46" cy="16" r="1.5" fill="#5D4E37" />
      <circle cx="54" cy="16" r="1.5" fill="#5D4E37" />
      
      {/* Брови (мудрые) */}
      <path d="M43 13 Q46 11 49 13" fill="none" stroke="#666" strokeWidth="1" />
      <path d="M51 13 Q54 11 57 13" fill="none" stroke="#666" strokeWidth="1" />
      
      {/* Рука с чашей */}
      <path d="M62 35 Q75 40 70 50" fill="none" stroke="#E8D4B8" strokeWidth="4" />
      <ellipse cx="72" cy="52" rx="5" ry="3" fill="#C4A484" />
    </svg>
  );
}

// Греческий меандр (орнамент)
export function MeanderBorder({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 20" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <pattern id="meander" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 10 L10 10 L10 0 L30 0 L30 10 L20 10 L20 20 L40 20" />
      </pattern>
      <rect x="0" y="0" width="200" height="20" fill="url(#meander)" />
    </svg>
  );
}
