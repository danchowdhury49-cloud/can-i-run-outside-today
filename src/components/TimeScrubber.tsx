type Props = {
  value: number;
  onChange: (value: number) => void;
};

function formatOffsetLabel(offset: number): string {
  if (offset === 0) return "Now";
  return `+${offset}h`;
}

function formatClock(offset: number): string {
  const now = new Date();
  const target = new Date(now.getTime() + offset * 60 * 60 * 1000);
  const h = target.getHours().toString().padStart(2, "0");
  return `${h}:00`;
}

export function TimeScrubber({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 text-xs">
  <span className="font-semibold uppercase tracking-wide text-slate-600">
    Time window
  </span>
  <span className="text-slate-600 whitespace-nowrap">
    {formatOffsetLabel(value)} &middot;{" "}
    <span className="font-medium">{formatClock(value)}</span>
  </span>
</div>
      <input
        type="range"
        min={0}
        max={24}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        className="accent-primary"
      />
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>Now</span>
        <span>+12h</span>
        <span>+24h</span>
      </div>
    </div>
  );
}

