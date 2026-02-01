import { ASSET_TYPES } from "@/types/assets";

interface AssetSelectorProps {
  selected: string;
  onChange: (id: string) => void;
}

export function AssetSelector({ selected, onChange }: AssetSelectorProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="asset-type" className="block text-sm font-medium text-zinc-300">
        Asset Type
      </label>
      <select
        id="asset-type"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {ASSET_TYPES.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>
    </div>
  );
}
