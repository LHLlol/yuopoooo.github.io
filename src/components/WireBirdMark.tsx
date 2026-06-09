export default function WireBirdMark() {
  return (
    <div className="relative h-12 w-full overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 48" preserveAspectRatio="none">
        <path d="M -20 29 C 190 18, 340 20, 520 25 S 760 38, 930 18" fill="none" stroke="#08a9f4" strokeWidth="1" />
      </svg>
      <div className="absolute left-[58%] top-3 h-5 w-7 text-portfolioBlue">
        <span className="absolute bottom-0 right-1 h-4 w-3.5 rounded-[52%_48%_45%_55%] bg-current" />
        <span className="absolute bottom-1 right-3 h-3 w-2.5 rotate-[-28deg] rounded-[100%_0_100%_30%] bg-current" />
        <span className="absolute bottom-0 right-5 h-2 w-3 bg-current [clip-path:polygon(0_96%,100%_0,68%_100%,100%_100%)]" />
        <span className="absolute bottom-3 right-0 h-1.5 w-2 bg-current [clip-path:polygon(0_42%,100%_0,34%_100%)]" />
      </div>
    </div>
  );
}
