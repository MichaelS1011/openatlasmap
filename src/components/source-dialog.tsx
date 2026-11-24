import type { ReactNode } from "react";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { badgeLabel, badgeTip, ui, type Lang } from "@/lib/i18n";
import { licenseSpecified, type Resource } from "@/lib/resources";

type SourceDialogProps = {
  lang: Lang;
  resource: Resource | null;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
};

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

export function SourceDialog({ lang, resource, saved, onClose, onSave }: SourceDialogProps) {
  const t = ui[lang];
  return (
    <Dialog
      open={resource !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="source-dialog" closeLabel={t.close}>
        <DialogHeader>
          <DialogTitle>{resource?.name}</DialogTitle>
          <DialogDescription>{resource?.description}</DialogDescription>
        </DialogHeader>
        {resource && (
          <div className="source-dialog-body">
            <div className="dialog-badges">
              <Tip label={badgeTip(lang, resource.type)}>
                <span className="type-badge">{badgeLabel(lang, resource.type)}</span>
              </Tip>
              <Tip label={badgeTip(lang, resource.pricing)}>
                <span className="type-badge">{badgeLabel(lang, resource.pricing)}</span>
              </Tip>
              <Tip label={badgeTip(lang, resource.access)}>
                <span className="type-badge">{badgeLabel(lang, resource.access)}</span>
              </Tip>
              <span className="type-badge">{resource.format}</span>
              {!licenseSpecified(resource) && (
                <Tip label={t.licenseTip}>
                  <span className="type-badge">{t.licenseUnspecified}</span>
                </Tip>
              )}
            </div>
            <div className="dialog-condition">
              <h3>{t.accessConditions}</h3>
              <p>{resource.limitation}</p>
            </div>
            <p className="dialog-url">{resource.url}</p>
            <div className="dialog-actions">
              <Button asChild>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  {t.openOriginalSource}
                  <ArrowUpRight size={15} />
                </a>
              </Button>
              <Button variant="outline" onClick={onSave}>
                <Bookmark size={14} />
                {saved ? t.saved : t.save}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
