import type { AssetTypeConfig, AssetTemplate } from "@/types/assets";

interface AssetTemplateGridProps {
  asset: AssetTypeConfig;
  onSelect: (template: AssetTemplate) => void;
}

export function AssetTemplateGrid({ asset, onSelect }: AssetTemplateGridProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
          </svg>
          {asset.label}
        </h2>
        <p className="text-sm text-zinc-400">{asset.description}</p>
      </div>
      <div className="space-y-4 p-6">
        <div className="grid grid-cols-2 gap-4">
          {asset.templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl)}
              className="group text-left"
            >
              <div
                className="overflow-hidden rounded-lg border-2 border-zinc-700 bg-zinc-800 transition-colors hover:border-blue-500"
                style={{ aspectRatio: asset.aspect }}
              >
                <TemplateThumbnail assetId={asset.id} templateId={tpl.id} />
              </div>
              <p className="mt-2 text-sm font-medium transition-colors group-hover:text-blue-400">
                {tpl.name}
              </p>
              <p className="text-xs text-zinc-500">{tpl.description}</p>
            </button>
          ))}
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <p className="text-center text-sm text-zinc-500">
            Select a template to customize
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini skeleton thumbnails per asset/template
// ---------------------------------------------------------------------------

function TemplateThumbnail({ assetId, templateId }: { assetId: string; templateId: string }) {
  const key = `${assetId}::${templateId}`;

  switch (key) {
    // Business cards
    case "business-card::modern":
      return (
        <div className="flex h-full w-full flex-col justify-between p-3">
          <div className="flex items-start justify-between">
            <div className="h-3 w-6 rounded bg-zinc-600" />
            <div className="h-0.5 w-4 bg-blue-500" />
          </div>
          <div>
            <div className="mb-1 h-2 w-16 rounded bg-zinc-300" />
            <div className="mb-2 h-1.5 w-12 rounded bg-zinc-500" />
            <div className="mb-0.5 h-1 w-20 rounded bg-zinc-600" />
            <div className="h-1 w-14 rounded bg-zinc-600" />
          </div>
        </div>
      );
    case "business-card::bold":
      return (
        <div className="flex h-full w-full">
          <div className="w-1.5 bg-blue-500" />
          <div className="flex flex-1 flex-col justify-center p-3">
            <div className="mb-2 h-2.5 w-5 rounded bg-zinc-600" />
            <div className="mb-1 h-2 w-14 rounded bg-zinc-300" />
            <div className="mb-2 h-1.5 w-10 rounded bg-zinc-500" />
            <div className="flex gap-2">
              <div className="h-1 w-12 rounded bg-zinc-600" />
              <div className="h-1 w-10 rounded bg-zinc-600" />
            </div>
          </div>
        </div>
      );

    // Envelopes
    case "envelope::classic":
      return (
        <div className="relative flex h-full w-full p-3">
          <div className="absolute left-3 top-3">
            <div className="mb-1 h-1.5 w-10 rounded bg-zinc-400" />
            <div className="h-1 w-16 rounded bg-zinc-600" />
          </div>
          <div className="m-auto text-center">
            <div className="mx-auto mb-1 h-2 w-14 rounded bg-zinc-300" />
            <div className="mx-auto h-1 w-20 rounded bg-zinc-500" />
          </div>
          <div className="absolute bottom-3 left-3 right-3 h-px bg-zinc-600" />
        </div>
      );
    case "envelope::modern":
      return (
        <div className="flex h-full w-full flex-col justify-between p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-5 rounded bg-zinc-600" />
            <div className="h-1.5 w-10 rounded bg-zinc-400" />
          </div>
          <div className="text-center">
            <div className="mx-auto mb-1 h-2 w-14 rounded bg-zinc-300" />
            <div className="mx-auto h-1 w-20 rounded bg-zinc-500" />
          </div>
          <div className="h-0.5 bg-blue-500" />
        </div>
      );

    // Letterheads
    case "letterhead::simple":
      return (
        <div className="flex h-full w-full flex-col p-3">
          <div className="mb-2 flex items-center justify-between border-b border-blue-500 pb-2">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-zinc-600" />
              <div className="h-2 w-10 rounded bg-zinc-300" />
            </div>
            <div className="space-y-0.5 text-right">
              <div className="h-0.5 w-8 rounded bg-zinc-600" />
              <div className="h-0.5 w-6 rounded bg-zinc-600" />
            </div>
          </div>
          <div className="flex-1 space-y-1.5 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-px w-full bg-zinc-700/50" />
            ))}
          </div>
        </div>
      );
    case "letterhead::formal":
      return (
        <div className="flex h-full w-full flex-col">
          <div className="h-1 bg-blue-500" />
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-zinc-600" />
              <div className="h-2 w-12 rounded bg-zinc-300" />
            </div>
            <div className="space-y-0.5 text-right">
              <div className="h-0.5 w-8 rounded bg-zinc-600" />
              <div className="h-0.5 w-6 rounded bg-zinc-600" />
            </div>
          </div>
          <div className="mx-3 h-px bg-zinc-700" />
          <div className="flex-1 space-y-1.5 px-3 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-px w-full bg-zinc-700/30" />
            ))}
          </div>
        </div>
      );

    // Invoices
    case "invoice::clean":
      return (
        <div className="flex h-full w-full flex-col p-3">
          <div className="mb-2 flex items-start justify-between">
            <div className="h-2 w-10 rounded bg-zinc-400" />
            <div className="h-2.5 w-8 rounded bg-blue-500/70" />
          </div>
          <div className="mb-2 h-px bg-zinc-700" />
          <div className="flex-1 space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-1 w-16 rounded bg-zinc-600" />
                <div className="h-1 w-6 rounded bg-zinc-600" />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-end border-t border-blue-500 pt-1">
            <div className="h-1.5 w-10 rounded bg-zinc-300" />
          </div>
        </div>
      );
    case "invoice::minimal":
      return (
        <div className="flex h-full w-full flex-col p-3">
          <div className="mb-2 flex items-end justify-between border-b border-zinc-700 pb-2">
            <div className="h-2 w-8 rounded bg-zinc-400" />
            <div className="h-2.5 w-7 rounded bg-zinc-300" />
          </div>
          <div className="flex-1 space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-1 w-full rounded bg-zinc-700" style={{ width: `${80 - i * 15}%` }} />
            ))}
          </div>
          <div className="mt-1 flex justify-end border-t-2 border-zinc-300 pt-1">
            <div className="h-1.5 w-10 rounded bg-zinc-300" />
          </div>
        </div>
      );

    default:
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-3 w-12 rounded bg-zinc-600" />
        </div>
      );
  }
}
