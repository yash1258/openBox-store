"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet, FileText, Download, AlertCircle, Check, X, Table } from "lucide-react";

interface ImportResult {
  success: boolean;
  message: string;
  imported?: number;
  errors?: string[];
}

export default function ImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setResult(null);
    parseFile(selectedFile);
  };

  const parseFile = async (file: File) => {
    setParsing(true);
    setPreview([]);

    try {
      const text = await file.text();
      const lines = text.trim().split("\n");
      if (lines.length < 2) {
        setResult({ success: false, message: "File must have at least a header row and one data row" });
        setParsing(false);
        return;
      }

      // Parse header
      const headers = lines[0].split(/[\t,|]/).map((h) => h.trim().toLowerCase());
      const requiredHeaders = ["name", "sellingprice"];
      const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

      if (missingHeaders.length > 0) {
        setResult({
          success: false,
          message: `Missing required columns: ${missingHeaders.join(", ")}. Required: name, sellingprice. Optional: description, category, condition, originalprice, images`,
        });
        setParsing(false);
        return;
      }

      // Parse data rows
      const data: Record<string, string>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/[\t,|]/);
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx]?.trim() || "";
        });
        if (row.name) {
          data.push(row);
        }
      }

      setPreview(data.slice(0, 5)); // Show first 5 rows
    } catch (error) {
      setResult({ success: false, message: "Failed to parse file. Please check the format." });
    }

    setParsing(false);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;

    setImporting(true);
    setResult(null);

    try {
      // Re-parse the full file
      if (!file) return;
      const text = await file.text();
      const lines = text.trim().split("\n");
      const headers = lines[0].split(/[\t,|]/).map((h) => h.trim().toLowerCase());

      const products = [];
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/[\t,|]/);
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx]?.trim() || "";
        });

        if (!row.name) continue;

        const product = {
          name: row.name,
          description: row.description || "",
          category: row.category || "Other",
          condition: row.condition || "openbox",
          originalPrice: row.originalprice ? parseFloat(row.originalprice) : null,
          sellingPrice: parseFloat(row.sellingprice) || 0,
          images: row.images ? JSON.stringify(row.images.split(";").filter(Boolean)) : "[]",
          status: "available",
        };

        if (!product.sellingPrice || product.sellingPrice <= 0) {
          errors.push(`Row ${i + 1}: Invalid price for "${product.name}"`);
          continue;
        }

        products.push(product);
      }

      if (products.length === 0) {
        setResult({ success: false, message: "No valid products found", errors });
        setImporting(false);
        return;
      }

      // Import all products
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });

      if (res.ok) {
        setResult({
          success: true,
          message: `Successfully imported ${products.length} products`,
          imported: products.length,
          errors: errors.length > 0 ? errors : undefined,
        });
        router.refresh();
      } else {
        throw new Error("Import failed");
      }
    } catch (error) {
      setResult({ success: false, message: "Import failed. Please try again." });
    }

    setImporting(false);
  };

  const downloadTemplate = () => {
    const template = `name\tdescription\tcategory\tcondition\toriginalprice\tsellingprice\timages
iPhone 14 Pro Max\tOpenbox iPhone with box\tMobiles\topenbox\t99999\t74999\thttps://example.com/img1.jpg;https://example.com/img2.jpg
Samsung Galaxy S23\tLike new condition\tMobiles\tlike_new\t85000\t62000\thttps://example.com/samsung.jpg
MacBook Air M2\tUsed but excellent condition\tLaptops\tused\t120000\t85000\thttps://example.com/macbook.jpg`;

    const blob = new Blob([template], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_template.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-stone-900">Import Products</h1>
        <p className="text-sm text-stone-500">Import products from Excel, CSV, or text files</p>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <h3 className="font-semibold text-amber-800 mb-2">How to import:</h3>
        <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
          <li>Prepare a file with columns: <strong>name</strong>, <strong>sellingprice</strong> (required)</li>
          <li>Optional columns: description, category, condition, originalprice, images (separated by ;)</li>
          <li>Supported formats: .txt, .csv (comma, tab, or pipe separated)</li>
          <li>Upload and preview before importing</li>
        </ol>
        <button
          onClick={downloadTemplate}
          className="mt-3 inline-flex items-center gap-2 text-amber-700 font-medium text-sm hover:underline"
        >
          <Download className="h-4 w-4" />
          Download Template
        </button>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!file ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-12 border-2 border-dashed border-stone-300 rounded-xl hover:border-amber-400 hover:bg-amber-50/50 transition-colors flex flex-col items-center"
          >
            <Upload className="h-12 w-12 text-stone-300 mb-4" />
            <span className="font-medium text-stone-600">Click to upload file</span>
            <span className="text-sm text-stone-400 mt-1">.txt, .csv, or .xlsx</span>
          </button>
        ) : (
          <div className="space-y-4">
            {/* Selected File */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-stone-400" />
                <div>
                  <p className="font-medium text-stone-900">{file.name}</p>
                  <p className="text-sm text-stone-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview([]);
                  setResult(null);
                }}
                className="p-2 hover:bg-stone-200 rounded-lg"
              >
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>

            {/* Preview */}
            {parsing ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
                <p className="text-stone-500 mt-2">Parsing file...</p>
              </div>
            ) : preview.length > 0 && (
              <div>
                <h3 className="font-medium text-stone-900 mb-2">Preview (first 5 rows)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-stone-100">
                      <tr>
                        {Object.keys(preview[0]).map((key) => (
                          <th key={key} className="px-3 py-2 text-left font-medium text-stone-600 capitalize">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {preview.map((row, idx) => (
                        <tr key={idx}>
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-3 py-2 text-stone-700 truncate max-w-[200px]">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Import Button */}
            {preview.length > 0 && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white rounded-xl font-medium transition-colors"
              >
                {importing ? "Importing..." : `Import ${preview.length > 5 ? preview.length : ""} Products`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-2xl p-4 ${result.success ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <Check className="h-5 w-5 text-emerald-500 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${result.success ? "text-emerald-800" : "text-red-800"}`}>
                {result.message}
              </p>
              {result.errors && result.errors.length > 0 && (
                <ul className="mt-2 text-sm text-red-700 space-y-1">
                  {result.errors.slice(0, 5).map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                  {result.errors.length > 5 && (
                    <li>...and {result.errors.length - 5} more errors</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
