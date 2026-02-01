export interface AssetField {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel" | "textarea" | "currency";
  required?: boolean;
}

export interface AssetTemplate {
  id: string;
  name: string;
  description: string;
}

export interface AssetTypeConfig {
  id: string;
  label: string;
  description: string;
  width: string;   // CSS inches e.g. "3.5in"
  height: string;
  /** Pixel dimensions at 96dpi for on-screen preview */
  previewWidth: number;
  previewHeight: number;
  /** Aspect ratio CSS value e.g. "1.75/1" */
  aspect: string;
  templates: AssetTemplate[];
  fields: AssetField[];
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const ASSET_TYPES: AssetTypeConfig[] = [
  {
    id: "business-card",
    label: "Business Cards",
    description: "US Standard 3.5\" × 2\"",
    width: "3.5in",
    height: "2in",
    previewWidth: 336,   // 3.5 * 96
    previewHeight: 192,  // 2 * 96
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
  },
  {
    id: "envelope",
    label: "Envelopes",
    description: "#10 Envelope 9.5\" × 4.125\"",
    width: "9.5in",
    height: "4.125in",
    previewWidth: 912,   // 9.5 * 96
    previewHeight: 396,  // 4.125 * 96
    aspect: "9.5/4.125",
    templates: [
      { id: "classic", name: "Classic", description: "Traditional business envelope" },
      { id: "modern", name: "Modern", description: "Clean contemporary layout" },
    ],
    fields: [
      { key: "fromName", label: "From Name", placeholder: "Company Name", required: true },
      { key: "fromAddress", label: "From Address", placeholder: "123 Main St, City, ST 12345" },
      { key: "toName", label: "To Name", placeholder: "Recipient Name", required: true },
      { key: "toAddress", label: "To Address", placeholder: "456 Oak Ave, City, ST 67890" },
    ],
  },
  {
    id: "letterhead",
    label: "Letterheads",
    description: "US Letter 8.5\" × 11\"",
    width: "8.5in",
    height: "11in",
    previewWidth: 816,   // 8.5 * 96
    previewHeight: 1056, // 11 * 96
    aspect: "8.5/11",
    templates: [
      { id: "simple", name: "Simple", description: "Minimal clean header" },
      { id: "formal", name: "Formal", description: "Traditional with accent lines" },
    ],
    fields: [
      { key: "companyName", label: "Company Name", placeholder: "Company Name", required: true },
      { key: "tagline", label: "Tagline", placeholder: "Your company tagline" },
      { key: "address", label: "Address", placeholder: "123 Main St, City, ST 12345" },
      { key: "phone", label: "Phone", placeholder: "+1 (555) 123-4567", type: "tel" },
      { key: "email", label: "Email", placeholder: "contact@company.com", type: "email" },
      { key: "website", label: "Website", placeholder: "www.company.com" },
    ],
  },
  {
    id: "invoice",
    label: "Invoices",
    description: "US Letter 8.5\" × 11\"",
    width: "8.5in",
    height: "11in",
    previewWidth: 816,   // 8.5 * 96
    previewHeight: 1056, // 11 * 96
    aspect: "8.5/11",
    templates: [
      { id: "clean", name: "Clean", description: "Simple modern invoice" },
      { id: "minimal", name: "Minimal", description: "Stripped-down layout" },
    ],
    fields: [
      { key: "companyName", label: "Company Name", placeholder: "Company Name", required: true },
      { key: "companyAddress", label: "Company Address", placeholder: "123 Main St, City, ST 12345" },
      { key: "clientName", label: "Client Name", placeholder: "Client Name", required: true },
      { key: "clientAddress", label: "Client Address", placeholder: "456 Oak Ave, City, ST 67890" },
      { key: "invoiceNumber", label: "Invoice #", placeholder: "INV-001" },
      { key: "date", label: "Date", placeholder: "2026-01-28" },
      { key: "dueDate", label: "Due Date", placeholder: "2026-02-28" },
      { key: "items", label: "Line Items", placeholder: "Service description — $0.00", type: "textarea" },
      { key: "total", label: "Total", placeholder: "$0.00", type: "currency", required: true },
    ],
  },
];

export function getAssetType(id: string): AssetTypeConfig | undefined {
  return ASSET_TYPES.find((a) => a.id === id);
}
