import { Link } from "@tanstack/react-router";
import { useId, type CSSProperties, type ReactNode } from "react";
import {
  ArrowUpRight,
  Atom,
  Bookmark,
  Boxes,
  Brain,
  Briefcase,
  CheckCircle2,
  CloudSun,
  Code2,
  Cpu,
  Database,
  Dna,
  Factory,
  FlaskConical,
  Globe2,
  GraduationCap,
  Landmark,
  Languages,
  Leaf,
  Library,
  Map,
  Palette,
  Rocket,
  Scale,
  ShieldHalf,
  TrainFront,
  TrendingUp,
  Trophy,
  Users,
  Utensils,
  Waves,
  Wheat,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ResourceQuickPreview } from "@/components/resource-quick-preview";
import { badgeLabel, badgeTip, catLabel, ui, type Lang } from "@/lib/i18n";
import { licenseSpecified, resources, sourceNumber, type Resource } from "@/lib/resources";

const icons = {
  "AI & Machine Learning": Brain,
  "Software & Developer Tools": Code2,
  Cybersecurity: ShieldHalf,
  "3D & Graphics": Boxes,
  Technology: Cpu,
  Research: FlaskConical,
  "Science & Space": Rocket,
  "Biology & Genomics": Dna,
  "Chemistry & Materials": Atom,
  "Industry & Materials": Factory,
  "Weather & Climate": CloudSun,
  Geography: Map,
  "Nature & Environment": Leaf,
  "Oceans & Water": Waves,
  Agriculture: Wheat,
  Energy: Zap,
  "Transport & Mobility": TrainFront,
  Government: Landmark,
  "Finance & Economics": TrendingUp,
  "Business & Trade": Briefcase,
  "Society & Development": Users,
  Education: GraduationCap,
  "Law & Justice": Scale,
  "Food & Health": Utensils,
  "Archives & Libraries": Library,
  "Arts & Culture": Palette,
  "Data & Knowledge": Database,
  "Language & Linguistics": Languages,
  "Sports & Games": Trophy,
  Other: Globe2,
};

export function ResourceIcon({ resource, size = 21 }: { resource: Resource; size?: number }) {
  const Icon = icons[resource.category as keyof typeof icons] ?? Code2;
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}

function Tip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-56 text-xs leading-relaxed">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

type ResourceCardProps = {
  lang: Lang;
  resource: Resource;
  saved: boolean;
  index: number;
  featured?: boolean;
  onSave: () => void;
  onDetails: () => void;
  transitionTarget?: boolean;
};

export function ResourceCard({
  lang,
  resource,
  saved,
  index,
  featured = false,
  onSave,
  onDetails,
  transitionTarget = false,
}: ResourceCardProps) {
  const t = ui[lang];
  const previewId = useId();
  const dataset = resource.type === "Dataset";
  const hasPage = resources.some((item) => item.id === resource.id && item.url === resource.url);

  return (
    <ResourceQuickPreview lang={lang} resource={resource} previewId={previewId}>
      <article
        className={`resource-card${featured ? " featured" : ""}`}
        data-resource-id={resource.id}
        data-transition-target={transitionTarget || undefined}
        style={{ "--card-order": index } as CSSProperties}
      >
        <div className="card-top">
          <div className={`resource-icon${dataset ? " dataset" : ""}`}>
            <ResourceIcon resource={resource} />
          </div>
          <div className="card-actions">
            <span className="source-number">OA—{sourceNumber(resource)}</span>
            <Tip label={badgeTip(lang, resource.type)}>
              <span className={`type-badge${dataset ? " dataset" : ""}`}>
                {dataset ? <Database size={11} /> : <Code2 size={11} />}
                {badgeLabel(lang, resource.type)}
              </span>
            </Tip>
            <Button
              variant="ghost"
              size="icon"
              className="save-button"
              onClick={onSave}
              aria-label={saved ? t.removeAria(resource.name) : t.saveAria(resource.name)}
              title={saved ? t.removeTitle : t.saveTitle}
              aria-pressed={saved}
            >
              <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
        <h3>
          {hasPage ? (
            <Link to="/resources/$id" params={{ id: resource.id }}>
              {resource.name}
            </Link>
          ) : (
            resource.name
          )}
        </h3>
        <p>{resource.description}</p>
        <div className="card-tags">
          <Tip label={badgeTip(lang, resource.pricing)}>
            <span className="free">
              <CheckCircle2 size={11} />
              {badgeLabel(lang, resource.pricing)}
            </span>
          </Tip>
          <span aria-hidden="true">·</span>
          <Tip label={badgeTip(lang, resource.access)}>
            <span>{badgeLabel(lang, resource.access)}</span>
          </Tip>
          <span className="tag">{resource.format}</span>
          {!licenseSpecified(resource) && (
            <Tip label={t.licenseTip}>
              <span className="tag">{t.licenseUnspecified}</span>
            </Tip>
          )}
        </div>
        <div className="card-footer">
          <span>{catLabel(lang, resource.category)}</span>
          <Button variant="link" className="source-link" onClick={onDetails}>
            {t.viewSource}
            <ArrowUpRight size={13} />
          </Button>
        </div>
      </article>
    </ResourceQuickPreview>
  );
}
