"use client";

import Link from "next/link";
import { X, ChevronDown } from "lucide-react";

interface FiltersProps {
  category: string;
  condition: string;
}

const CONDITIONS = [
  { value: "all", label: "All Conditions" },
  { value: "openbox", label: "Openbox" },
  { value: "like_new", label: "Like New" },
  { value: "used", label: "Used" },
];

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Mobiles", label: "Mobiles" },
  { value: "Laptops", label: "Laptops" },
  { value: "Accessories", label: "Accessories" },
  { value: "Home", label: "Home" },
  { value: "Other", label: "Other" },
];

export default function Filters({ category, condition }: FiltersProps) {
  const hasFilters = category !== "all" || condition !== "all";

  return (
    <section className="sticky top-14 lg:top-0 z-30 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-2">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={category}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set('category', e.target.value);
                window.location.href = url.toString();
              }}
              className="appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg px-3 md:px-4 py-2 pr-8 md:pr-10 text-xs md:text-sm font-medium text-stone-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>

          {/* Condition Dropdown */}
          <div className="relative">
            <select
              value={condition}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set('condition', e.target.value);
                window.location.href = url.toString();
              }}
              className="appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg px-3 md:px-4 py-2 pr-8 md:pr-10 text-xs md:text-sm font-medium text-stone-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond.value} value={cond.value}>{cond.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 pointer-events-none" />
          </div>

          {/* Clear Button */}
          {hasFilters && (
            <Link
              href={`/?category=all&condition=all`}
              className="flex items-center gap-1 px-2 md:px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs md:text-sm font-medium transition-colors"
            >
              <X className="h-3 w-3" />
              <span>Clear</span>
            </Link>
          )}

          {/* Active Filter Pills */}
          {hasFilters && (
            <div className="flex items-center gap-1.5 ml-auto">
              {category !== "all" && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                  {category}
                </span>
              )}
              {condition !== "all" && (
                <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-medium capitalize">
                  {condition.replace("_", " ")}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
