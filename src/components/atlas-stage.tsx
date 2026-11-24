import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { badgeLabel, catLabel, ui, type Lang } from "@/lib/i18n";
import { resources, sourceNumber, type Resource } from "@/lib/resources";
import { ResourceIcon } from "@/components/resource-card";

const featuredIds = ["nasa-3d", "poly-haven", "open-meteo", "internet-archive"];
const positions = [
  { x: "13%", y: "27%", rotation: "-7deg" },
  { x: "86%", y: "23%", rotation: "6deg" },
  { x: "17%", y: "78%", rotation: "4deg" },
  { x: "84%", y: "76%", rotation: "-5deg" },
];

export function AtlasContours() {
  return (
    <svg
      className="atlas-contours"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M-120 610C88 424 202 722 400 566C592 414 658 160 878 222C1090 281 1132 554 1546 338" />
        <path d="M-94 646C114 456 230 752 424 598C616 444 686 198 892 256C1098 314 1162 578 1532 376" />
        <path d="M-66 684C142 492 258 782 450 630C640 478 716 238 908 292C1104 347 1192 604 1518 416" />
        <path d="M-36 724C170 530 286 812 476 664C664 514 746 280 924 330C1110 382 1222 630 1504 458" />
        <path d="M1100-80C962 90 1094 174 1238 118C1382 62 1458 102 1518 190" />
        <path d="M1064-52C944 102 1072 202 1222 148C1372 94 1442 138 1502 222" />
        <path d="M1028-24C926 118 1050 230 1206 178C1362 126 1426 174 1486 254" />
      </g>
    </svg>
  );
}

function IndexCard({
  lang,
  resource,
  position,
}: {
  lang: Lang;
  resource: Resource;
  position: (typeof positions)[number];
}) {
  const t = ui[lang];
  return (
    <div
      className="index-card-slot"
      style={
        {
          "--card-x": position.x,
          "--card-y": position.y,
          "--card-rotation": position.rotation,
        } as CSSProperties
      }
    >
      <Link
        className="index-card"
        to="/resources/$id"
        params={{ id: resource.id }}
        aria-label={`${resource.name} — ${t.viewSource}`}
      >
        <div className="index-card-top">
          <span>OA—{sourceNumber(resource)}</span>
          <span>{catLabel(lang, resource.category)}</span>
        </div>
        <div className="index-card-body">
          <span className={`resource-icon${resource.type === "Dataset" ? " dataset" : ""}`}>
            <ResourceIcon resource={resource} size={23} />
          </span>
          <div>
            <h2>{resource.name}</h2>
            <p>{resource.description}</p>
          </div>
        </div>
        <div className="index-card-footer">
          <span className={`type-badge${resource.type === "Dataset" ? " dataset" : ""}`}>
            {badgeLabel(lang, resource.type)}
          </span>
          <span>
            {badgeLabel(lang, resource.access)} · {badgeLabel(lang, resource.pricing)}
          </span>
          <ArrowUpRight size={14} />
        </div>
      </Link>
    </div>
  );
}

export function AtlasCards({ lang }: { lang: Lang }) {
  const items = featuredIds
    .map((id) => resources.find((resource) => resource.id === id))
    .filter((resource): resource is Resource => Boolean(resource));
  return (
    <div className="index-cards" aria-label={ui[lang].featuredSources}>
      {items.map((resource, index) => (
        <IndexCard
          key={resource.id}
          lang={lang}
          resource={resource}
          position={positions[index] ?? positions[0]!}
        />
      ))}
    </div>
  );
}
