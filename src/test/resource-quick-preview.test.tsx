import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResourceQuickPreview } from "@/components/resource-quick-preview";
import { resources, type Resource } from "@/lib/resources";

const base = { ...resources[0]!, verifiedAt: "2026-11-24" };

function renderPreview(lang: "en" | "de", resource: Resource = base) {
  return render(
    <ResourceQuickPreview lang={lang} resource={resource}>
      <button type="button">Open-Meteo</button>
    </ResourceQuickPreview>,
  );
}

const FOCUSABLE = 'a[href], button, [tabindex]:not([tabindex="-1"]), input, select, textarea';

describe("ResourceQuickPreview", () => {
  it("stays closed until the reader opens it", () => {
    renderPreview("en");
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("opens on keyboard focus without adding another tab stop", async () => {
    renderPreview("en");
    const trigger = screen.getByRole("button", { name: "Open-Meteo" });
    fireEvent.focus(trigger);

    const preview = await screen.findByRole("tooltip", { name: "Quick preview" });
    expect(preview).toHaveTextContent(base.name);
    expect(preview).toHaveTextContent("Use case");
    expect(preview).toHaveTextContent("24 Nov 2026");
    expect(preview.id).toBeTruthy();
    expect(trigger.getAttribute("aria-describedby")).toBe(preview.id);
    expect(preview.querySelectorAll(FOCUSABLE)).toHaveLength(0);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("opens on hover", async () => {
    renderPreview("en");
    fireEvent.pointerEnter(screen.getByRole("button", { name: "Open-Meteo" }), {
      pointerType: "mouse",
    });
    await screen.findByRole("tooltip", { name: "Quick preview" }, { timeout: 2000 });
  });

  it("closes again when focus leaves the card", async () => {
    renderPreview("en");
    const trigger = screen.getByRole("button", { name: "Open-Meteo" });
    fireEvent.focus(trigger);
    await screen.findByRole("tooltip", { name: "Quick preview" });
    fireEvent.blur(trigger);
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull(), { timeout: 2000 });
  });

  it("closes again on Escape", async () => {
    renderPreview("en");
    fireEvent.focus(screen.getByRole("button", { name: "Open-Meteo" }));
    await screen.findByRole("tooltip", { name: "Quick preview" });
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull(), { timeout: 2000 });
  });

  it("translates access and pricing the way the card does", async () => {
    renderPreview("de", { ...base, access: "No key", pricing: "Free" });
    fireEvent.focus(screen.getByRole("button", { name: "Open-Meteo" }));

    const preview = await screen.findByRole("tooltip", { name: "Kurzvorschau" });
    expect(preview).toHaveTextContent("Ohne Key");
    expect(preview).toHaveTextContent("Kostenlos");
    expect(preview).not.toHaveTextContent("No key");
  });

  it("states missing review dates and licenses honestly", async () => {
    renderPreview("de", {
      ...base,
      verifiedAt: undefined,
      limitation: "Check the site for current terms",
    });
    fireEvent.focus(screen.getByRole("button", { name: "Open-Meteo" }));

    const preview = await screen.findByRole("tooltip", { name: "Kurzvorschau" });
    expect(preview).toHaveTextContent("Nicht vermerkt");
    expect(preview).toHaveTextContent("Lizenz: nicht angegeben");
  });
});
