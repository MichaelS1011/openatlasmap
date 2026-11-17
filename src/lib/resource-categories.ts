export const categoryGroups = [
  { label: "Technology & creative tools", categories: ["AI & Machine Learning", "Software & Developer Tools", "Cybersecurity", "3D & Graphics", "Technology"] },
  { label: "Science & research", categories: ["Research", "Science & Space", "Biology & Genomics", "Chemistry & Materials", "Industry & Materials"] },
  { label: "Earth & infrastructure", categories: ["Weather & Climate", "Geography", "Nature & Environment", "Oceans & Water", "Agriculture", "Energy", "Transport & Mobility"] },
  { label: "Economy & society", categories: ["Government", "Finance & Economics", "Business & Trade", "Society & Development", "Education", "Law & Justice", "Food & Health"] },
  { label: "Culture & knowledge", categories: ["Archives & Libraries", "Arts & Culture", "Data & Knowledge", "Language & Linguistics", "Sports & Games", "Other"] },
] as const;

export const curatedCategories: readonly string[] = categoryGroups.flatMap((group) => [...group.categories]);

const categoryCorrections: Record<string, string> = {
  wikidata: "Data & Knowledge",
  "open-library": "Archives & Libraries",
  crossref: "Research",
  openalex: "Research",
  ror: "Research",
  datacite: "Research",
  osv: "Cybersecurity",
  "cisa-kev": "Cybersecurity",
  uniprot: "Biology & Genomics",
  ensembl: "Biology & Genomics",
  "rcsb-pdb": "Biology & Genomics",
  chembl: "Chemistry & Materials",
  pubchem: "Chemistry & Materials",
  fred: "Finance & Economics",
  "census-api": "Business & Trade",
};

export function curatedCategory(id: string, category: string): string {
  return categoryCorrections[id] ?? category;
}