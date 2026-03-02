import { REGIONS, type Region } from "@/lib/regions";

type Props = {
  value: string;
  onChange: (slug: string) => void;
};

export function RegionSelect({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        Region
      </label>
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
    </div>
  );
}

