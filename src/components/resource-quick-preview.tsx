import { useId, type ReactNode } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { badgeLabel, ui, type Lang } from "@/lib/i18n";
import { licenseSpecified, sourceNumber, type Resource } from "@/lib/resources";

type ResourceQuickPreviewProps = {
  lang: Lang;
  resource: Resource;
  children: ReactNode;
};

export function ResourceQuickPreview({ lang, resource, children }: ResourceQuickPreviewProps) {
  const t = ui[lang];
  const previewId = useId();
  const reviewed = resource.verifiedAt
    ? new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${resource.verifiedAt}T00:00:00Z`))
    : t.reviewNotRecorded;

  return (
    <HoverCard openDelay={320} closeDelay={100}>
      <HoverCardTrigger asChild aria-describedby={previewId}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        id={previewId}
        align="center"
        side="top"
        sideOffset={12}
        collisionPadding={16}
        className="resource-preview"
        role="tooltip"
        aria-label={t.quickPreview}
      >
        <div className="preview-heading">
          <span>{t.quickPreview}</span>
          <span>OA—{sourceNumber(resource)}</span>
        </div>
        <h3>{resource.name}</h3>
        <p className="preview-description">
          <span>{t.useCase}</span>
          {resource.description}
        </p>
        <dl className="preview-facts">
          <div>
            <dt>{t.format}</dt>
            <dd>{resource.format}</dd>
          </div>
          <div>
            <dt>{t.access}</dt>
            <dd>{badgeLabel(lang, resource.access)}</dd>
          </div>
          <div>
            <dt>{t.pricing}</dt>
            <dd>{badgeLabel(lang, resource.pricing)}</dd>
          </div>
          <div>
            <dt>{t.license}</dt>
            <dd className={!licenseSpecified(resource) ? "preview-unknown" : undefined}>
              {licenseSpecified(resource) ? t.licenseInNotes : t.licenseUnspecified}
            </dd>
          </div>
          <div>
            <dt>{t.reviewed}</dt>
            <dd>{reviewed}</dd>
          </div>
        </dl>
        <div className="preview-usage">
          <span>{t.usageNotes}</span>
          <p>{resource.limitation}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
