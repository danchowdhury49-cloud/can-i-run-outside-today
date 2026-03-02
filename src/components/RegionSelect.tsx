import { REGIONS, type Region } from "@/lib/regions";

type Props = {
  value: string;
  onChange: (slug: string) => void;

  // optional: force zoom/refocus even if selection didn't change
  onFocus?: () => void;
};

export function RegionSelect({ value, onChange, onFocus }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        Region
      </label>

      <div className="flex items-center gap-2">
        <select
          className="w-full rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {REGIONS.map((region: Region) => (
            <option key={region.slug} value={region.slug}>
              {region.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onFocus}
          className="whitespace-nowrap rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-primary"
          title="Zoom map to selected region"
        >
          Focus
        </button>
      </div>
    </div>
  );
}