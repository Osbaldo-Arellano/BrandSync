import type { AssetTypeConfig } from "@/types/assets";

// Print-safe CMYK-friendly colors
const P = {
  light: {
    bg: "#ffffff",
    name: "#1a1a1a",
    secondary: "#4d4d4d",
    detail: "#595959",
    muted: "#808080",
    placeholder: "#cccccc",
    accent: "#1a56db",
    rule: "#cccccc",
  },
  dark: {
    bg: "#09090b",     // zinc-950
    name: "#fafafa",   // zinc-50
    secondary: "#a1a1aa", // zinc-400
    detail: "#71717a", // zinc-500
    muted: "#52525b",  // zinc-600
    placeholder: "#3f3f46", // zinc-700
    accent: "#2563eb", // blue-600
    rule: "#27272a",   // zinc-800
  },
} as const;

interface GenerateOptions {
  asset: AssetTypeConfig;
  templateId: string;
  fields: Record<string, string>;
  logo: string | null;
  dark?: boolean;
}

export function generateAssetHTML(opts: GenerateOptions): string {
  const key = `${opts.asset.id}::${opts.templateId}`;
  const gen = GENERATORS[key];
  if (!gen) return fallbackHTML(opts);
  return gen(opts);
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

export function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function printReset(w: string, h: string, bg: string): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: ${w} ${h}; margin: 0; }
    html, body {
      width: ${w}; height: ${h};
      margin: 0; padding: 0; background: ${bg};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    body { font-family: system-ui, -apple-system, sans-serif; }
  `;
}

export function logoImg(logo: string | null, maxH: string, maxW: string): string {
  if (!logo) return "";
  return `<img src="${logo}" alt="Logo" style="max-height:${maxH};max-width:${maxW};object-fit:contain;">`;
}

export function wrap(w: string, h: string, bg: string, css: string, body: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
${printReset(w, h, bg)}
${css}
</style></head><body>${body}</body></html>`;
}

// ---------------------------------------------------------------------------
// Generator registry
// ---------------------------------------------------------------------------

type GenFn = (opts: GenerateOptions) => string;
const GENERATORS: Record<string, GenFn> = {};

function reg(assetId: string, templateId: string, fn: GenFn) {
  GENERATORS[`${assetId}::${templateId}`] = fn;
}

// ---------------------------------------------------------------------------
// BUSINESS CARDS
// ---------------------------------------------------------------------------

reg("business-card", "modern", ({ asset, fields, logo, dark }) => {
  const c = dark ? P.dark : P.light;
  return wrap(asset.width, asset.height, c.bg, `
    .card { width:${asset.width}; height:${asset.height}; background:${c.bg}; display:flex; flex-direction:column; justify-content:space-between; padding:16px; }
    .top { display:flex; align-items:flex-start; justify-content:space-between; }
    .accent { width:32px; height:4px; background:${c.accent}; margin-top:8px; }
    .name { font-size:14px; font-weight:600; color:${c.name}; margin-bottom:2px; }
    .sub { font-size:11px; color:${c.secondary}; margin-bottom:2px; }
    .tagline { font-size:11px; color:${c.secondary}; margin-bottom:8px; }
    .contact { font-size:11px; color:${c.detail}; line-height:1.4; }
  `, `<div class="card">
    <div class="top">${logoImg(logo, "32px", "80px")}<div class="accent"></div></div>
    <div>
      <div class="name">${esc(fields.name || "")}</div>
      <div class="sub">${esc(fields.title || "")}</div>
      <div class="tagline">${esc(fields.tagline || "")}</div>
      <div class="contact"><p>${esc(fields.email || "")}</p><p>${esc(fields.phone || "")}</p></div>
    </div>
  </div>`);
});

reg("business-card", "bold", ({ asset, fields, logo, dark }) => {
  const c = dark ? P.dark : P.light;
  const stripe = dark ? c.accent : c.name;
  return wrap(asset.width, asset.height, c.bg, `
    .card { width:${asset.width}; height:${asset.height}; background:${c.bg}; display:flex; overflow:hidden; }
    .stripe { width:8px; background:${stripe}; flex-shrink:0; }
    .content { flex:1; display:flex; flex-direction:column; justify-content:center; padding:12px 16px; }
    .logo-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
    .name { font-size:14px; font-weight:700; color:${c.name}; text-transform:uppercase; letter-spacing:0.05em; }
    .sub { font-size:11px; color:${c.secondary}; margin-bottom:2px; }
    .tagline { font-size:11px; color:${c.secondary}; margin-bottom:8px; }
    .contact { display:flex; gap:16px; font-size:11px; color:${c.detail}; }
  `, `<div class="card">
    <div class="stripe"></div>
    <div class="content">
      <div class="logo-row">${logoImg(logo, "24px", "64px")}</div>
      <div class="name">${esc(fields.name || "")}</div>
      <div class="sub">${esc(fields.title || "")}</div>
      <div class="tagline">${esc(fields.tagline || "")}</div>
      <div class="contact"><span>${esc(fields.email || "")}</span><span>${esc(fields.phone || "")}</span></div>
    </div>
  </div>`);
});

// ---------------------------------------------------------------------------
// ENVELOPES
// ---------------------------------------------------------------------------

reg("envelope", "classic", ({ asset, fields, logo, dark }) => {
  const c = dark ? P.dark : P.light;
  return wrap(asset.width, asset.height, c.bg, `
    .env { width:${asset.width}; height:${asset.height}; background:${c.bg}; padding:24px 32px; position:relative; }
    .from { position:absolute; top:24px; left:32px; }
    .from-name { font-size:12px; font-weight:600; color:${c.name}; margin-bottom:2px; }
    .from-addr { font-size:10px; color:${c.detail}; white-space:pre-line; }
    .to { position:absolute; top:50%; left:50%; transform:translate(-50%,-30%); text-align:center; }
    .to-name { font-size:14px; font-weight:600; color:${c.name}; margin-bottom:4px; }
    .to-addr { font-size:12px; color:${c.detail}; white-space:pre-line; }
    .rule { position:absolute; bottom:24px; left:32px; right:32px; height:1px; background:${c.rule}; }
  `, `<div class="env">
    <div class="from">
      ${logoImg(logo, "32px", "90px")}
      <div class="from-name">${esc(fields.fromName || "")}</div>
      <div class="from-addr">${esc(fields.fromAddress || "")}</div>
    </div>
    <div class="to">
      <div class="to-name">${esc(fields.toName || "")}</div>
      <div class="to-addr">${esc(fields.toAddress || "")}</div>
    </div>
    <div class="rule"></div>
  </div>`);
});

reg("envelope", "modern", ({ asset, fields, logo, dark }) => {
  const c = dark ? P.dark : P.light;
  return wrap(asset.width, asset.height, c.bg, `
    .env { width:${asset.width}; height:${asset.height}; background:${c.bg}; padding:24px 32px; display:flex; flex-direction:column; justify-content:space-between; }
    .top { display:flex; align-items:center; gap:12px; }
    .accent { width:40px; height:3px; background:${c.accent}; }
    .from-name { font-size:11px; font-weight:600; color:${c.name}; }
    .from-addr { font-size:9px; color:${c.detail}; }
    .center { text-align:center; padding:0 60px; }
    .to-name { font-size:14px; font-weight:600; color:${c.name}; margin-bottom:4px; }
    .to-addr { font-size:12px; color:${c.detail}; white-space:pre-line; }
    .bottom { height:2px; background:${c.accent}; }
  `, `<div class="env">
    <div class="top">
      ${logoImg(logo, "28px", "80px")}
      <div>
        <div class="from-name">${esc(fields.fromName || "")}</div>
        <div class="from-addr">${esc(fields.fromAddress || "")}</div>
      </div>
    </div>
    <div class="center">
      <div class="to-name">${esc(fields.toName || "")}</div>
      <div class="to-addr">${esc(fields.toAddress || "")}</div>
    </div>
    <div class="bottom"></div>
  </div>`);
});

// ---------------------------------------------------------------------------
// LETTERHEADS
// ---------------------------------------------------------------------------

reg("letterhead", "simple", ({ asset, fields, logo, dark }) => {
  const c = dark ? P.dark : P.light;
  return wrap(asset.width, asset.height, c.bg, `
    .page { width:${asset.width}; height:${asset.height}; background:${c.bg}; display:flex; flex-direction:column; }
    .header { padding:32px 48px 16px; display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid ${c.accent}; }
    .brand { display:flex; align-items:center; gap:12px; }
    .co-name { font-size:18px; font-weight:700; color:${c.name}; }
    .co-tag { font-size:10px; color:${c.secondary}; margin-top:2px; }
    .contact-col { text-align:right; font-size:9px; color:${c.detail}; line-height:1.5; }
    .body { flex:1; padding:32px 48px; }
    .body-line { width:100%; height:1px; background:${c.rule}; margin-bottom:18px; opacity:0.4; }
    .footer { padding:16px 48px; border-top:1px solid ${c.rule}; font-size:8px; color:${c.muted}; text-align:center; }
  `, `<div class="page">
    <div class="header">
      <div class="brand">
        ${logoImg(logo, "36px", "90px")}
        <div><div class="co-name">${esc(fields.companyName || "")}</div><div class="co-tag">${esc(fields.tagline || "")}</div></div>
      </div>
      <div class="contact-col">
        <div>${esc(fields.address || "")}</div>
        <div>${esc(fields.phone || "")}</div>
        <div>${esc(fields.email || "")}</div>
        <div>${esc(fields.website || "")}</div>
      </div>
    </div>
    <div class="body">${Array(20).fill('<div class="body-line"></div>').join("")}</div>
    <div class="footer">${esc(fields.companyName || "")} &bull; ${esc(fields.address || "")}</div>
  </div>`);
});

reg("letterhead", "formal", ({ asset, fields, logo, dark }) => {
  const c = dark ? P.dark : P.light;
  return wrap(asset.width, asset.height, c.bg, `
    .page { width:${asset.width}; height:${asset.height}; background:${c.bg}; display:flex; flex-direction:column; }
    .top-bar { height:6px; background:${c.accent}; }
    .header { padding:24px 48px; display:flex; justify-content:space-between; align-items:center; }
    .brand { display:flex; align-items:center; gap:10px; }
    .co-name { font-size:20px; font-weight:700; color:${c.name}; letter-spacing:0.02em; }
    .co-tag { font-size:9px; color:${c.secondary}; text-transform:uppercase; letter-spacing:0.1em; margin-top:2px; }
    .contact-col { text-align:right; font-size:9px; color:${c.detail}; line-height:1.6; }
    .rule { height:1px; background:${c.rule}; margin:0 48px; }
    .body { flex:1; padding:28px 48px; }
    .body-line { width:100%; height:1px; background:${c.rule}; margin-bottom:18px; opacity:0.3; }
    .footer { padding:16px 48px; display:flex; justify-content:space-between; font-size:8px; color:${c.muted}; border-top:1px solid ${c.rule}; }
  `, `<div class="page">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand">
        ${logoImg(logo, "40px", "100px")}
        <div><div class="co-name">${esc(fields.companyName || "")}</div><div class="co-tag">${esc(fields.tagline || "")}</div></div>
      </div>
      <div class="contact-col">
        <div>${esc(fields.address || "")}</div>
        <div>${esc(fields.phone || "")} &bull; ${esc(fields.email || "")}</div>
        <div>${esc(fields.website || "")}</div>
      </div>
    </div>
    <div class="rule"></div>
    <div class="body">${Array(22).fill('<div class="body-line"></div>').join("")}</div>
    <div class="footer"><span>${esc(fields.companyName || "")}</span><span>${esc(fields.website || "")}</span></div>
  </div>`);
});

// ---------------------------------------------------------------------------
// INVOICES
// ---------------------------------------------------------------------------

reg("invoice", "clean", ({ asset, fields, logo, dark }) => {
  const c = dark ? P.dark : P.light;
  const lineItems = (fields.items || "").split("\n").filter(Boolean);
  return wrap(asset.width, asset.height, c.bg, `
    .page { width:${asset.width}; height:${asset.height}; background:${c.bg}; padding:40px 48px; display:flex; flex-direction:column; }
    .top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
    .brand { display:flex; align-items:center; gap:10px; }
    .co-name { font-size:16px; font-weight:700; color:${c.name}; }
    .co-addr { font-size:9px; color:${c.detail}; margin-top:2px; }
    .inv-title { font-size:22px; font-weight:700; color:${c.accent}; text-align:right; }
    .inv-meta { font-size:10px; color:${c.detail}; text-align:right; margin-top:4px; }
    .parties { display:flex; gap:40px; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid ${c.rule}; }
    .party-label { font-size:8px; color:${c.muted}; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px; }
    .party-name { font-size:12px; font-weight:600; color:${c.name}; }
    .party-addr { font-size:10px; color:${c.detail}; white-space:pre-line; }
    .table { width:100%; border-collapse:collapse; margin-bottom:16px; flex:1; }
    .table th { text-align:left; font-size:9px; color:${c.muted}; text-transform:uppercase; letter-spacing:0.06em; padding:6px 0; border-bottom:2px solid ${c.accent}; }
    .table td { font-size:10px; color:${c.detail}; padding:6px 0; border-bottom:1px solid ${c.rule}; }
    .total-row { display:flex; justify-content:flex-end; gap:24px; padding:12px 0; border-top:2px solid ${c.accent}; }
    .total-label { font-size:12px; font-weight:600; color:${c.secondary}; }
    .total-val { font-size:14px; font-weight:700; color:${c.name}; }
  `, `<div class="page">
    <div class="top">
      <div class="brand">${logoImg(logo, "48px", "120px")}<div><div class="co-name">${esc(fields.companyName || "")}</div><div class="co-addr">${esc(fields.companyAddress || "")}</div></div></div>
      <div><div class="inv-title">INVOICE</div><div class="inv-meta">${esc(fields.invoiceNumber || "")} &bull; ${esc(fields.date || "")}<br>Due: ${esc(fields.dueDate || "")}</div></div>
    </div>
    <div class="parties">
      <div><div class="party-label">Bill To</div><div class="party-name">${esc(fields.clientName || "")}</div><div class="party-addr">${esc(fields.clientAddress || "")}</div></div>
    </div>
    <table class="table">
      <thead><tr><th>Description</th></tr></thead>
      <tbody>${lineItems.map((l) => `<tr><td>${esc(l)}</td></tr>`).join("") || '<tr><td style="opacity:0.4">No items</td></tr>'}</tbody>
    </table>
    <div class="total-row"><span class="total-label">Total</span><span class="total-val">${esc(fields.total || "$0.00")}</span></div>
  </div>`);
});

reg("invoice", "minimal", ({ asset, fields, logo, dark }) => {
  const c = dark ? P.dark : P.light;
  const lineItems = (fields.items || "").split("\n").filter(Boolean);
  return wrap(asset.width, asset.height, c.bg, `
    .page { width:${asset.width}; height:${asset.height}; background:${c.bg}; padding:40px 48px; display:flex; flex-direction:column; }
    .header { display:flex; justify-content:space-between; align-items:flex-end; padding-bottom:16px; border-bottom:1px solid ${c.rule}; margin-bottom:20px; }
    .co-name { font-size:14px; font-weight:600; color:${c.name}; }
    .co-addr { font-size:9px; color:${c.detail}; }
    .inv-num { font-size:10px; color:${c.muted}; text-align:right; }
    .inv-label { font-size:18px; font-weight:700; color:${c.name}; text-align:right; }
    .meta { display:flex; justify-content:space-between; margin-bottom:20px; }
    .meta-block { font-size:10px; color:${c.detail}; }
    .meta-label { font-size:8px; color:${c.muted}; text-transform:uppercase; margin-bottom:2px; }
    .meta-val { font-weight:600; color:${c.name}; }
    .items { flex:1; }
    .item { padding:6px 0; border-bottom:1px solid ${c.rule}; font-size:10px; color:${c.detail}; }
    .total-bar { margin-top:12px; padding-top:12px; border-top:2px solid ${c.name}; display:flex; justify-content:flex-end; gap:20px; }
    .total-label { font-size:11px; color:${c.secondary}; }
    .total-val { font-size:14px; font-weight:700; color:${c.name}; }
  `, `<div class="page">
    <div class="header">
      <div>${logoImg(logo, "40px", "100px")}<div class="co-name">${esc(fields.companyName || "")}</div><div class="co-addr">${esc(fields.companyAddress || "")}</div></div>
      <div><div class="inv-label">Invoice</div><div class="inv-num">${esc(fields.invoiceNumber || "")}</div></div>
    </div>
    <div class="meta">
      <div class="meta-block"><div class="meta-label">Bill To</div><div class="meta-val">${esc(fields.clientName || "")}</div><div>${esc(fields.clientAddress || "")}</div></div>
      <div class="meta-block" style="text-align:right"><div class="meta-label">Date</div><div>${esc(fields.date || "")}</div><div class="meta-label" style="margin-top:6px">Due</div><div>${esc(fields.dueDate || "")}</div></div>
    </div>
    <div class="items">${lineItems.map((l) => `<div class="item">${esc(l)}</div>`).join("") || '<div class="item" style="opacity:0.4">No items</div>'}</div>
    <div class="total-bar"><span class="total-label">Total</span><span class="total-val">${esc(fields.total || "$0.00")}</span></div>
  </div>`);
});

// ---------------------------------------------------------------------------
// Fallback
// ---------------------------------------------------------------------------

function fallbackHTML({ asset, fields, dark }: GenerateOptions): string {
  const c = dark ? P.dark : P.light;
  return wrap(asset.width, asset.height, c.bg, `
    .page { width:${asset.width}; height:${asset.height}; background:${c.bg}; display:flex; align-items:center; justify-content:center; }
    .msg { font-size:14px; color:${c.muted}; }
  `, `<div class="page"><p class="msg">Template preview not available</p></div>`);
}
