"use client";

import { useState, useEffect, useRef } from "react";
import type { BrandState } from "@/types/brand";
import { defaultBrand } from "@/types/brand";
import type { AssetTypeConfig, AssetTemplate } from "@/types/assets";
import { ASSET_TYPES } from "@/types/assets";
import {
  DashboardHeader,
  CompanyInfoCard,
  AssetSelector,
  AssetTemplateGrid,
  AssetEditor,
} from "@/components/dashboard";

export default function DashboardPage() {
  const [brand, setBrand] = useState<BrandState>({ ...defaultBrand });
  const [selectedAssetId, setSelectedAssetId] = useState(ASSET_TYPES[0].id);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorAsset, setEditorAsset] = useState<AssetTypeConfig>(ASSET_TYPES[0]);
  const [editorTemplate, setEditorTemplate] = useState<AssetTemplate>(ASSET_TYPES[0].templates[0]);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const loadedRef = useRef(false);

  // Load brand data on mount
  useEffect(() => {
    async function loadBrand() {
      try {
        const res = await fetch("/api/brand");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setBrand({
              name: data.name ?? defaultBrand.name,
              tagline: data.tagline ?? defaultBrand.tagline,
              email: data.email ?? defaultBrand.email,
              phone: data.phone ?? defaultBrand.phone,
              logo: data.logo_url ?? null,
            });
          }
        }
      } catch {
        // Fall back to defaults
      } finally {
        loadedRef.current = true;
      }
    }
    loadBrand();
  }, []);

  const update = (patch: Partial<BrandState>) => {
    setBrand((b) => ({ ...b, ...patch }));
    if (loadedRef.current) setDirty(true);
  };

  const saveBrand = async () => {
    setSaving(true);
    try {
      await fetch("/api/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brand.name,
          tagline: brand.tagline,
          email: brand.email,
          phone: brand.phone,
          logo_url: brand.logo,
        }),
      });
      setDirty(false);
    } catch {
      // Could add error handling UI
    } finally {
      setSaving(false);
    }
  };

  const selectedAsset = ASSET_TYPES.find((a) => a.id === selectedAssetId) ?? ASSET_TYPES[0];

  const openEditor = (asset: AssetTypeConfig, template: AssetTemplate) => {
    setEditorAsset(asset);
    setEditorTemplate(template);
    setEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <DashboardHeader companyName={brand.name} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Brand Dashboard</h1>
            <p className="mt-1 text-zinc-400">
              Manage your brand identity and assets
            </p>
          </div>
          <button
            onClick={() => { setBrand({ ...defaultBrand }); setDirty(true); }}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <CompanyInfoCard
              brand={brand}
              onUpdate={update}
              dirty={dirty}
              saving={saving}
              onSave={saveBrand}
            />
          </div>

          <div className="space-y-6">
            <AssetSelector
              selected={selectedAssetId}
              onChange={setSelectedAssetId}
            />
            <AssetTemplateGrid
              asset={selectedAsset}
              onSelect={(tpl) => openEditor(selectedAsset, tpl)}
            />
          </div>
        </div>
      </main>

      <AssetEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        asset={editorAsset}
        template={editorTemplate}
        brand={brand}
      />
    </div>
  );
}
