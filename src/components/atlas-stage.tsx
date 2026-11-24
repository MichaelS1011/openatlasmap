import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { badgeLabel, catLabel, ui, type Lang } from "@/lib/i18n";
import { resources, sourceNumber, type Resource } from "@/lib/resources";
import { ResourceIcon } from "@/components/resource-card";

const featuredIds = [
  "nasa-3d",
  "poly-haven",
  "open-meteo",
  "internet-archive",
  "world-bank",
  "rest-countries",
  "wikidata",
  "open-library",
];
const positions = [
  {
    x: "13%",
    y: "22%",
    rotation: "-7deg",
    endRotation: "-5.4deg",
    scale: "0.92",
    endScale: "0.95",
    opacity: "0.86",
    fromX: "-18px",
    fromY: "-8px",
    toX: "30px",
    toY: "14px",
    duration: "34s",
    delay: "-9s",
  },
  {
    x: "86%",
    y: "18%",
    rotation: "6deg",
    endRotation: "4.6deg",
    scale: "0.78",
    endScale: "0.81",
    opacity: "0.68",
    fromX: "16px",
    fromY: "-10px",
    toX: "-34px",
    toY: "18px",
    duration: "43s",
    delay: "-21s",
  },
  {
    x: "7%",
    y: "50%",
    rotation: "8deg",
    endRotation: "6.5deg",
    scale: "0.74",
    endScale: "0.77",
    opacity: "0.6",
    fromX: "-12px",
    fromY: "12px",
    toX: "28px",
    toY: "-18px",
    duration: "39s",
    delay: "-13s",
  },
  {
    x: "93%",
    y: "44%",
    rotation: "-8deg",
    endRotation: "-6.2deg",
    scale: "0.84",
    endScale: "0.87",
    opacity: "0.72",
    fromX: "14px",
    fromY: "-14px",
    toX: "-30px",
    toY: "20px",
    duration: "47s",
    delay: "-28s",
  },
  {
    x: "16%",
    y: "76%",
    rotation: "4deg",
    endRotation: "5.6deg",
    scale: "0.84",
    endScale: "0.86",
    opacity: "0.74",
    fromX: "-20px",
    fromY: "8px",
    toX: "36px",
    toY: "-16px",
    duration: "52s",
    delay: "-5s",
  },
  {
    x: "84%",
    y: "74%",
    rotation: "-5deg",
    endRotation: "-3.4deg",
    scale: "0.96",
    endScale: "0.99",
    opacity: "0.9",
    fromX: "18px",
    fromY: "-12px",
    toX: "-42px",
    toY: "14px",
    duration: "37s",
    delay: "-24s",
  },
  {
    x: "37%",
    y: "94%",
    rotation: "-2deg",
    endRotation: "-0.8deg",
    scale: "0.66",
    endScale: "0.69",
    opacity: "0.5",
    fromX: "-14px",
    fromY: "-6px",
    toX: "26px",
    toY: "8px",
    duration: "56s",
    delay: "-17s",
  },
  {
    x: "65%",
    y: "91%",
    rotation: "3deg",
    endRotation: "4.4deg",
    scale: "0.72",
    endScale: "0.75",
    opacity: "0.56",
    fromX: "16px",
    fromY: "-8px",
    toX: "-32px",
    toY: "10px",
    duration: "49s",
    delay: "-33s",
  },
] as const;

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
  index,
}: {
  lang: Lang;
  resource: Resource;
  position: (typeof positions)[number];
  index: number;
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
          "--card-end-rotation": position.endRotation,
          "--card-scale": position.scale,
          "--card-end-scale": position.endScale,
          "--card-opacity": position.opacity,
          "--drift-from-x": position.fromX,
          "--drift-from-y": position.fromY,
          "--drift-to-x": position.toX,
          "--drift-to-y": position.toY,
          "--drift-duration": position.duration,
          "--drift-delay": position.delay,
          "--arrive-delay": `${index * 85}ms`,
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
          index={index}
        />
      ))}
    </div>
  );
}
