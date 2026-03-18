"use client";

import { useState } from "react";
import Image from "next/image";
import { TEMPLATES, Template } from "@/templates/index";
import { ArrowRight, Layers, ShoppingBag, Megaphone, User } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Commerce: <ShoppingBag size={13} />,
  Productivity: <Layers size={13} />,
  Marketing: <Megaphone size={13} />,
  Portfolio: <User size={13} />,
};

const CATEGORIES = ["All", "Commerce", "Productivity", "Marketing", "Portfolio"];

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  disabled?: boolean;
}

export function TemplateGallery({ onSelectTemplate, disabled }: TemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered =
    activeCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Start from a Template
        </h2>
        <p className="text-sm text-muted max-w-xl mx-auto">
          Production-ready Symbols projects. Pick one to generate a complete codebase, then customize with AI.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === cat
                ? "bg-accent text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                : "bg-surface text-muted border border-border hover:border-accent/40 hover:text-foreground"
            }`}
          >
            {cat !== "All" && CATEGORY_ICONS[cat]}
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            hovered={hoveredId === template.id}
            onHover={setHoveredId}
            onSelect={onSelectTemplate}
            disabled={disabled}
          />
        ))}
      </div>

      {/* Or describe your own */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted">
          or{" "}
          <span className="text-accent/80 font-medium">
            describe your own project below
          </span>
        </p>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  hovered,
  onHover,
  onSelect,
  disabled,
}: {
  template: Template;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (template: Template) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
        disabled ? "opacity-40 pointer-events-none" : ""
      } ${
        hovered
          ? "border-accent/60 shadow-[0_0_32px_rgba(99,102,241,0.2)] -translate-y-1"
          : "border-border hover:border-accent/30"
      }`}
      style={{ background: template.bgColor }}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => !disabled && onSelect(template)}
    >
      {/* Preview image */}
      <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
        <Image
          src={template.previewImage}
          alt={template.name}
          fill
          className={`object-cover object-top transition-transform duration-500 ${
            hovered ? "scale-105" : "scale-100"
          }`}
          unoptimized
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to bottom, transparent 40%, ${template.bgColor} 100%)`,
            opacity: hovered ? 0.7 : 1,
          }}
        />

        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
            style={{
              background: `${template.accentColor}22`,
              color: template.accentColor,
              border: `1px solid ${template.accentColor}44`,
            }}
          >
            {CATEGORY_ICONS[template.category]}
            {template.category}
          </span>
        </div>

        {/* Hover CTA overlay */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white backdrop-blur-sm"
            style={{ background: `${template.accentColor}cc` }}
          >
            Generate project
            <ArrowRight size={15} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-base font-semibold text-white leading-tight">
            {template.name}
          </h3>
          <ArrowRight
            size={16}
            className={`text-muted mt-0.5 flex-shrink-0 transition-all duration-200 ${
              hovered ? "translate-x-1 opacity-100" : "opacity-40"
            }`}
            style={{ color: hovered ? template.accentColor : undefined }}
          />
        </div>

        <p className="text-xs font-medium mb-2" style={{ color: template.accentColor }}>
          {template.tagline}
        </p>

        <p className="text-xs text-gray-400 leading-relaxed mb-3">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[10px] font-medium"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
