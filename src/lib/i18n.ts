// UI strings and localized labels for the two-language site (en + de).
// Resource entries (names, descriptions, limitations) intentionally stay English —
// API docs and dataset metadata are inherently English. Only chrome is translated.

export type Lang = "en" | "de";

export const paths = (lang: Lang) =>
  lang === "en"
    ? { home: "/", about: "/about", other: "/de/", otherLabel: "Deutsch" }
    : { home: "/de/", about: "/de/about", other: "/", otherLabel: "English" };

const en = {
  langSwitchLabel: "Switch language",
  themeAuto: "Use system theme",
  themeLight: "Use light theme",
  themeDark: "Use dark theme",
  featuredSources: "Featured sources",
  close: "Close",
  sources: "sources",
  discoveryIndex: "Discovery index",
  browseIndex: "Browse the catalog",
  searchResult: "Search result",
  savedIndex: "Saved for later",
  sourcesFound: "sources found",
  withoutKey: "without key",
  searchShortcut: "to search",
  navExplore: "Explore",
  navCollection: "My collection",
  navAbout: "About",
  homeAria: "OpenAtlas home",
  mainNavAria: "Main navigation",
  headerNote: "Open data. Endless possibilities.",
  eyebrow: "A world of data, open to you",
  h1a: "Free APIs & open data.",
  h1b: "Find your next possibility.",
  heroDescA: "Discover the APIs and datasets behind your next big idea.",
  heroDescB: "Tell us what you need. We'll find where to start.",
  vettedSources: (n: number) => `${n} vetted sources`,
  workWithoutKey: (n: number) => `${n} work without a key`,
  licenseNotes: "License notes on every source",
  heroImageAlt: "Sculptural green glass arcs representing connected open data",
  searchAria: "Search APIs and datasets",
  searchPlaceholder: "What are you looking for? Try ‘real-time weather data’",
  clearSearch: "Clear search",
  findResources: "Find resources",
  popularSearches: "Popular searches:",
  searchExamplesLabel: "Try",
  searchExamplesAria: "Example searches",
  searchExamples: [
    { label: "3-D", query: "3-D" },
    { label: "Climate data", query: "climate" },
    { label: "Historical maps", query: "historical map" },
  ] as { label: string; query: string }[],
  browse: "Browse:",
  filters: "Filters",
  reset: "Reset",
  resourceType: "Resource type",
  allResources: "All resources",
  apis: "APIs",
  datasets: "Datasets",
  categoryLabel: "Category",
  allCategories: "All categories",
  accessPricing: "Access & pricing",
  noKeyRequired: "No API key required",
  fullyFreeOnly: "Free, not just a free tier",
  sidebarStrong: "Good ideas start with open data.",
  sidebarSub: "Explore a little. Build something great.",
  resultsCollection: "My collection",
  resultsSearch: "Search results",
  resultsExplore: "Explore the possibilities",
  descCollection: "Your saved resources · kept for this session, ready to export",
  descSearchFor: (term: string, n: number) =>
    `Results for “${term}” · curated catalog of ${n} sources`,
  descExplore: "A few great places to start. Hand-picked, open to explore.",
  exportCollection: "Export collection",
  sessionCollection: "Collection lives only in this session. Export it to keep a copy.",
  sortAria: "Sort resources",
  sortRelevance: "Most relevant",
  sortRecommended: "Recommended",
  sortNewest: "Added recently",
  sortName: "Name: A–Z",
  gridView: "Grid view",
  listView: "List view",
  loadMore: "Load more",
  showing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
  emptyCollectionTitle: "A place for your next ideas",
  emptyCollectionText:
    "Your collection is empty for this session. Save a resource, then export it to keep a copy.",
  exploreResources: "Explore resources",
  emptyNoMatchTitle: "No matching resources",
  emptyNoMatchText: (term: string) =>
    `No source matches “${term}”. Try a corrected or broader term.`,
  emptyFiltersHelp: (count: number) =>
    `${count} ${count === 1 ? "source matches" : "sources match"} before the current filters.`,
  emptySuggestionsTitle: "Try a related term",
  emptyStartingTitle: "Or start here",
  clearSearchAndFilters: "Clear search & filters",
  resetFilters: "Reset filters",
  searchedAt: (time: string) => `Searched ${time}. `,
  searchTimeLocale: "en",
  notice:
    "Free doesn't always mean unlimited. Check source licenses, usage limits, and commercial-use terms. This catalog is curated by hand — it grows over time and can't cover every resource yet.",
  viewSource: "View source",
  save: "Save",
  saved: "Saved",
  saveAria: (name: string) => `Save ${name}`,
  removeAria: (name: string) => `Remove ${name} from collection`,
  saveTitle: "Save to collection",
  removeTitle: "Remove from collection",
  licenseUnspecified: "License: unspecified",
  quickPreview: "Quick preview",
  useCase: "Use case",
  format: "Format",
  access: "Access",
  pricing: "Pricing",
  license: "License",
  licenseInNotes: "Stated in usage notes",
  reviewed: "Reviewed",
  reviewNotRecorded: "Not recorded",
  usageNotes: "Usage notes",
  licenseTip:
    "The original source does not state a clear license on its overview page — check the terms there before commercial use.",
  newBadge: "New",
  accessConditions: "Access & usage conditions",
  openOriginalSource: "Open original source",
  footerTagline: "A little curiosity. A world of possibilities.",
  footerSuggest: "Suggest a source",
  // About page
  aboutEyebrow: "About OpenAtlas",
  aboutTitle: "About OpenAtlas — Curated free APIs & open data",
  aboutDesc:
    "Why OpenAtlas exists, how its catalog of free APIs and open datasets is curated, and how to suggest a resource or reuse the catalog as open data.",
  aboutOgTitle: "About OpenAtlas",
  aboutOgDesc:
    "Mission and curation rules behind a curated directory of free APIs and open datasets.",
  aboutH1: "For the next generation of builders.",
  aboutSub:
    "Created by Michael Soppa to help the next generation turn curiosity into something real.",
  missionH2: "The mission",
  mission1:
    "I built OpenAtlas because I want to support the next generation. Access to knowledge and data can be the starting point for learning, experimenting, and bringing new ideas to life.",
  mission2:
    "My hope is to make that first step easier: to help curious people discover free APIs and open datasets, explore what's possible, and build something of their own.",
  mission3:
    "You don't need a big budget to have a big idea. Sometimes, you just need a place to start.",
  curateH2: "How we curate",
  curateIntro: (n: number) =>
    `OpenAtlas is not a scraped link dump. The ${n} entries follow four practical rules:`,
  faqH2: "Questions people ask",
  openDataH2: "The catalog itself is open data",
  openDataText:
    "Practice what we preach: the full catalog is published under the MIT license as machine-readable JSON, and llms.txt helps AI assistants cite it correctly. Reuse it, cite it, build on it.",
  statusH2: "Live site status",
  statusNote:
    "Cookieless counter by GoatCounter — aggregate visitor counts only, no cookies, no profiles, no personal data.",
  statusVisitsToday: "visitors today",
  statusVisitsTotal: "visitors all time",
  statusCountries: "countries reached",
  involvedH2: "Get involved",
  exploreCatalog: "Explore the catalog",
  suggestResource: "Suggest a resource",
  sourceOnGithub: "Source on GitHub",
  connectMichael: "Connect with Michael",
  availabilityNote:
    "Resource availability can change. Please check the original source for licenses, pricing, and usage limits.",
  curationRules: [
    [
      "Free to use",
      "A resource is only listed if it is free to start: completely free, or with a genuine free tier. Pricing and access requirements are shown on every entry.",
    ],
    [
      "Original source only",
      "Every entry links to the official provider, not a mirror or blog post. You always land where the data lives and can verify licenses yourself.",
    ],
    [
      "Clear conditions",
      "Each entry states pricing, API-key access, formats, and known usage limits. Unspecified licenses are labeled instead of guessed.",
    ],
    [
      "Evidence where available",
      "Entries may include a provider reference and review date. Missing dates are not presented as verified; corrections and reports are welcome through GitHub issues.",
    ],
  ] as [string, string][],
  faqs: [
    [
      "What is OpenAtlas?",
      "OpenAtlas is a free, curated directory of APIs and open datasets. Every entry links to the original source and states the access requirements, pricing model, and usage limits, so you can judge in seconds whether a resource fits your project.",
    ],
    [
      "Are the APIs and datasets really free?",
      "Every listed resource is free to start: entries are either completely free or offer a genuine free tier. Badges show the pricing model and whether an API key is required, and the original source always remains the authority for current licenses and limits.",
    ],
    [
      "How does OpenAtlas decide what gets listed?",
      "A resource is added only if it is free to start, links to its original source, fits one of the subject categories, and has clear access and usage conditions. Provider references and review dates are included where available; corrections are welcome through GitHub issues.",
    ],
    [
      "Can I suggest a resource?",
      "Yes. Use the Suggest a resource form on GitHub. Include the original source URL, what it offers, and whether an API key is needed. The catalog is also published as open data in JSON format.",
    ],
  ] as [string, string][],
};

const de: typeof en = {
  langSwitchLabel: "Sprache wechseln",
  themeAuto: "Systemdesign verwenden",
  themeLight: "Helles Design verwenden",
  themeDark: "Dunkles Design verwenden",
  featuredSources: "Ausgewählte Quellen",
  close: "Schließen",
  sources: "Quellen",
  discoveryIndex: "Entdeckungsindex",
  browseIndex: "Katalog durchstöbern",
  searchResult: "Suchergebnis",
  savedIndex: "Für später gemerkt",
  sourcesFound: "Quellen gefunden",
  withoutKey: "ohne Key",
  searchShortcut: "zum Suchen",
  navExplore: "Entdecken",
  navCollection: "Meine Sammlung",
  navAbout: "Über uns",
  homeAria: "OpenAtlas Startseite",
  mainNavAria: "Hauptnavigation",
  headerNote: "Offene Daten. Unendliche Möglichkeiten.",
  eyebrow: "Eine Welt voller Daten — offen für dich",
  h1a: "Kostenlose APIs & Open Data.",
  h1b: "Finde deine nächste Möglichkeit.",
  heroDescA: "Entdecke die APIs und Datensätze hinter deiner nächsten großen Idee.",
  heroDescB: "Sag uns, was du brauchst. Wir finden den Einstieg.",
  vettedSources: (n: number) => `${n} geprüfte Quellen`,
  workWithoutKey: (n: number) => `${n} ohne Schlüssel nutzbar`,
  licenseNotes: "Lizenzhinweise zu jeder Quelle",
  heroImageAlt: "Skulpturale grüne Glasbögen als Symbol vernetzter offener Daten",
  searchAria: "APIs und Datensätze durchsuchen",
  searchPlaceholder: "Wonach suchst du? Zum Beispiel „Echtzeit-Wetterdaten“",
  clearSearch: "Suche löschen",
  findResources: "Quellen finden",
  popularSearches: "Beliebte Suchen:",
  searchExamplesLabel: "Probier",
  searchExamplesAria: "Beispielsuchen",
  searchExamples: [
    { label: "3-D", query: "3-D" },
    { label: "Klimadaten", query: "climate" },
    { label: "Historische Karten", query: "historical map" },
  ] as { label: string; query: string }[],
  browse: "Stöbern:",
  filters: "Filter",
  reset: "Zurücksetzen",
  resourceType: "Art der Quelle",
  allResources: "Alle Quellen",
  apis: "APIs",
  datasets: "Datensätze",
  categoryLabel: "Kategorie",
  allCategories: "Alle Kategorien",
  accessPricing: "Zugang & Kosten",
  noKeyRequired: "Ohne API-Key nutzbar",
  fullyFreeOnly: "Komplett kostenlos, nicht nur Free-Tier",
  sidebarStrong: "Gute Ideen beginnen mit offenen Daten.",
  sidebarSub: "Stöbere ein wenig. Baue etwas Großartiges.",
  resultsCollection: "Meine Sammlung",
  resultsSearch: "Suchergebnisse",
  resultsExplore: "Entdecke die Möglichkeiten",
  descCollection: "Deine gemerkten Quellen · nur für diese Sitzung, bereit zum Export",
  descSearchFor: (term: string, n: number) =>
    `Ergebnisse für „${term}“ · kuratiertes Verzeichnis mit ${n} Quellen`,
  descExplore: "Ein paar starke Startpunkte. Von Hand ausgewählt, offen nutzbar.",
  exportCollection: "Sammlung exportieren",
  sessionCollection:
    "Die Sammlung gilt nur für diese Sitzung. Exportiere sie, um eine Kopie zu behalten.",
  sortAria: "Quellen sortieren",
  sortRelevance: "Relevanteste",
  sortRecommended: "Empfohlen",
  sortNewest: "Zuletzt hinzugefügt",
  sortName: "Name: A–Z",
  gridView: "Rasteransicht",
  listView: "Listenansicht",
  loadMore: "Mehr laden",
  showing: (shown: number, total: number) => `${shown} von ${total} angezeigt`,
  emptyCollectionTitle: "Ein Ort für deine nächsten Ideen",
  emptyCollectionText:
    "Deine Sammlung ist für diese Sitzung leer. Merke eine Quelle und exportiere sie, um eine Kopie zu behalten.",
  exploreResources: "Quellen entdecken",
  emptyNoMatchTitle: "Keine passenden Quellen",
  emptyNoMatchText: (term: string) =>
    `Keine Quelle passt zu „${term}“. Versuche einen korrigierten oder breiteren Begriff.`,
  emptyFiltersHelp: (count: number) =>
    `${count} ${count === 1 ? "Quelle passt" : "Quellen passen"} ohne die aktuellen Filter.`,
  emptySuggestionsTitle: "Verwandten Begriff versuchen",
  emptyStartingTitle: "Oder hier starten",
  clearSearchAndFilters: "Suche & Filter löschen",
  resetFilters: "Filter zurücksetzen",
  searchedAt: (time: string) => `Suche um ${time} Uhr. `,
  searchTimeLocale: "de",
  notice:
    "Kostenlos heißt nicht automatisch uneingeschränkt nutzbar. Prüfe Lizenz, Nutzungsgrenzen und kommerzielle Bedingungen direkt bei der Quelle. Dieses Verzeichnis wird von Hand kuratiert — es wächst stetig und kann noch nicht alles abdecken.",
  viewSource: "Quelle ansehen",
  save: "Merken",
  saved: "Gemerkt",
  saveAria: (name: string) => `${name} merken`,
  removeAria: (name: string) => `${name} aus der Sammlung entfernen`,
  saveTitle: "Zur Sammlung hinzufügen",
  removeTitle: "Aus der Sammlung entfernen",
  licenseUnspecified: "Lizenz: nicht angegeben",
  quickPreview: "Kurzvorschau",
  useCase: "Anwendungsfall",
  format: "Format",
  access: "Zugang",
  pricing: "Preise",
  license: "Lizenz",
  licenseInNotes: "In den Nutzungshinweisen angegeben",
  reviewed: "Geprüft",
  reviewNotRecorded: "Nicht vermerkt",
  usageNotes: "Nutzungshinweise",
  licenseTip:
    "Die Originalquelle nennt auf ihrer Übersichtsseite keine klare Lizenz — prüfe die Bedingungen dort vor kommerzieller Nutzung.",
  newBadge: "Neu",
  accessConditions: "Zugangs- und Nutzungsbedingungen",
  openOriginalSource: "Originalquelle öffnen",
  footerTagline: "Ein bisschen Neugier. Unendliche Möglichkeiten.",
  footerSuggest: "Quelle vorschlagen",
  aboutEyebrow: "Über OpenAtlas",
  aboutTitle: "Über OpenAtlas — Kuratierte kostenlose APIs & Open Data",
  aboutDesc:
    "Warum es OpenAtlas gibt, wie das Verzeichnis kostenloser APIs und offener Datensätze kuratiert wird und wie du eine Quelle vorschlägst oder das Verzeichnis als Open Data nutzt.",
  aboutOgTitle: "Über OpenAtlas",
  aboutOgDesc:
    "Mission und Kuratierungsregeln eines kuratierten Verzeichnisses kostenloser APIs und offener Datensätze.",
  aboutH1: "Für die nächste Generation von Macherinnen und Machern.",
  aboutSub:
    "Von Michael Soppa gegründet, damit die nächste Generation aus Neugier etwas Wirkliches macht.",
  missionH2: "Die Mission",
  mission1:
    "Ich habe OpenAtlas gebaut, weil ich die nächste Generation unterstützen will. Zugang zu Wissen und Daten kann der Ausgangspunkt sein: zum Lernen, Experimentieren und um neue Ideen wahr werden zu lassen.",
  mission2:
    "Meine Hoffnung: den ersten Schritt leichter machen — Neugierigen helfen, kostenlose APIs und offene Datensätze zu entdecken, Möglichkeiten auszuloten und etwas Eigenes zu bauen.",
  mission3:
    "Für eine große Idee brauchst du kein großes Budget. Manchmal brauchst du einfach einen Ort, an dem du anfangen kannst.",
  curateH2: "So kuratieren wir",
  curateIntro: (n: number) =>
    `OpenAtlas ist kein gescrapter Link-Haufen. Die ${n} Einträge folgen vier praktischen Regeln:`,
  faqH2: "Fragen, die häufig gestellt werden",
  openDataH2: "Das Verzeichnis selbst ist Open Data",
  openDataText:
    "Wir leben, was wir fordern: Das komplette Verzeichnis erscheint als maschinenlesbares JSON unter MIT-Lizenz, und llms.txt hilft KI-Assistenten beim korrekten Zitieren. Weiterverwenden, zitieren, darauf aufbauen.",
  statusH2: "Live-Status der Seite",
  statusNote:
    "Cookieloses Zählen mit GoatCounter — nur aggregierte Besucherzahlen, keine Cookies, keine Profile, keine personenbezogenen Daten.",
  statusVisitsToday: "Besucher heute",
  statusVisitsTotal: "Besucher insgesamt",
  statusCountries: "Länder erreicht",
  involvedH2: "Mach mit",
  exploreCatalog: "Verzeichnis entdecken",
  suggestResource: "Quelle vorschlagen",
  sourceOnGithub: "Quellcode auf GitHub",
  connectMichael: "Michael kontaktieren",
  availabilityNote:
    "Die Verfügbarkeit von Quellen kann sich ändern. Prüfe Lizenz, Preise und Nutzungsgrenzen bitte direkt bei der Originalquelle.",
  curationRules: [
    [
      "Kostenlos nutzbar",
      "Eine Quelle steht nur drin, wenn der Einstieg kostenlos ist: komplett frei oder mit einem echten Free-Tier. Preise und Zugangsanforderungen stehen bei jedem Eintrag.",
    ],
    [
      "Nur die Originalquelle",
      "Jeder Eintrag verlinkt zum offiziellen Anbieter — nicht zu Spiegeln oder Blogartikeln. Du landest immer dort, wo die Daten leben, und kannst Lizenzen selbst prüfen.",
    ],
    [
      "Klare Bedingungen",
      "Jeder Eintrag nennt Preise, API-Key-Zugang, Formate und bekannte Nutzungsgrenzen. Nicht angegebene Lizenzen werden als ungeprüft markiert, nicht geraten.",
    ],
    [
      "Belege, wo verfügbar",
      "Einträge können einen Anbieter-Beleg und ein Prüfdatum enthalten. Fehlende Daten werden nicht als verifiziert dargestellt; Korrekturen und Hinweise sind per GitHub-Issue willkommen.",
    ],
  ],
  faqs: [
    [
      "Was ist OpenAtlas?",
      "OpenAtlas ist ein kostenloses, kuratiertes Verzeichnis von APIs und offenen Datensätzen. Jeder Eintrag verlinkt auf die Originalquelle und nennt Zugangsvoraussetzungen, Preismodell und Nutzungsgrenzen — so erkennst du in Sekunden, ob eine Quelle zu deinem Projekt passt.",
    ],
    [
      "Sind die APIs und Datensätze auf OpenAtlas wirklich kostenlos?",
      "Jede gelistete Quelle ist kostenlos starten: Einträge sind komplett frei oder bieten einen echten Free-Tier. Badges zeigen das Preismodell und ob ein API-Key nötig ist. Maßgeblich für aktuelle Lizenzen und Grenzen bleibt immer die Originalquelle.",
    ],
    [
      "Nach welchen Regeln entscheidet OpenAtlas über Einträge?",
      "Eine Quelle wird nur aufgenommen, wenn sie kostenlos startet, auf die Originalquelle verlinkt, in eine Themakategorie passt und klare Zugangs- und Nutzungsbedingungen hat. Anbieter-Belege und Prüfdaten stehen dort, wo sie verfügbar sind; Korrekturen sind per GitHub-Issue willkommen.",
    ],
    [
      "Kann ich eine Quelle vorschlagen?",
      "Ja. Nutze das Formular „Quelle vorschlagen“ auf GitHub. Gib die URL der Originalquelle an, was sie bietet und ob ein API-Key nötig ist. Das Verzeichnis erscheint außerdem als Open Data im JSON-Format.",
    ],
  ],
};

export const ui: Record<Lang, typeof en> = { en, de };

export const catalogMeta: Record<
  Lang,
  { title: string; description: string; ogTitle: string; ogDescription: string }
> = {
  en: {
    title: "OpenAtlas — Discover Free APIs & Open Data",
    description:
      "Browse a curated catalog of free APIs and open datasets. Explore original sources, formats, access requirements, and free-use limits with OpenAtlas.",
    ogTitle: "OpenAtlas — Discover Free APIs & Open Data",
    ogDescription:
      "Find the right free API or open dataset for your next idea, with instant filtering and original source links.",
  },
  de: {
    title: "OpenAtlas — Kostenlose APIs & Open Data entdecken",
    description:
      "Kuratiertes Verzeichnis kostenloser APIs und offener Datensätze. Originalquellen, Formate, Zugangsvoraussetzungen und kostenlose Nutzung auf einen Blick.",
    ogTitle: "OpenAtlas — Kostenlose APIs & Open Data entdecken",
    ogDescription:
      "Finde die passende kostenlose API oder offene Datensammlung für deine nächste Idee — mit Sofort-Filtern und Links zur Originalquelle.",
  },
};

const categoryDe: Record<string, string> = {
  "AI & Machine Learning": "KI & Maschinelles Lernen",
  "Software & Developer Tools": "Software & Entwickler-Tools",
  Cybersecurity: "Cybersicherheit",
  "3D & Graphics": "3D & Grafik",
  Technology: "Technologie",
  Research: "Forschung",
  "Science & Space": "Wissenschaft & Weltraum",
  "Biology & Genomics": "Biologie & Genomik",
  "Chemistry & Materials": "Chemie & Materialien",
  "Industry & Materials": "Industrie & Materialien",
  "Weather & Climate": "Wetter & Klima",
  Geography: "Geografie",
  "Nature & Environment": "Natur & Umwelt",
  "Oceans & Water": "Meere & Wasser",
  Agriculture: "Landwirtschaft",
  Energy: "Energie",
  "Transport & Mobility": "Verkehr & Mobilität",
  Government: "Staat & Verwaltung",
  "Finance & Economics": "Finanzen & Wirtschaft",
  "Business & Trade": "Wirtschaft & Handel",
  "Society & Development": "Gesellschaft & Entwicklung",
  Education: "Bildung",
  "Law & Justice": "Recht & Justiz",
  "Food & Health": "Ernährung & Gesundheit",
  "Archives & Libraries": "Archive & Bibliotheken",
  "Arts & Culture": "Kunst & Kultur",
  "Data & Knowledge": "Daten & Wissen",
  "Language & Linguistics": "Sprache & Linguistik",
  "Sports & Games": "Sport & Spiele",
  Other: "Sonstiges",
};

export function catLabel(lang: Lang, category: string) {
  return lang === "de" ? (categoryDe[category] ?? category) : category;
}

const badgeDe: Record<string, string> = {
  Free: "Kostenlos",
  "Free tier": "Free-Tier",
  "No key": "Ohne Key",
  "API key": "API-Key",
  Unknown: "Unklar",
  API: "API",
  Dataset: "Datensatz",
};

export function badgeLabel(lang: Lang, value: string) {
  return lang === "de" ? (badgeDe[value] ?? value) : value;
}

const badgeTipsDe: Record<string, string> = {
  Free: "Kostenlos in der Nutzung.",
  "Free tier": "Kostenlos starten — erst wenn du mehr Nutzung brauchst, kostet es.",
  "No key": "Sofort nutzbar, ohne Anmeldung.",
  "API key":
    "Du brauchst zuerst einen kostenlosen Account beim Anbieter für deinen persönlichen Schlüssel.",
  Unknown: "Wir haben die Zugangsregeln noch nicht verifiziert — prüfe die Quellseite.",
  API: "Ein Dienst, den dein Code über das Internet aufrufen kann.",
  Dataset: "Eine Datensammlung, die du herunterladen und erkunden kannst.",
};

export function badgeTip(lang: Lang, value: string) {
  return lang === "de" ? (badgeTipsDe[value] ?? value) : (badgeTipsEn[value] ?? value);
}

const badgeTipsEn: Record<string, string> = {
  Free: "Costs nothing to use.",
  "Free tier": "Free to start — you only pay if you need more usage later.",
  "No key": "You can use it right away, no sign-up required.",
  "API key": "You need a free account at the source to get a personal key first.",
  Unknown: "We haven't verified the access rules yet — check the source site.",
  API: "A service your code can call over the internet.",
  Dataset: "A collection of data you can download and explore.",
};

export const popularTopics = [
  "Weather & climate",
  "Finance",
  "Space",
  "Public transport",
  "AI & machine learning",
];

const groupDe: Record<string, string> = {
  "Technology & creative tools": "Technologie & kreative Tools",
  "Science & research": "Wissenschaft & Forschung",
  "Earth & infrastructure": "Erde & Infrastruktur",
  "Economy & society": "Wirtschaft & Gesellschaft",
  "Culture & knowledge": "Kultur & Wissen",
};

export function groupLabel(lang: Lang, label: string) {
  return lang === "de" ? (groupDe[label] ?? label) : label;
}
