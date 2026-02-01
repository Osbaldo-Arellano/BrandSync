import { describe, it, expect } from "vitest";
import { esc, printReset, logoImg, wrap, generateAssetHTML } from "./asset-html";
import type { AssetTypeConfig } from "@/types/assets";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const BUSINESS_CARD: AssetTypeConfig = {
  id: "business-card",
  label: "Business Cards",
  description: 'US Standard 3.5" × 2"',
  width: "3.5in",
  height: "2in",
  previewWidth: 336,
  previewHeight: 192,
  aspect: "1.75/1",
  templates: [
    { id: "modern", name: "Modern Minimal", description: "Clean and contemporary design" },
    { id: "bold", name: "Bold Corporate", description: "Strong and professional look" },
  ],
  fields: [
    { key: "name", label: "Name", placeholder: "John Smith", required: true },
    { key: "title", label: "Title", placeholder: "Software Engineer" },
    { key: "email", label: "Email", placeholder: "contact@company.com", type: "email" },
    { key: "phone", label: "Phone", placeholder: "+1 (555) 123-4567", type: "tel" },
    { key: "tagline", label: "Tagline", placeholder: "Your company tagline" },
  ],
};

const INVOICE: AssetTypeConfig = {
  id: "invoice",
  label: "Invoices",
  description: 'US Letter 8.5" × 11"',
  width: "8.5in",
  height: "11in",
  previewWidth: 816,
  previewHeight: 1056,
  aspect: "8.5/11",
  templates: [
    { id: "clean", name: "Clean", description: "Simple modern invoice" },
    { id: "minimal", name: "Minimal", description: "Stripped-down layout" },
  ],
  fields: [
    { key: "companyName", label: "Company Name", placeholder: "Company Name", required: true },
    { key: "companyAddress", label: "Company Address", placeholder: "123 Main St" },
    { key: "clientName", label: "Client Name", placeholder: "Client Name", required: true },
    { key: "clientAddress", label: "Client Address", placeholder: "456 Oak Ave" },
    { key: "invoiceNumber", label: "Invoice #", placeholder: "INV-001" },
    { key: "date", label: "Date", placeholder: "2026-01-28" },
    { key: "dueDate", label: "Due Date", placeholder: "2026-02-28" },
    { key: "items", label: "Line Items", placeholder: "Service — $0.00", type: "textarea" },
    { key: "total", label: "Total", placeholder: "$0.00", type: "currency", required: true },
  ],
};

const ENVELOPE: AssetTypeConfig = {
  id: "envelope",
  label: "Envelopes",
  description: '#10 Envelope 9.5" × 4.125"',
  width: "9.5in",
  height: "4.125in",
  previewWidth: 912,
  previewHeight: 396,
  aspect: "9.5/4.125",
  templates: [
    { id: "classic", name: "Classic", description: "Traditional" },
    { id: "modern", name: "Modern", description: "Contemporary" },
  ],
  fields: [
    { key: "fromName", label: "From Name", placeholder: "Company Name", required: true },
    { key: "fromAddress", label: "From Address", placeholder: "123 Main St" },
    { key: "toName", label: "To Name", placeholder: "Recipient Name", required: true },
    { key: "toAddress", label: "To Address", placeholder: "456 Oak Ave" },
  ],
};

const LETTERHEAD: AssetTypeConfig = {
  id: "letterhead",
  label: "Letterheads",
  description: 'US Letter 8.5" × 11"',
  width: "8.5in",
  height: "11in",
  previewWidth: 816,
  previewHeight: 1056,
  aspect: "8.5/11",
  templates: [
    { id: "simple", name: "Simple", description: "Minimal" },
    { id: "formal", name: "Formal", description: "Traditional" },
  ],
  fields: [
    { key: "companyName", label: "Company Name", placeholder: "Company Name", required: true },
    { key: "tagline", label: "Tagline", placeholder: "Tagline" },
    { key: "address", label: "Address", placeholder: "123 Main St" },
    { key: "phone", label: "Phone", placeholder: "+1 555", type: "tel" },
    { key: "email", label: "Email", placeholder: "a@b.com", type: "email" },
    { key: "website", label: "Website", placeholder: "www.co.com" },
  ],
};

function baseOpts(asset: AssetTypeConfig, templateId: string, fields: Record<string, string> = {}, logo: string | null = null, dark = true) {
  return { asset, templateId, fields, logo, dark };
}

// ---------------------------------------------------------------------------
// 1A — esc()
// ---------------------------------------------------------------------------

describe("esc", () => {
  it("escapes & < > \" correctly", () => {
    const out = esc('Tom & "Jerry" <tag>');
    expect(out).toBe("Tom &amp; &quot;Jerry&quot; &lt;tag&gt;");
    expect(out).not.toMatch(/[<>"]/);
  });

  it("handles empty string", () => {
    expect(esc("")).toBe("");
  });

  it("double-escapes already-escaped strings (documented behavior)", () => {
    // This is the current behavior: &amp; → &amp;amp;
    // Documenting rather than preventing — input is expected to be raw, not pre-escaped.
    expect(esc("&amp;")).toBe("&amp;amp;");
  });

  it("does not escape single quotes (documented limitation)", () => {
    // Single quotes are NOT escaped. Safe because all HTML attribute injection
    // uses double-quoted attributes. Documenting for awareness.
    const out = esc("it's a test");
    expect(out).toContain("'");
  });

  it("handles a <script> injection attempt", () => {
    const out = esc('<script>alert("xss")</script>');
    expect(out).not.toContain("<script>");
    expect(out).toContain("&lt;script&gt;");
  });

  it("handles mixed special characters", () => {
    const out = esc('a & b < c > d "e"');
    expect(out).toBe('a &amp; b &lt; c &gt; d &quot;e&quot;');
  });
});

// ---------------------------------------------------------------------------
// 1B — generateAssetHTML() routing + fallback
// ---------------------------------------------------------------------------

describe("generateAssetHTML", () => {
  it("selects correct generator when key exists", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "modern", { name: "Alice" }));
    expect(html).toContain("Alice");
    expect(html).not.toContain("Template preview not available");
  });

  it("returns fallback HTML when key is missing", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "nonexistent"));
    expect(html).toContain("Template preview not available");
  });

  it("uses asset.id and templateId exactly for key formation", () => {
    // "business-card::modern" is valid, "business-card ::modern" is not
    const fakeAsset = { ...BUSINESS_CARD, id: "business-card " };
    const html = generateAssetHTML(baseOpts(fakeAsset, "modern"));
    expect(html).toContain("Template preview not available");
  });
});

// ---------------------------------------------------------------------------
// 1C — wrap() / printReset() — document contract
// ---------------------------------------------------------------------------

describe("wrap / printReset", () => {
  const html = wrap("3.5in", "2in", "#ffffff", ".test{}", "<p>hello</p>");

  it("starts with <!DOCTYPE html>", () => {
    expect(html).toMatch(/^<!DOCTYPE html>/);
  });

  it("contains <meta charset=\"UTF-8\">", () => {
    expect(html).toContain('<meta charset="UTF-8">');
  });

  it("contains @page with correct size", () => {
    expect(html).toContain("@page { size: 3.5in 2in; margin: 0; }");
  });

  it("contains background color in body", () => {
    expect(html).toContain("background: #ffffff");
  });

  it("contains print-color-adjust", () => {
    expect(html).toContain("print-color-adjust: exact");
    expect(html).toContain("-webkit-print-color-adjust: exact");
  });

  it("includes the custom CSS and body", () => {
    expect(html).toContain(".test{}");
    expect(html).toContain("<p>hello</p>");
  });
});

describe("printReset standalone", () => {
  it("sets width and height on html/body", () => {
    const css = printReset("8.5in", "11in", "#09090b");
    expect(css).toContain("width: 8.5in");
    expect(css).toContain("height: 11in");
  });
});

// ---------------------------------------------------------------------------
// 1D — logoImg()
// ---------------------------------------------------------------------------

describe("logoImg", () => {
  it("returns empty string when logo is null", () => {
    expect(logoImg(null, "32px", "80px")).toBe("");
  });

  it("returns <img> with correct attributes when logo provided", () => {
    const img = logoImg("https://example.com/logo.png", "32px", "80px");
    expect(img).toContain("<img");
    expect(img).toContain('src="https://example.com/logo.png"');
    expect(img).toContain('alt="Logo"');
    expect(img).toContain("max-height:32px");
    expect(img).toContain("max-width:80px");
  });

  it("does not escape logo URL (documented — relies on trusted input)", () => {
    // FINDING: A malicious logo string could break out of src="...".
    // Current design assumes logo URLs come from Supabase storage (trusted).
    // If user-supplied URLs are ever allowed, add escAttr().
    const malicious = 'x" onload="alert(1)';
    const img = logoImg(malicious, "32px", "80px");
    // Currently the raw string is injected — documenting this behavior
    expect(img).toContain(malicious);
  });
});

// ---------------------------------------------------------------------------
// 2 — Template tests: business cards
// ---------------------------------------------------------------------------

describe("business-card modern", () => {
  const fields = { name: "Alice", title: "Engineer", email: "a@b.com", phone: "555-1234", tagline: "We build" };

  it("renders all fields escaped", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "modern", fields));
    expect(html).toContain("Alice");
    expect(html).toContain("Engineer");
    expect(html).toContain("a@b.com");
    expect(html).toContain("555-1234");
    expect(html).toContain("We build");
  });

  it("escapes fields with special characters", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "modern", { name: '<script>alert("x")</script>' }));
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("dark mode uses dark palette background", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "modern", fields, null, true));
    expect(html).toContain("background:#09090b");
  });

  it("light mode uses light palette background", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "modern", fields, null, false));
    expect(html).toContain("background:#ffffff");
  });

  it("includes logo when provided", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "modern", fields, "https://logo.png"));
    expect(html).toContain("<img");
    expect(html).toContain("https://logo.png");
  });

  it("omits logo when null", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "modern", fields, null));
    expect(html).not.toContain("<img");
  });

  it("includes key CSS classes", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "modern", fields));
    expect(html).toContain(".card");
    expect(html).toContain(".name");
  });
});

describe("business-card bold", () => {
  const fields = { name: "Bob", title: "CEO", email: "b@c.com", phone: "555-0000", tagline: "Lead" };

  it("renders stripe element", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "bold", fields));
    expect(html).toContain("stripe");
  });

  it("dark mode uses dark background", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "bold", fields, null, true));
    expect(html).toContain("background:#09090b");
  });

  it("light mode uses light background", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "bold", fields, null, false));
    expect(html).toContain("background:#ffffff");
  });
});

// ---------------------------------------------------------------------------
// 2 — Envelopes
// ---------------------------------------------------------------------------

describe("envelope classic", () => {
  const fields = { fromName: "Acme", fromAddress: "123 Main\nCity, ST", toName: "Bob", toAddress: "456 Oak\nTown, ST" };

  it("contains white-space:pre-line for addresses", () => {
    const html = generateAssetHTML(baseOpts(ENVELOPE, "classic", fields));
    expect(html).toContain("white-space:pre-line");
  });

  it("renders from and to names", () => {
    const html = generateAssetHTML(baseOpts(ENVELOPE, "classic", fields));
    expect(html).toContain("Acme");
    expect(html).toContain("Bob");
  });
});

describe("envelope modern", () => {
  const fields = { fromName: "Acme", fromAddress: "123 Main", toName: "Bob", toAddress: "456 Oak" };

  it("contains accent bar", () => {
    const html = generateAssetHTML(baseOpts(ENVELOPE, "modern", fields));
    expect(html).toContain("accent");
  });

  it("contains white-space:pre-line", () => {
    const html = generateAssetHTML(baseOpts(ENVELOPE, "modern", fields));
    expect(html).toContain("white-space:pre-line");
  });
});

// ---------------------------------------------------------------------------
// 2 — Letterheads
// ---------------------------------------------------------------------------

describe("letterhead simple", () => {
  const fields = { companyName: "Acme Corp", tagline: "We build", address: "123 Main", phone: "555", email: "a@b.com", website: "acme.com" };

  it("footer includes company name and address", () => {
    const html = generateAssetHTML(baseOpts(LETTERHEAD, "simple", fields));
    expect(html).toContain("Acme Corp");
    expect(html).toContain("123 Main");
    // footer specifically
    expect(html).toContain('class="footer"');
  });

  it("header has border with accent color", () => {
    const html = generateAssetHTML(baseOpts(LETTERHEAD, "simple", fields, null, true));
    // dark accent is #2563eb
    expect(html).toContain("border-bottom:2px solid #2563eb");
  });
});

describe("letterhead formal", () => {
  const fields = { companyName: "Corp Inc", tagline: "Motto", address: "789 St", phone: "555", email: "c@d.com", website: "corp.com" };

  it("includes top accent bar", () => {
    const html = generateAssetHTML(baseOpts(LETTERHEAD, "formal", fields));
    expect(html).toContain("top-bar");
  });

  it("footer has company name and website", () => {
    const html = generateAssetHTML(baseOpts(LETTERHEAD, "formal", fields));
    expect(html).toContain("Corp Inc");
    expect(html).toContain("corp.com");
  });
});

// ---------------------------------------------------------------------------
// 2 — Invoices (line item parsing focus)
// ---------------------------------------------------------------------------

describe("invoice clean — line item parsing", () => {
  it("empty items shows 'No items'", () => {
    const html = generateAssetHTML(baseOpts(INVOICE, "clean", { items: "", total: "$0.00" }));
    expect(html).toContain("No items");
  });

  it("two items on separate lines renders 2 rows", () => {
    const html = generateAssetHTML(baseOpts(INVOICE, "clean", { items: "Service A\nService B", total: "$100.00" }));
    const matches = html.match(/<tr><td>/g);
    expect(matches).toHaveLength(2);
  });

  it("blank line between items is removed (filter(Boolean))", () => {
    const html = generateAssetHTML(baseOpts(INVOICE, "clean", { items: "A\n\nB", total: "$50" }));
    const matches = html.match(/<tr><td>/g);
    expect(matches).toHaveLength(2);
  });

  it("space-only line is kept (documented quirk — truthy string)", () => {
    // " " is truthy, so filter(Boolean) keeps it. This is a known quirk.
    // A fix would be: .map(l => l.trim()).filter(Boolean)
    const html = generateAssetHTML(baseOpts(INVOICE, "clean", { items: "A\n \nB", total: "$50" }));
    const matches = html.match(/<tr><td>/g);
    // Current behavior: 3 rows (A, " ", B)
    expect(matches).toHaveLength(3);
  });

  it("Windows newlines (\\r\\n) leave \\r in item text (documented quirk)", () => {
    // .split("\n") on "A\r\nB" produces ["A\r", "B"] — the \r stays.
    // A fix would be: .split(/\r?\n/)
    const html = generateAssetHTML(baseOpts(INVOICE, "clean", { items: "A\r\nB", total: "$50" }));
    const matches = html.match(/<tr><td>/g);
    expect(matches).toHaveLength(2);
    // The first item will contain the \r character — not harmful in HTML rendering
    // but semantically unclean
  });

  it("shows default $0.00 when total is empty", () => {
    const html = generateAssetHTML(baseOpts(INVOICE, "clean", {}));
    expect(html).toContain("$0.00");
  });

  it("escapes line item content", () => {
    const html = generateAssetHTML(baseOpts(INVOICE, "clean", { items: '<img src=x onerror=alert(1)>', total: "$1" }));
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img");
  });
});

describe("invoice minimal — line item parsing", () => {
  it("empty items shows 'No items'", () => {
    const html = generateAssetHTML(baseOpts(INVOICE, "minimal", { items: "", total: "$0.00" }));
    expect(html).toContain("No items");
  });

  it("renders items as div.item elements", () => {
    const html = generateAssetHTML(baseOpts(INVOICE, "minimal", { items: "X\nY\nZ", total: "$300" }));
    const matches = html.match(/class="item"/g);
    // 3 items + the .item CSS rule = we check the body items specifically
    expect(html).toContain(">X<");
    expect(html).toContain(">Y<");
    expect(html).toContain(">Z<");
  });

  it("shows default $0.00 when total is empty", () => {
    const html = generateAssetHTML(baseOpts(INVOICE, "minimal", {}));
    expect(html).toContain("$0.00");
  });
});

// ---------------------------------------------------------------------------
// Fallback HTML
// ---------------------------------------------------------------------------

describe("fallbackHTML", () => {
  it("contains the fallback message", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "does-not-exist"));
    expect(html).toContain("Template preview not available");
  });

  it("is still a valid HTML document", () => {
    const html = generateAssetHTML(baseOpts(BUSINESS_CARD, "nope"));
    expect(html).toMatch(/^<!DOCTYPE html>/);
    expect(html).toContain("<meta charset");
  });

  it("uses correct dimensions from asset", () => {
    const html = generateAssetHTML(baseOpts(INVOICE, "nope"));
    expect(html).toContain("@page { size: 8.5in 11in; margin: 0; }");
  });

  it("respects dark mode palette", () => {
    const dark = generateAssetHTML(baseOpts(BUSINESS_CARD, "nope", {}, null, true));
    const light = generateAssetHTML(baseOpts(BUSINESS_CARD, "nope", {}, null, false));
    expect(dark).toContain("background: #09090b");
    expect(light).toContain("background: #ffffff");
  });
});
